import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ParsedFunctionDto } from './ParsedFunctionDto';

export class ParsedFunctionToolCallDto {
  /** The ID of the tool call. */
  @ApiProperty({
    description: `The ID of the tool call.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  @ApiProperty({ type: () => ParsedFunctionDto })
  @ValidateNested()
  @Type(() => ParsedFunctionDto)
  function!: ParsedFunctionDto;

  /** The type of the tool. Currently, only `function` is supported. */
  @ApiProperty({
    description: `The type of the tool. Currently, only \`function\` is supported.`,
    type: 'string',
    enum: ['function'],
  })
  @Equals('function')
  type!: 'function';
}
