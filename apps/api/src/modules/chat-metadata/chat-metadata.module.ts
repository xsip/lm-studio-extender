import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMetadata, ChatMetadataSchema } from './chat-metadata.schema';
import { ChatMetadataService } from './chat-metadata.service';
import { ChatMetadataController } from './chat-metadata.controller';
import { Chat, ChatSchema } from '../chats/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMetadata.name, schema: ChatMetadataSchema },
      // Needed for cascade delete of chat messages
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ChatMetadataController],
  providers: [ChatMetadataService],
  exports: [ChatMetadataService], // exported so LmStudioModule can inject it
})
export class ChatMetadataModule {}
