import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional } from 'class-validator';

import { ResponseInputTextDto } from './ResponseInputTextDto';
import { ResponseInputImageDto } from './ResponseInputImageDto';
import { ResponseInputFileDto } from './ResponseInputFileDto';

@ApiExtraModels(
  ResponseInputTextDto,
  ResponseInputImageDto,
  ResponseInputFileDto,
)
export class MessageDto {
  /**
   * A list of one or many input items to the model, containing different content
   * types.
   */
  @ApiProperty({
    description: `A list of one or many input items to the model, containing different content
  types.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(ResponseInputTextDto) },
      { $ref: getSchemaPath(ResponseInputImageDto) },
      { $ref: getSchemaPath(ResponseInputFileDto) },
    ],
  })
  @IsArray()
  content!: (ResponseInputTextDto | ResponseInputImageDto | ResponseInputFileDto)[];

  /** The role of the message input. One of `user`, `system`, or `developer`. */
  @ApiProperty({
    description: `The role of the message input. One of \`user\`, \`system\`, or \`developer\`.`,
    enum: ['user', 'system', 'developer'],
  })
  @IsIn(['user', 'system', 'developer'])
  role!: 'user' | 'system' | 'developer';

  /**
   * The status of item. One of `in_progress`, `completed`, or `incomplete`.
   * Populated when items are returned via API.
   */
  @ApiProperty({
    required: false,
    description: `The status of item. One of \`in_progress\`, \`completed\`, or \`incomplete\`.
  Populated when items are returned via API.`,
    enum: ['in_progress', 'completed', 'incomplete'],
  })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'incomplete'])
  status?: 'in_progress' | 'completed' | 'incomplete';

  /** The type of the message input. Always set to `message`. */
  @ApiProperty({
    required: false,
    description: `The type of the message input. Always set to \`message\`.`,
    type: 'string',
    enum: ['message'],
  })
  @IsOptional()
  @Equals('message')
  type?: 'message';
}
