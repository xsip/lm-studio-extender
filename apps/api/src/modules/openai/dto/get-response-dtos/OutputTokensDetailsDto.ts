import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class OutputTokensDetailsDto {
  /** The number of reasoning tokens. */
  @ApiProperty({ description: `The number of reasoning tokens.`, type: 'number' })
  @IsNumber()
  reasoning_tokens!: number;
}
