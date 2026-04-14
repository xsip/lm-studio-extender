import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { McpModule, McpTransportType } from '@rekog/mcp-nest';
import { TokenUsageTool } from './tools/token-usage.tool';
import { LmStudioModule } from './modules/lm-studio/lmstudio.module';
import { ChatsModule } from './modules/chats/chats.module';
import { ChatMetadataModule } from './modules/chat-metadata/chat-metadata.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/roles.guard';
import { TokenLimitModule } from './modules/token-limit/token-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/lmStudioWrapper',
        ),
      }),
    }),
    McpModule.forRoot({
      name: 'my-toolbox',
      version: '1.0.0',
      apiPrefix: 'tools',
      transport: [McpTransportType.STREAMABLE_HTTP, McpTransportType.SSE],
      streamableHttp: {
        enableJsonResponse: true,
      },
    }),
    LmStudioModule,
    ChatsModule,
    ChatMetadataModule,
    AuthModule,
    TokenLimitModule,
  ],
  controllers: [],
  providers: [
    AppService,
    TokenUsageTool,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
