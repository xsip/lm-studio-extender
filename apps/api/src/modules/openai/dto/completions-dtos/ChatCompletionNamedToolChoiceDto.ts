import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FunctionDto } from './FunctionDto';

export class ChatCompletionNamedToolChoiceDto {
  @ApiProperty({ type: () => FunctionDto })
  @ValidateNested()
  @Type(() => FunctionDto)
  function!: FunctionDto;

  /** For function calling, the type is always `function`. */
  @ApiProperty({
    description: `For function calling, the type is always \`function\`.`,
    type: 'string',
    enum: ['function'],
  })
  @Equals('function')
  type!: 'function';
}
