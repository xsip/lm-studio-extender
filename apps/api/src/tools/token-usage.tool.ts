import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { User, SubscriptionType } from '../modules/auth/user.schema';
import { TokenLimitService } from '../modules/token-limit/token-limit.service';
import type { Request } from 'express';
import dayjs from 'dayjs';

@Injectable()
export class TokenUsageTool {
  constructor(private readonly tokenLimitService: TokenLimitService) {}

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
}
