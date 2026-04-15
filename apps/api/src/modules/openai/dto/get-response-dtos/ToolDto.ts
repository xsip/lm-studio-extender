import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ToolDto {
  /** The JSON schema describing the tool's input. */
  @ApiProperty({ description: `The JSON schema describing the tool's input.` })
  input_schema!: unknown;

  /** The name of the tool. */
  @ApiProperty({
    description: `The name of the tool.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** Additional annotations about the tool. */
  @ApiProperty({
    required: false,
    description: `Additional annotations about the tool.`,
  })
  @IsOptional()
  annotations?: unknown;

  /** The description of the tool. */
  @ApiProperty({
    required: false,
    description: `The description of the tool.`,
    type: 'string',
  })
  @IsOptional()
  description?: null | string;
}
