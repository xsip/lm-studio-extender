import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CompletionTokensDetailsDto } from './CompletionTokensDetailsDto';
import { PromptTokensDetailsDto } from './PromptTokensDetailsDto';

export class CompletionUsageDto {
  /** Number of tokens in the generated completion. */
  @ApiProperty({
    description: `Number of tokens in the generated completion.`,
    type: 'number',
  })
  @IsNumber()
  completion_tokens!: number;

  /** Number of tokens in the prompt. */
  @ApiProperty({
    description: `Number of tokens in the prompt.`,
    type: 'number',
  })
  @IsNumber()
  prompt_tokens!: number;

  /** Total number of tokens used in the request (prompt + completion). */
  @ApiProperty({
    description: `Total number of tokens used in the request (prompt + completion).`,
    type: 'number',
  })
  @IsNumber()
  total_tokens!: number;

  /** Breakdown of tokens used in a completion. */
  @ApiProperty({
    required: false,
    description: `Breakdown of tokens used in a completion.`,
    type: () => CompletionTokensDetailsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompletionTokensDetailsDto)
  completion_tokens_details?: CompletionTokensDetailsDto;

  /** Breakdown of tokens used in the prompt. */
  @ApiProperty({
    required: false,
    description: `Breakdown of tokens used in the prompt.`,
    type: () => PromptTokensDetailsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PromptTokensDetailsDto)
  prompt_tokens_details?: PromptTokensDetailsDto;
}
