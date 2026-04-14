import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatsModule } from '../chats/chats.module';
import { ChatMetadataModule } from '../chat-metadata/chat-metadata.module';
import { TokenLimitModule } from '../token-limit/token-limit.module';
import { OpenaiController } from './openai.controller';
import { OpenAiService } from './openai.service';

@Module({
  imports: [HttpModule, ChatsModule, ChatMetadataModule, TokenLimitModule],
  controllers: [OpenaiController],
  providers: [OpenAiService],
})
export class OpenaiModule {}
