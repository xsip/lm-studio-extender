import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FunctionDto } from './FunctionDto';

export class ChatCompletionMessageFunctionToolCallDto {
  /** The ID of the tool call. */
  @ApiProperty({
    description: `The ID of the tool call.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The function that the model called. */
  @ApiProperty({
    description: `The function that the model called.`,
    type: () => FunctionDto,
  })
  @ValidateNested()
  @Type(() => FunctionDto)
  function!: FunctionDto;

  /** The type of the tool. Currently, only `function` is supported. */
  @ApiProperty({
    description: `The type of the tool. Currently, only \`function\` is supported.`,
    type: 'string',
    enum: ['function'],
  })
  @Equals('function')
  type!: 'function';
}
