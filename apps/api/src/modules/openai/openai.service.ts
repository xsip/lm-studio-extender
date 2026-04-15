import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { Types } from 'mongoose';
import * as crypto from 'crypto';
import { ChatsService } from '../chats/chats.service';
import { ChatMetadataService } from '../chat-metadata/chat-metadata.service';
import { TokenLimitService } from '../token-limit/token-limit.service';

// ---------------------------------------------------------------------------
// SSE event shapes we care about
// ---------------------------------------------------------------------------
import OpenAI from 'openai';
import { ModelOpenAiDto } from './dto/model-dtos';

import {
  ResponseCreateParamsNonStreamingDto,
  ResponseCreateParamsStreamingDto,
} from './dto/create-response-dtos';
import { ResponseStreamEvent } from 'openai/resources/responses/responses';
import { Stream } from 'openai/streaming';
import dayjs from 'dayjs';
import { ChatClient } from '../chat-metadata/chat-metadata.schema';

interface ChatEndEvent {
  type: 'chat.end';
  result: any;
}

// ---------------------------------------------------------------------------

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly baseUrl: string;
  public readonly selfMcpUrl: string;
  private readonly apiToken: string;
  public readonly openAi: OpenAI;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly chatsService: ChatsService,
    private readonly chatMetadataService: ChatMetadataService,
    private readonly tokenLimitService: TokenLimitService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'LM_STUDIO_BASE_URL',
      'http://localhost:1234',
    );
    this.apiToken = this.configService.get<string>('LM_STUDIO_API_TOKEN', '');

    this.openAi = new OpenAI({
      apiKey: this.apiToken,
      baseURL: this.baseUrl + '/v1',
    });

    this.selfMcpUrl = this.configService.get<string>(
      'SELF_MCP_URL',
      'http://192.128.0.34:8888/tools/mcp',
    );
  }

  /**
   * Expose userModel so the controller can still perform its own DB look-ups
   * (token-reset check). The model lives in TokenLimitService now.
   */
  get userModel() {
    return this.tokenLimitService.userModel;
  }

  // ---------------------------------------------------------------------------
  // GET /api/v1/models
  // ---------------------------------------------------------------------------

  private async _getModels(
    page: OpenAI.ModelsPage,
    currentModels: ModelOpenAiDto[],
  ): Promise<ModelOpenAiDto[]> {
    const models = [...currentModels, ...page.data];
    if (page.hasNextPage())
      return this._getModels(await page.getNextPage(), models);
    return models;
  }

  async getModels(): Promise<ModelOpenAiDto[]> {
    try {
      const models = await this.openAi.models.list();
      if (models.hasNextPage()) {
        return this._getModels(await models.getNextPage(), models.data);
      }

      return models.data;
    } catch (err) {
      this.handleError('getModels', err);
    }
  }

  async chatStream(
    userId: Types.ObjectId,
    dto: ResponseCreateParamsNonStreamingDto | ResponseCreateParamsStreamingDto,
    res: Response,
    token: string,
    internalChatId?: string,
    name?: string,
    chatMetaId?: string,
  ): Promise<void> {
    const mappedDto:
      | ResponseCreateParamsNonStreamingDto
      | ResponseCreateParamsStreamingDto = {
      model: dto.model,
      input: dto.input as string,
      reasoning: dto.reasoning,
      stream: true,
      tools: [
        {
          type: 'mcp',
          server_label: 'my-toolbox',
          server_url: this.selfMcpUrl,
          headers: {
            authorization: `Bearer ${token}`,
          },
          allowed_tools: ['greeting-tool', 'get-token-usage-tool'],
        } as any,
      ],
      previous_response_id: dto.previous_response_id,
      store: true,
    };

    const isNewChat = !internalChatId;
    const chatId = internalChatId ?? this.generateChatId();

    let resolvedChatMetaId: string | undefined = chatMetaId;
    if (isNewChat && !resolvedChatMetaId) {
      resolvedChatMetaId = await this.chatMetadataService.createAndReturnId(
        userId,
        {
          client: ChatClient.OPENAI,
          name: chatId,
          usedModel: dto.model!,
          reasoningMode: dto.reasoning?.effort ?? 'off',
          tools: (mappedDto.tools?.filter(
            (i) => typeof i === 'object' && (i as any).type === 'mcp',
          ) ?? []) as any,
        },
      );
    } else if (!isNewChat && resolvedChatMetaId) {
      await this.chatMetadataService.update(userId, resolvedChatMetaId, {
        lastMessageSentAt: new Date(),
      });
    }

    if (!isNewChat) {
      const previousResponseId = await this.chatsService.getLatestResponseId(
        userId,
        chatId,
      );
      if (previousResponseId) {
        mappedDto.previous_response_id = previousResponseId;
      }
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream: Stream<ResponseStreamEvent> =
      (await this.openAi.responses.create(mappedDto as any)) as any;
    for await (const event of stream) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
      if (isNewChat) {
        this.writeSseEvent(res, 'created_chat', {
          type: 'created_chat',
          result: resolvedChatMetaId,
        });
      }

      if (event.type === 'response.completed') {
        await this.chatsService.saveEntry(
          userId,
          chatId,
          dto,
          event.response as any,
          name,
          resolvedChatMetaId,
        );

        // ── Token accounting via TokenLimitService ──────────────────────
        const tokensUsed =
          (event.response.usage?.input_tokens ?? 0) +
          (event.response.usage?.total_tokens ?? 0) +
          (event.response.usage?.output_tokens_details?.reasoning_tokens || 0);

        const updatedUser = await this.tokenLimitService.updateUsedTokens(
          userId,
          tokensUsed,
        );

        const limit = await this.tokenLimitService.getTokensPerIntervall(
          updatedUser.subscription,
        );

        if (updatedUser.usedTokens >= limit) {
          this.writeSseEvent(res, 'api.info', {
            type: 'api.info',
            message: `Rate limit reached. Resets at ${dayjs(updatedUser.tokenCountResetDate).toString()}`,
          });
        }
        // ───────────────────────────────────────────────────────────────
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private generateChatId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private writeSseEvent(
    res: Response,
    type: string,
    payload: Record<string, unknown>,
  ): void {
    res.write(`event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`);
  }

  private extractChatEndEvent(rawText: string): ChatEndEvent | null {
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const jsonStr = line.slice('data:'.length).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
        if (parsed.type === 'chat.end' && parsed.result) {
          return parsed as unknown as ChatEndEvent;
        }
      } catch {
        // not valid JSON — skip
      }
    }
    return null;
  }

  private authHeaders(): Record<string, string> {
    return this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {};
  }

  private handleError(method: string, err: unknown): never {
    this.logger.error(`[${method}] LM Studio request failed`, err);
    throw new InternalServerErrorException(
      `AI Model issue: ${(err as Error)?.message ? (err as Error)?.message : 'unknown'}`,
    );
  }
}
