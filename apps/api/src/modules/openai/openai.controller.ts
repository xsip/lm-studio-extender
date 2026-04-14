import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Response } from 'express';
import dayjs from 'dayjs';

import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.schema';
import { CurrentToken } from '../auth/current-token.decorator';
import { TokenLimitService } from '../token-limit/token-limit.service';
import { OpenAiService } from './openai.service';

import { ModelOpenAiDto } from './dto/model-dtos';
import { ResponseCreateParamsNonStreamingDto } from './dto/create-response-dtos';
import { ResponseCreateParamsStreamingDto } from './dto/create-response-dtos/ResponseCreateParamsStreamingDto';
import { ResponseCreateParamsDto } from './dto/create-response-dtos/ResponseCreateParamsDto';

@ApiTags('OpenAI')
@ApiBearerAuth()
@ApiExtraModels(
  ResponseCreateParamsNonStreamingDto,
  ResponseCreateParamsStreamingDto,
  ResponseCreateParamsDto,
)
@Controller('openai')
export class OpenaiController {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly tokenLimitService: TokenLimitService,
  ) {}

  @Get('models')
  @ApiOperation({
    summary: 'List all available models (LLMs and embedding models)',
    operationId: 'getModelsOpenAi',
  })
  @ApiOkResponse({ type: ModelOpenAiDto, isArray: true })
  getModels(): Promise<ModelOpenAiDto[]> {
    return this.openAiService.getModels();
  }

  @Post('chat-stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Stream a chat response via SSE',
    description:
      'Streams the LM Studio response as Server-Sent Events. ' +
      'Each exchange is persisted in MongoDB under the given `internalChatId`. ' +
      'If `internalChatId` is supplied, the latest `response_id` for that session ' +
      'is fetched from the DB and set as `previous_response_id` on the request ' +
      'so LM Studio maintains conversation context. ' +
      'If `internalChatId` is omitted a new session is created and its generated ' +
      'ID is returned via a `created_chat` SSE event before the stream closes.',
    operationId: 'chatStreamOpenAi',
  })
  @ApiQuery({
    name: 'internalChatId',
    required: false,
    description:
      'MD5 hex string identifying an existing chat session. ' +
      'Omit to start a new session.',
    example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Optional human-readable label for this chat session.',
  })
  @ApiBody({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(ResponseCreateParamsNonStreamingDto),
        },
        {
          $ref: getSchemaPath(ResponseCreateParamsStreamingDto),
        },
        {
          $ref: getSchemaPath(ResponseCreateParamsDto),
        },
      ],
    },
  })
  @ApiProduces('text/event-stream')
  @ApiOkResponse({
    description:
      'Server-Sent Events stream. When no `internalChatId` was supplied, ' +
      'a synthetic `event: created_chat / data: {"type":"created_chat","result":"<md5>"}` ' +
      'event is emitted just before the stream closes.',
    schema: { type: 'string', format: 'binary' },
  })
  async chatStream(
    @CurrentUser() user: User,
    @CurrentToken() token: string,
    @Body()
    dto:
      | ResponseCreateParamsNonStreamingDto
      | ResponseCreateParamsStreamingDto
      | ResponseCreateParamsDto,
    @Res() res: Response,
    @Query('internalChatId') internalChatId?: string,
  ): Promise<void> {
    const userId = (user as any)._id as Types.ObjectId;

    // ── Token window reset ──────────────────────────────────────────────────
    if (
      !user.tokenCountResetDate ||
      dayjs(user.tokenCountResetDate).isBefore(dayjs())
    ) {
      const updatedUser = await this.tokenLimitService.resetTokenLimit(userId);
      user.tokenCountResetDate = updatedUser.tokenCountResetDate;
      user.usedTokens = 0;
    }
    // ───────────────────────────────────────────────────────────────────────

    // ── Rate-limit enforcement ──────────────────────────────────────────────
    const limit = await this.tokenLimitService.getTokensPerIntervall(
      user.subscription,
    );

    if (user.usedTokens && user.usedTokens >= limit) {
      if (dayjs().isBefore(dayjs(user.tokenCountResetDate))) {
        throw new ForbiddenException(
          `Rate limit reached. Resets at ${dayjs(user.tokenCountResetDate).toString()}`,
        );
      }
    }

    return this.openAiService.chatStream(
      userId,
      dto,
      res,
      token,
      internalChatId,
      '',
      internalChatId,
    );
    // ───────────────────────────────────────────────────────────────────────



  }
}
