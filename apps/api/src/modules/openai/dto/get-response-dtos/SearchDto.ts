import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SourceDto } from './SourceDto';

export class SearchDto {
  /** [DEPRECATED] The search query. */
  @ApiProperty({ description: `[DEPRECATED] The search query.`, type: 'string' })
  @IsString()
  query!: string;

  /** The action type. */
  @ApiProperty({ description: `The action type.`, example: 'search' })
  @Equals('search')
  type!: 'search';

  /** The search queries. */
  @ApiProperty({ required: false, description: `The search queries.`, isArray: true })
  @IsOptional()
  @IsArray()
  queries?: string[];

  /** The sources used in the search. */
  @ApiProperty({ required: false, description: `The sources used in the search.`, type: () => [SourceDto], isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SourceDto)
  sources?: SourceDto[];
}
