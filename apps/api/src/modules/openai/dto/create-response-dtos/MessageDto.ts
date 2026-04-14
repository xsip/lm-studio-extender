import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ArrayDto } from './ArrayDto';

export class MessageDto {
  /** A list of one or many input items to the model, containing different content
types. */
  @ApiProperty({ description: `A list of one or many input items to the model, containing different content
types.`, type: () => ArrayDto })
  @ValidateNested()
  @Type(() => ArrayDto)
  content!: ArrayDto;

  /** The role of the message input. One of `user`, `system`, or `developer`. */
  @ApiProperty({ description: `The role of the message input. One of \`user\`, \`system\`, or \`developer\`.`, enum: ['user', 'system', 'developer'] })
  @IsIn(['user', 'system', 'developer'])
  role!: 'user' | 'system' | 'developer';

  /** The status of item. One of `in_progress`, `completed`, or `incomplete`.
Populated when items are returned via API. */
  @ApiProperty({ required: false, description: `The status of item. One of \`in_progress\`, \`completed\`, or \`incomplete\`.
Populated when items are returned via API.`, enum: ['in_progress', 'completed', 'incomplete'] })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'incomplete'])
  status?: 'in_progress' | 'completed' | 'incomplete';

  /** The type of the message input. Always set to `message`. */
  @ApiProperty({ required: false, description: `The type of the message input. Always set to \`message\`.`, example: 'message' })
  @IsOptional()
  @Equals('message')
  type?: 'message';
}
