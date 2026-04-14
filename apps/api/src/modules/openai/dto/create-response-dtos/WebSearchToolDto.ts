import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { FiltersDto } from './FiltersDto';
import { UserLocationDto } from './UserLocationDto';

export class WebSearchToolDto {
  /** The type of the web search tool. One of `web_search` or `web_search_2025_08_26`. */
  @ApiProperty({ description: `The type of the web search tool. One of \`web_search\` or \`web_search_2025_08_26\`.`, enum: ['web_search', 'web_search_2025_08_26'] })
  @IsIn(['web_search', 'web_search_2025_08_26'])
  type!: 'web_search' | 'web_search_2025_08_26';

  /** Filters for the search. */
  @ApiProperty({ required: false, description: `Filters for the search.` })
  @IsOptional()
  filters?: null | FiltersDto;

  /** High level guidance for the amount of context window space to use for the
search. One of `low`, `medium`, or `high`. `medium` is the default. */
  @ApiProperty({ required: false, description: `High level guidance for the amount of context window space to use for the
search. One of \`low\`, \`medium\`, or \`high\`. \`medium\` is the default.`, enum: ['low', 'high', 'medium'] })
  @IsOptional()
  @IsIn(['low', 'high', 'medium'])
  search_context_size?: 'low' | 'high' | 'medium';

  /** The approximate location of the user. */
  @ApiProperty({ required: false, description: `The approximate location of the user.` })
  @IsOptional()
  user_location?: null | UserLocationDto;
}
