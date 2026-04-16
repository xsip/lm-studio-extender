import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus, Param,
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
  ApiParam,
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
import {
  ResponseAudioDeltaEventDto,
  ResponseAudioDoneEventDto,
  ResponseAudioTranscriptDeltaEventDto,
  ResponseAudioTranscriptDoneEventDto,
  ResponseCodeInterpreterCallCodeDeltaEventDto,
  ResponseCodeInterpreterCallCodeDoneEventDto,
  ResponseCodeInterpreterCallCompletedEventDto,
  ResponseCodeInterpreterCallInProgressEventDto,
  ResponseCodeInterpreterCallInterpretingEventDto,
  ResponseCompletedEventDto,
  ResponseContentPartAddedEventDto,
  ResponseContentPartDoneEventDto,
  ResponseCreatedEventDto,
  ResponseCustomToolCallInputDeltaEventDto,
  ResponseCustomToolCallInputDoneEventDto,
  ResponseErrorEventDto,
  ResponseFailedEventDto,
  ResponseFileSearchCallCompletedEventDto,
  ResponseFileSearchCallInProgressEventDto,
  ResponseFileSearchCallSearchingEventDto,
  ResponseFunctionCallArgumentsDeltaEventDto,
  ResponseFunctionCallArgumentsDoneEventDto,
  ResponseImageGenCallCompletedEventDto,
  ResponseImageGenCallGeneratingEventDto,
  ResponseImageGenCallInProgressEventDto,
  ResponseImageGenCallPartialImageEventDto,
  ResponseIncompleteEventDto,
  ResponseInProgressEventDto,
  ResponseInputFileContentDto,
  ResponseMcpCallArgumentsDeltaEventDto,
  ResponseMcpCallArgumentsDoneEventDto,
  ResponseMcpCallCompletedEventDto,
  ResponseMcpCallFailedEventDto,
  ResponseMcpCallInProgressEventDto,
  ResponseMcpListToolsCompletedEventDto,
  ResponseMcpListToolsFailedEventDto,
  ResponseMcpListToolsInProgressEventDto,
  ResponseOutputItemAddedEventDto,
  ResponseOutputItemDoneEventDto,
  ResponseOutputTextAnnotationAddedEventDto,
  ResponseQueuedEventDto,
  ResponseReasoningSummaryPartAddedEventDto,
  ResponseReasoningSummaryPartDoneEventDto,
  ResponseReasoningSummaryTextDeltaEventDto,
  ResponseReasoningSummaryTextDoneEventDto,
  ResponseReasoningTextDeltaEventDto,
  ResponseReasoningTextDoneEventDto,
  ResponseRefusalDeltaEventDto,
  ResponseRefusalDoneEventDto,
  ResponseTextDeltaEventDto,
  ResponseTextDoneEventDto,
  ResponseWebSearchCallCompletedEventDto,
  ResponseWebSearchCallInProgressEventDto,
  ResponseWebSearchCallSearchingEventDto,
} from './dto/get-response-dtos';
import { ChatCompletionCreateParamsStreamingDto } from './dto/completions-dtos/ChatCompletionCreateParamsStreamingDto';
import {
  ChatCompletionCreateParamsNonStreamingDto
} from './dto/completions-dtos/ChatCompletionCreateParamsNonStreamingDto';

@ApiTags('OpenAI')
@ApiBearerAuth()
@ApiExtraModels(
  ResponseCreateParamsNonStreamingDto,
  ResponseCreateParamsStreamingDto,
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

  @ApiExtraModels(
    ResponseAudioDeltaEventDto,
    ResponseAudioDoneEventDto,
    ResponseAudioTranscriptDeltaEventDto,
    ResponseAudioTranscriptDoneEventDto,
    ResponseCodeInterpreterCallCodeDeltaEventDto,
    ResponseCodeInterpreterCallCodeDoneEventDto,
    ResponseCodeInterpreterCallCompletedEventDto,
    ResponseCodeInterpreterCallInProgressEventDto,
    ResponseCodeInterpreterCallInterpretingEventDto,
    ResponseCompletedEventDto,
    ResponseContentPartAddedEventDto,
    ResponseContentPartDoneEventDto,
    ResponseCreatedEventDto,
    ResponseErrorEventDto,
    ResponseFileSearchCallCompletedEventDto,
    ResponseFileSearchCallInProgressEventDto,
    ResponseFileSearchCallSearchingEventDto,
    ResponseFunctionCallArgumentsDeltaEventDto,
    ResponseFunctionCallArgumentsDoneEventDto,
    ResponseInProgressEventDto,
    ResponseFailedEventDto,
    ResponseIncompleteEventDto,
    ResponseOutputItemAddedEventDto,
    ResponseOutputItemDoneEventDto,
    ResponseReasoningSummaryPartAddedEventDto,
    ResponseReasoningSummaryPartDoneEventDto,
    ResponseReasoningSummaryTextDeltaEventDto,
    ResponseReasoningSummaryTextDoneEventDto,
    ResponseReasoningTextDeltaEventDto,
    ResponseReasoningTextDoneEventDto,
    ResponseRefusalDeltaEventDto,
    ResponseRefusalDoneEventDto,
    ResponseTextDeltaEventDto,
    ResponseTextDoneEventDto,
    ResponseWebSearchCallCompletedEventDto,
    ResponseWebSearchCallInProgressEventDto,
    ResponseWebSearchCallSearchingEventDto,
    ResponseImageGenCallCompletedEventDto,
    ResponseImageGenCallGeneratingEventDto,
    ResponseImageGenCallInProgressEventDto,
    ResponseImageGenCallPartialImageEventDto,
    ResponseMcpCallArgumentsDeltaEventDto,
    ResponseMcpCallArgumentsDoneEventDto,
    ResponseMcpCallCompletedEventDto,
    ResponseMcpCallFailedEventDto,
    ResponseMcpCallInProgressEventDto,
    ResponseMcpListToolsCompletedEventDto,
    ResponseMcpListToolsFailedEventDto,
    ResponseMcpListToolsInProgressEventDto,
    ResponseOutputTextAnnotationAddedEventDto,
    ResponseQueuedEventDto,
    ResponseCustomToolCallInputDeltaEventDto,
    ResponseCustomToolCallInputDoneEventDto,
  )
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
          $ref: getSchemaPath(ResponseInputFileContentDto),
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
    dto: ResponseCreateParamsNonStreamingDto | ResponseCreateParamsStreamingDto,
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

  @ApiExtraModels(
    ChatCompletionCreateParamsNonStreamingDto,
    ChatCompletionCreateParamsStreamingDto,
  )
  @Post('completions-stream')
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
    operationId: 'completionsStreamOpenAi',
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
          $ref: getSchemaPath(ChatCompletionCreateParamsNonStreamingDto),
        },
        {
          $ref: getSchemaPath(ChatCompletionCreateParamsStreamingDto),
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
  async completionsStream(
    @CurrentUser() user: User,
    @CurrentToken() token: string,
    @Body()
    dto:
      | ChatCompletionCreateParamsNonStreamingDto
      | ChatCompletionCreateParamsStreamingDto,
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

    return this.openAiService.chatStreamCompletions(
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
