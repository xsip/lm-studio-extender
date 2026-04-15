import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsIn, IsString } from 'class-validator';

import { SearchDto } from './SearchDto';
import { OpenPageDto } from './OpenPageDto';
import { FindDto } from './FindDto';

@ApiExtraModels(
  SearchDto,
  OpenPageDto,
  FindDto,
)
export class ResponseFunctionWebSearchDto {
  /** The unique ID of the web search tool call. */
  @ApiProperty({
    description: `The unique ID of the web search tool call.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /**
   * An object describing the specific action taken in this web search call. Includes
   * details on how the model used the web (search, open_page, find_in_page).
   */
  @ApiProperty({
    description: `An object describing the specific action taken in this web search call. Includes
  details on how the model used the web (search, open_page, find_in_page).`,
    oneOf: [
      { $ref: getSchemaPath(SearchDto) },
      { $ref: getSchemaPath(OpenPageDto) },
      { $ref: getSchemaPath(FindDto) },
    ],
  })
  action!: SearchDto | OpenPageDto | FindDto;

  /** The status of the web search tool call. */
  @ApiProperty({
    description: `The status of the web search tool call.`,
    enum: ['in_progress', 'completed', 'searching', 'failed'],
  })
  @IsIn(['in_progress', 'completed', 'searching', 'failed'])
  status!: 'in_progress' | 'completed' | 'searching' | 'failed';

  /** The type of the web search tool call. Always `web_search_call`. */
  @ApiProperty({
    description: `The type of the web search tool call. Always \`web_search_call\`.`,
    type: 'string',
    enum: ['web_search_call'],
  })
  @Equals('web_search_call')
  type!: 'web_search_call';
}
