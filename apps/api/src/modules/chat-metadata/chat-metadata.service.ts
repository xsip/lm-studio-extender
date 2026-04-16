import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ChatMetadata,
  ChatMetadataDocument,
  ChatMetadataDto,
} from './chat-metadata.schema';
import { Chat, ChatDocument } from '../chats/chat.schema';
import { CreateChatMetadataDto } from './dto/create-chat-metadata.dto';
import { UpdateChatMetadataDto } from './dto/update-chat-metadata.dto';

@Injectable()
export class ChatMetadataService {
  private readonly logger = new Logger(ChatMetadataService.name);

  constructor(
    @InjectModel(ChatMetadata.name)
    private readonly metaModel: Model<ChatMetadataDocument>,
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
  ) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async create(
    userId: Types.ObjectId,
    dto: CreateChatMetadataDto,
  ): Promise<ChatMetadataDocument> {
    const doc = new this.metaModel({
      ...dto,
      userId,
      tools: dto.tools ?? [],
    });
    const saved = await doc.save();
    this.logger.log(`Created ChatMetadata id=${saved._id} user=${userId}`);
    return saved;
  }

  // ── Read all (for user) ───────────────────────────────────────────────────

  async findAll(userId: Types.ObjectId): Promise<ChatMetadataDocument[]> {
    return this.metaModel
      .find({ userId })
      .select('-cryptoKey')
      .sort({ createdAt: -1 })
      .exec();
  }

  // ── Read one ──────────────────────────────────────────────────────────────

  async findOne(
    userId: Types.ObjectId,
    id: string,
  ): Promise<ChatMetadataDocument> {
    this.assertObjectId(id);
    const doc = await this.metaModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`ChatMetadata ${id} not found`);
    this.assertOwner(userId, doc);
    return doc;
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async update(
    userId: Types.ObjectId,
    id: string,
    dto: UpdateChatMetadataDto,
  ): Promise<ChatMetadataDocument> {
    this.assertObjectId(id);
    const doc = await this.metaModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`ChatMetadata ${id} not found`);
    this.assertOwner(userId, doc);

    Object.assign(doc, dto);
    await doc.save();
    this.logger.log(`Updated ChatMetadata id=${id}`);
    return doc;
  }

  // ── Delete (cascade) ──────────────────────────────────────────────────────

  async remove(userId: Types.ObjectId, id: string): Promise<void> {
    this.assertObjectId(id);
    const doc = await this.metaModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`ChatMetadata ${id} not found`);
    this.assertOwner(userId, doc);

    // Cascade: delete all chat messages that reference this meta id
    const { deletedCount } = await this.chatModel
      .deleteMany({ chatInternalId: id })
      .exec();
    this.logger.log(
      `Cascade-deleted ${deletedCount} chats for ChatMetadata id=${id}`,
    );

    await doc.deleteOne();
    this.logger.log(`Deleted ChatMetadata id=${id}`);
  }

  // ── Internal helper used by LmStudioService ───────────────────────────────

  /**
   * Create a ChatMetadata record and return its hex ObjectId string so
   * LmStudioService can stamp `chatInternalId` on each chat message.
   */
  async createAndReturnId(
    userId: Types.ObjectId,
    dto: CreateChatMetadataDto,
  ): Promise<string> {
    const doc = await this.create(userId, dto);
    return (doc._id as Types.ObjectId).toHexString();
  }

  // ── Guards ────────────────────────────────────────────────────────────────

  private assertOwner(userId: Types.ObjectId, doc: ChatMetadataDocument): void {
    if (!doc.userId.equals(userId)) {
      throw new ForbiddenException(
        'You do not have access to this chat metadata',
      );
    }
  }

  private assertObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid id: ${id}`);
    }
  }
}
