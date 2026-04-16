import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { UserLocationDto } from './UserLocationDto';

@ApiExtraModels(
  UserLocationDto,
)
export class WebSearchOptionsDto {
  /**
   * High level guidance for the amount of context window space to use for the
   * search. One of `low`, `medium`, or `high`. `medium` is the default.
   */
  @ApiProperty({
    required: false,
    description: `High level guidance for the amount of context window space to use for the
  search. One of \`low\`, \`medium\`, or \`high\`. \`medium\` is the default.`,
    enum: ['low', 'high', 'medium'],
  })
  @IsOptional()
  @IsIn(['low', 'high', 'medium'])
  search_context_size?: 'low' | 'high' | 'medium';

  /** Approximate location parameters for the search. */
  @ApiProperty({
    required: false,
    description: `Approximate location parameters for the search.`,
    type: () => UserLocationDto,
  })
  @IsOptional()
  user_location?: null | UserLocationDto;
}
