import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional } from 'class-validator';

import { UserLocationDto } from './UserLocationDto';

export class WebSearchPreviewToolDto {
  /** The type of the web search tool. One of `web_search_preview` or
`web_search_preview_2025_03_11`. */
  @ApiProperty({ description: `The type of the web search tool. One of \`web_search_preview\` or
\`web_search_preview_2025_03_11\`.`, enum: ['web_search_preview', 'web_search_preview_2025_03_11'] })
  @IsIn(['web_search_preview', 'web_search_preview_2025_03_11'])
  type!: 'web_search_preview' | 'web_search_preview_2025_03_11';

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  search_content_types?: 'image' | 'text'[];

  /** High level guidance for the amount of context window space to use for the
search. One of `low`, `medium`, or `high`. `medium` is the default. */
  @ApiProperty({ required: false, description: `High level guidance for the amount of context window space to use for the
search. One of \`low\`, \`medium\`, or \`high\`. \`medium\` is the default.`, enum: ['low', 'high', 'medium'] })
  @IsOptional()
  @IsIn(['low', 'high', 'medium'])
  search_context_size?: 'low' | 'high' | 'medium';

  /** The user's location. */
  @ApiProperty({ required: false, description: `The user's location.` })
  @IsOptional()
  user_location?: null | UserLocationDto;
}
