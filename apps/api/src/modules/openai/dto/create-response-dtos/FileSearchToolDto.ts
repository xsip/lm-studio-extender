import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ComparisonFilterDto } from './ComparisonFilterDto';
import { CompoundFilterDto } from './CompoundFilterDto';
import { RankingOptionsDto } from './RankingOptionsDto';

@ApiExtraModels(
  ComparisonFilterDto,
  CompoundFilterDto,
)
export class FileSearchToolDto {
  /** The type of the file search tool. Always `file_search`. */
  @ApiProperty({
    description: `The type of the file search tool. Always \`file_search\`.`,
    type: 'string',
    enum: ['file_search'],
  })
  @Equals('file_search')
  type!: 'file_search';

  /** The IDs of the vector stores to search. */
  @ApiProperty({
    description: `The IDs of the vector stores to search.`,
    type: 'string',
    isArray: true,
  })
  @IsArray()
  vector_store_ids!: string[];

  /** A filter to apply. */
  @ApiProperty({
    required: false,
    description: `A filter to apply.`,
    oneOf: [
      { $ref: getSchemaPath(ComparisonFilterDto) },
      { $ref: getSchemaPath(CompoundFilterDto) },
    ],
  })
  @IsOptional()
  filters?: null | ComparisonFilterDto | CompoundFilterDto;

  /**
   * The maximum number of results to return. This number should be between 1 and 50
   * inclusive.
   */
  @ApiProperty({
    required: false,
    description: `The maximum number of results to return. This number should be between 1 and 50
  inclusive.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  max_num_results?: number;

  /** Ranking options for search. */
  @ApiProperty({
    required: false,
    description: `Ranking options for search.`,
    type: () => RankingOptionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RankingOptionsDto)
  ranking_options?: RankingOptionsDto;
}
