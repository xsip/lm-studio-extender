import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, ChatEntryDto } from './chat.schema';
import { ChatRequestDto } from '../lm-studio/dto/chat.dto';
import { ChatResponseDto } from '../lm-studio/dto/chat-response.dto';
import { ResponseCreateParamsNonStreamingDto } from '../openai/dto/create-response-dtos';
import { ResponseCreateParamsStreamingDto } from '../openai/dto/create-response-dtos/ResponseCreateParamsStreamingDto';
import { ResponseCreateParamsDto } from '../openai/dto/create-response-dtos/ResponseCreateParamsDto';
import { ResponseDto } from '../openai/dto/get-response-dtos';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  /**
   * Persist a single chat exchange under the given chat ID.
   * previousResponseId / responseId are extracted from the DTOs automatically.
   */
  async saveEntry(
    userId: Types.ObjectId,
    internalChatId: string,
    request:
      | ChatRequestDto
      | ResponseCreateParamsNonStreamingDto
      | ResponseCreateParamsStreamingDto
      | ResponseCreateParamsDto,
    response: ChatResponseDto | ResponseDto,
    name?: string,
    chatInternalId?: string,
  ): Promise<ChatDocument> {
    const doc = new this.chatModel({
      userId,
      internalChatId: chatInternalId,
      name: name ?? null,
      request,
      response,
      previousResponseId: request.previous_response_id ?? null,
      responseId:
        (response as ChatResponseDto).response_id ??
        (response as ResponseDto).id ??
        null,
      chatInternalId: chatInternalId ?? null,
    });
    const saved = await doc.save();
    this.logger.log(
      `Saved chat entry — user=${userId} chatId=${internalChatId}`,
    );
    return saved;
  }

  /**
   * Fetch the most-recent response_id for a given session belonging to a user.
   * Returns null when the session has no entries yet (first message).
   * Throws ForbiddenException if entries exist but none belong to this user.
   */
  async getLatestResponseId(
    userId: Types.ObjectId,
    internalChatId: string,
  ): Promise<string | null> {
    // Check whether *any* entry exists for this chatId first
    const latest = await this.chatModel
      .findOne({ internalChatId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!latest) return null; // brand-new session, no previous response

    // Entry exists — enforce ownership
    if (!latest.userId.equals(userId)) {
      throw new ForbiddenException(
        'You do not have access to this chat session',
      );
    }

    return (
      (latest.response as ChatResponseDto).response_id ??
      (latest.response as ResponseDto).id ??
      null
    );
  }

  /**
   * Return all entries for a session, oldest-first.
   * Throws ForbiddenException if the session belongs to a different user.
   */
  async findByInternalChatId(
    userId: Types.ObjectId,
    internalChatId: string,
  ): Promise<ChatEntryDto[]> {
    const entries = await this.chatModel
      .find({ internalChatId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    if (entries.length === 0) return [];

    if (!entries[0].userId.equals(userId)) {
      throw new ForbiddenException(
        'You do not have access to this chat session',
      );
    }

    return entries as unknown as ChatEntryDto[];
  }

  /** Return all unique chat sessions belonging to this user, newest-first. */
  async listChats(
    userId: Types.ObjectId,
  ): Promise<
    { internalChatId: string; name: string | null; lastActivity: Date }[]
  > {
    return this.chatModel
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$internalChatId',
            name: { $first: '$name' },
            lastActivity: { $first: '$createdAt' },
          },
        },
        {
          $project: {
            _id: 0,
            internalChatId: '$_id',
            name: 1,
            lastActivity: 1,
          },
        },
        { $sort: { lastActivity: -1 } },
      ])
      .exec();
  }
}
