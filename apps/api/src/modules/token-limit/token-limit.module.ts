import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TokenLimitConfig,
  TokenLimitConfigSchema,
} from './token-limit-config.schema';
import { TokenLimitService } from './token-limit.service';
import { TokenLimitController } from './token-limit.controller';
import { User, UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenLimitConfig.name, schema: TokenLimitConfigSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TokenLimitController],
  providers: [TokenLimitService],
  exports: [TokenLimitService],
})
export class TokenLimitModule {}
