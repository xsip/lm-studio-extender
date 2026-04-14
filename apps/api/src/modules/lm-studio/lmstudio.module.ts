import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LmStudioController } from './lmstudio.controller';
import { LmStudioService } from './lmstudio.service';
import { ChatsModule } from '../chats/chats.module';
import { ChatMetadataModule } from '../chat-metadata/chat-metadata.module';
import { TokenLimitModule } from '../token-limit/token-limit.module';

@Module({
  imports: [
    HttpModule,
    ChatsModule,
    ChatMetadataModule,
    TokenLimitModule,
  ],
  controllers: [LmStudioController],
  providers: [LmStudioService],
})
export class LmStudioModule {}
