import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { InputTokensDetailsDto } from './InputTokensDetailsDto';
import { OutputTokensDetailsDto } from './OutputTokensDetailsDto';

export class ResponseUsageDto {
  /** The number of input tokens. */
  @ApiProperty({
    description: `The number of input tokens.`,
    type: 'number',
  })
  @IsNumber()
  input_tokens!: number;

  /** A detailed breakdown of the input tokens. */
  @ApiProperty({
    description: `A detailed breakdown of the input tokens.`,
    type: () => InputTokensDetailsDto,
  })
  @ValidateNested()
  @Type(() => InputTokensDetailsDto)
  input_tokens_details!: InputTokensDetailsDto;

  /** The number of output tokens. */
  @ApiProperty({
    description: `The number of output tokens.`,
    type: 'number',
  })
  @IsNumber()
  output_tokens!: number;

  /** A detailed breakdown of the output tokens. */
  @ApiProperty({
    description: `A detailed breakdown of the output tokens.`,
    type: () => OutputTokensDetailsDto,
  })
  @ValidateNested()
  @Type(() => OutputTokensDetailsDto)
  output_tokens_details!: OutputTokensDetailsDto;

  /** The total number of tokens used. */
  @ApiProperty({
    description: `The total number of tokens used.`,
    type: 'number',
  })
  @IsNumber()
  total_tokens!: number;
}
