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
import { ImageBlob, ImageBlobSchema } from '../assets/image-blob.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatMetadata.name, schema: ChatMetadataSchema },
      { name: ImageBlob.name, schema: ImageBlobSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatMetadataService],
  exports: [ChatsService], // exported so LmStudioModule can inject it
})
export class ChatsModule {}
