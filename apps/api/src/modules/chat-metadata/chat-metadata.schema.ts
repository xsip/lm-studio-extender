import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EphemeralMcpIntegrationDto } from '../lm-studio/dto/chat.dto';
import { IsIn } from 'class-validator';

export type ChatMetadataDocument = ChatMetadata & Document;
export enum ChatClient {
  OPENAI = 'OPENAI',
  LMSTUDIO = 'LMSTUDIO'
}
@Schema({ collection: 'chat_metadata', timestamps: true })
export class ChatMetadata {
  /** Human-readable name for this chat session */
  @Prop({ required: true, type: String })
  name: string;

  /**
   * The ObjectId of this document IS the reference key used to look up all
   * messages in the "chats" collection via `chatInternalId`.
   * We store it as a virtual — consumers use `_id.toHexString()`.
   */

  /** Which LLM model was used for this session */
  @Prop({ required: true, type: String })
  usedModel: string;

  /** Which Client model was used for this session */
  @Prop({ required: true, type: String })
  client: ChatClient;

  /** Owner — ObjectId of the authenticated user who created this metadata */
  @Prop({ required: true, type: Types.ObjectId, index: true, ref: 'User' })
  userId: Types.ObjectId;

  /** Reasoning mode identifier (e.g. "off", "low", "medium", "high", "on") */
  @Prop({ required: false, type: String })
  reasoningMode?: string;

  /** MCP tool integrations configured for this session */
  @Prop({ required: false, default: [], type: [Object] })
  tools: EphemeralMcpIntegrationDto[];

  @Prop({ required: false, type: Date })
  lastMessageSentAt: Date;
  // `createdAt` / `updatedAt` injected automatically
}

export const ChatMetadataSchema = SchemaFactory.createForClass(ChatMetadata);

// ── Swagger-friendly response DTO ────────────────────────────────────────────

export class ChatMetadataDto {
  @ApiProperty({
    description:
      'MongoDB ObjectId — use as chatInternalId when fetching messages',
  })
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['OPENAI', 'LMSTUDIO'] })
  @IsIn(['OPENAI', 'LMSTUDIO'])
  client: 'OPENAI' | 'LMSTUDIO';

  @ApiProperty()
  usedModel: string;

  @ApiProperty({ description: 'ObjectId of the owning user' })
  userId: string;

  @ApiProperty()
  reasoningMode?: string;

  @ApiPropertyOptional({ type: [EphemeralMcpIntegrationDto] })
  tools: EphemeralMcpIntegrationDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  lastMessageSentAt?: Date;
}
