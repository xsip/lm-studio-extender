import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SubscriptionType } from '../auth/user.schema';

export type TokenLimitConfigDocument = TokenLimitConfig & Document;

@Schema({ collection: 'token_limit_configs', timestamps: true })
export class TokenLimitConfig {
  /** How many minutes until the token counter resets */
  @Prop({ required: true })
  minutesTillReset: number;

  /** How many tokens are allowed within one interval */
  @Prop({ required: true })
  tokensPerInterval: number;

  /** Which subscription tier this config applies to */
  @Prop({
    required: true,
    enum: Object.values(SubscriptionType),
    unique: true,
  })
  subscription: SubscriptionType;
}

export const TokenLimitConfigSchema =
  SchemaFactory.createForClass(TokenLimitConfig);
