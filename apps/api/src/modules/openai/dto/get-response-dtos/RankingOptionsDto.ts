import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { HybridSearchDto } from './HybridSearchDto';

export class RankingOptionsDto {
  /**
   * Weights that control how reciprocal rank fusion balances semantic embedding
   * matches versus sparse keyword matches when hybrid search is enabled.
   */
  @ApiProperty({
    required: false,
    description: `Weights that control how reciprocal rank fusion balances semantic embedding
  matches versus sparse keyword matches when hybrid search is enabled.`,
    type: () => HybridSearchDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => HybridSearchDto)
  hybrid_search?: HybridSearchDto;

  /** The ranker to use for the file search. */
  @ApiProperty({
    required: false,
    description: `The ranker to use for the file search.`,
    enum: ['auto', 'default-2024-11-15'],
  })
  @IsOptional()
  @IsIn(['auto', 'default-2024-11-15'])
  ranker?: 'auto' | 'default-2024-11-15';

  /**
   * The score threshold for the file search, a number between 0 and 1. Numbers
   * closer to 1 will attempt to return only the most relevant results, but may
   * return fewer results.
   */
  @ApiProperty({
    required: false,
    description: `The score threshold for the file search, a number between 0 and 1. Numbers
  closer to 1 will attempt to return only the most relevant results, but may
  return fewer results.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  score_threshold?: number;
}
