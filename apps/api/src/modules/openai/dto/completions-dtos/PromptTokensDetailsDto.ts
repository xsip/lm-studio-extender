import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PromptTokensDetailsDto {
  /** Audio input tokens present in the prompt. */
  @ApiProperty({
    required: false,
    description: `Audio input tokens present in the prompt.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  audio_tokens?: number;

  /** Cached tokens present in the prompt. */
  @ApiProperty({
    required: false,
    description: `Cached tokens present in the prompt.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  cached_tokens?: number;
}
