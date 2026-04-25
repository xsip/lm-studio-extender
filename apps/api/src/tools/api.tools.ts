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
import { InvokeService } from '../modules/invoke/invoke.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'node:fs';
import { join } from 'node:path';
import { AssetsService } from '../modules/assets/assets.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiTools {
  constructor(
    private readonly tokenLimitService: TokenLimitService,
    private readonly chatMetaDataService: ChatMetadataService,
    private readonly invokeService: InvokeService,
    private readonly httpService: HttpService,
    private readonly assetsService: AssetsService,
    private readonly configService: ConfigService
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
    let minutes_till_reset = 0;
    let resets_at: string = '';
    try {
      const cfg = await this.tokenLimitService.findBySubscription(subscription);
      const resetsAt = user.tokenCountResetDate
        ? dayjs(user.tokenCountResetDate).toString()
        : 'not set';
      configInfo = ` Limit resets every ${cfg.minutesTillReset} minute(s). Next reset: ${resetsAt}.`;
      minutes_till_reset = cfg.minutesTillReset;
      resets_at = resetsAt;
    } catch {
      // config not found in DB — skip extra info
    }

    return {
      used_tokens: user.usedTokens ?? 0,
      max_tokens: limit,
      reset_interval_minutes: minutes_till_reset,
      minutes_till_reset,
      subscription,
      next_reset: resets_at,
    };
    /*
    return (
      `You used ${user.usedTokens ?? 0} tokens out of ${limit} tokens ` +
      `(subscription: ${subscription}).${configInfo}`
    );*/
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

  @Tool({
    name: 'generate-image-tool',
    description: 'Generates an image with the users prompt',
    parameters: z.object({
      prompt: z.string().default('Generate an image of a dog'),
    }),
  })
  async generateImage(
    { prompt }: { prompt: string },
    context: Context,
    request: Request,
  ) {
    const useInvoke = this.configService.get<string>('INVOKE_INTEGRATION') === 'true';
    if (!useInvoke) {
      return 'Invoke integration is not enabled. Tell the user to Make sure to set "INVOKE_INTEGRATION" to true in .env when starting LMStudio Extender!';
    }
    const user = (request as any).user as User & { _id?: Types.ObjectId };
    const chatId = request.headers['chatid'] as string;

    if (!user) return `User not defined!!`;
    if (!chatId) return `chatId not defined!!`;
    if (!prompt) return `Didn't receive any prompt!`;

    const img = await this.invokeService.generateImage(prompt);

    const fileName =
      img.fullPath
        .split('/')
        .reverse()
        .find((segment) => segment.includes('.')) ?? 'image.png';

    const imageResponse = await firstValueFrom(
      this.httpService.get<ArrayBuffer>(img.fullPath, {
        responseType: 'arraybuffer',
      }),
    );

    const mimeType =
      (imageResponse.headers['content-type'] as string)?.split(';')[0].trim() ??
      (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
        ? 'image/jpeg'
        : 'image/png');

    const buffer = Buffer.from(imageResponse.data);

    // Upload via assetsService, same as the REST endpoint
    const { url, filename } = await this.assetsService.uploadFile(
      user._id + '',
      chatId,
      fileName,
      buffer,
      mimeType,
    );
    return [
      {
        type: 'image',
        source: {
          type: 'url',
          url: `${process.env.SELF_URL}/assets/filequery/${filename}?userId=${user._id + ''}&chatId=${chatId}`,
        },
      },
      {
        role: 'ai',
        type: 'text',
        text: 'Please show the image url in form of markdown and describe this generated image to me.',
      },
    ];
  }
}
