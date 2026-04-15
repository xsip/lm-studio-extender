import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional, IsString } from 'class-validator';

import { ResultDto } from './ResultDto';

export class ResponseFileSearchToolCallDto {
  /** The unique ID of the file search tool call. */
  @ApiProperty({
    description: `The unique ID of the file search tool call.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The queries used to search for files. */
  @ApiProperty({
    description: `The queries used to search for files.`,
    type: 'string',
    isArray: true,
  })
  @IsArray()
  queries!: string[];

  /**
   * The status of the file search tool call. One of `in_progress`, `searching`,
   * `incomplete` or `failed`,
   */
  @ApiProperty({
    description: `The status of the file search tool call. One of \`in_progress\`, \`searching\`,
  \`incomplete\` or \`failed\`,`,
    enum: ['in_progress', 'completed', 'incomplete', 'searching', 'failed'],
  })
  @IsIn(['in_progress', 'completed', 'incomplete', 'searching', 'failed'])
  status!: 'in_progress' | 'completed' | 'incomplete' | 'searching' | 'failed';

  /** The type of the file search tool call. Always `file_search_call`. */
  @ApiProperty({
    description: `The type of the file search tool call. Always \`file_search_call\`.`,
    type: 'string',
    enum: ['file_search_call'],
  })
  @Equals('file_search_call')
  type!: 'file_search_call';

  /** The results of the file search tool call. */
  @ApiProperty({
    required: false,
    description: `The results of the file search tool call.`,
    type: ResultDto,
    isArray: true,
  })
  @IsOptional()
  results?: null | ResultDto[];
}
