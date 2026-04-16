import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FunctionDefinitionDto } from './FunctionDefinitionDto';

export class ChatCompletionFunctionToolDto {
  @ApiProperty({ type: () => FunctionDefinitionDto })
  @ValidateNested()
  @Type(() => FunctionDefinitionDto)
  function!: FunctionDefinitionDto;

  /** The type of the tool. Currently, only `function` is supported. */
  @ApiProperty({
    description: `The type of the tool. Currently, only \`function\` is supported.`,
    type: 'string',
    enum: ['function'],
  })
  @Equals('function')
  type!: 'function';
}
