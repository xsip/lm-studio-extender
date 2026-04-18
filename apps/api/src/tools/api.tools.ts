import { Injectable } from '@nestjs/common';
import { Context, Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { SubscriptionType, User } from '../modules/auth/user.schema';
import { TokenLimitService } from '../modules/token-limit/token-limit.service';
import type { Request } from 'express';
import dayjs from 'dayjs';
import { ChatMetadataService } from '../modules/chat-metadata/chat-metadata.service';
import { Types } from 'mongoose';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ApiTools {
  constructor(
    private readonly tokenLimitService: TokenLimitService,
    private readonly chatMetaDataService: ChatMetadataService,
  ) {}

  @Tool({
    name: 'greeting-tool',
    description: 'Returns a greeting with progress updates',
    parameters: z.object({
      name: z.string().default('World'),
    }),
  })
  async sayHello({ name }, context: Context) {
    console.log(context);
    await context.reportProgress({ progress: 50, total: 100 });
    return `Hello2, ${name}!`;
  }

  @Tool({
    name: 'get-token-usage-tool',
    description:
      'Returns current token usage and limit info for the authenticated user',
  })
  async getTokenUsage(data, context: Context, request: Request) {
    // @ts-ignore
    const user = request.user as User;
    const subscription: SubscriptionType =
      user.subscription ?? SubscriptionType.FREE;

    const limit =
      await this.tokenLimitService.getTokensPerIntervall(subscription);

    let configInfo = '';
    try {
      const cfg = await this.tokenLimitService.findBySubscription(subscription);
      const resetsAt = user.tokenCountResetDate
        ? dayjs(user.tokenCountResetDate).toString()
        : 'not set';
      configInfo = ` Limit resets every ${cfg.minutesTillReset} minute(s). Next reset: ${resetsAt}.`;
    } catch {
      // config not found in DB — skip extra info
    }

    return (
      `You used ${user.usedTokens ?? 0} tokens out of ${limit} tokens ` +
      `(subscription: ${subscription}).${configInfo}`
    );
  }

  @Tool({
    name: 'decrypt-message-tool',
    description:
      'Decrypts a user message. MUST receive the full, exact, unmodified user input',
    parameters: z.object({
      full_user_message: z.string().default('Test'),
    }),
  })
  async decryptMessage(
    { full_user_message }: { full_user_message: string },
    context: Context,
    request: Request,
  ) {
    // @ts-ignore
    const user = request.user as User;
    const chatId = request.headers['chatid'] as string;

    if (!full_user_message) {
      return `Didnt receive any message to decrypt!`;
    }

    try {
      const chatMetaData = await this.chatMetaDataService.findOne(
        (user as any)._id as Types.ObjectId,
        chatId,
      );

      if (!chatMetaData) {
        return `Sorry, but chat with id ${chatId} not found.`;
      }

      if (!chatMetaData.useCrypto) return `This chat doesnt use encryption!`;

      if (!chatMetaData.cryptoKey)
        return `UseCrypto is true, but crypto key not set. Can't decrypt!`;

      return CryptoJS.AES.decrypt(
        full_user_message,
        chatMetaData.cryptoKey,
      )?.toString(CryptoJS.enc.Utf8);
    } catch (e: any) {
      return `There was an error decrypting your message!!`;
    }
  }
}
