import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class InputTokensDetailsDto {
  /**
   * The number of tokens that were retrieved from the cache.
   * [More on prompt caching](https://platform.openai.com/docs/guides/prompt-caching).
   */
  @ApiProperty({
    description: `The number of tokens that were retrieved from the cache.
  [More on prompt caching](https://platform.openai.com/docs/guides/prompt-caching).`,
    type: 'number',
  })
  @IsNumber()
  cached_tokens!: number;
}
