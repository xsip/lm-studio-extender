import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatMetadataService } from '../chat-metadata/chat-metadata.service';
import {
  ChatMetadata,
  ChatMetadataSchema,
} from '../chat-metadata/chat-metadata.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatMetadata.name, schema: ChatMetadataSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatMetadataService],
  exports: [ChatsService], // exported so LmStudioModule can inject it
})
export class ChatsModule {}
