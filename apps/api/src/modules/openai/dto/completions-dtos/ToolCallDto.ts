import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FunctionDto } from './FunctionDto';

export class ToolCallDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  index!: number;

  /** The ID of the tool call. */
  @ApiProperty({
    required: false,
    description: `The ID of the tool call.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    required: false,
    type: () => FunctionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FunctionDto)
  function?: FunctionDto;

  /** The type of the tool. Currently, only `function` is supported. */
  @ApiProperty({
    required: false,
    description: `The type of the tool. Currently, only \`function\` is supported.`,
    type: 'string',
    enum: ['function'],
  })
  @IsOptional()
  @Equals('function')
  type?: 'function';
}
