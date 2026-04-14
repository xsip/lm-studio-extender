import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ToolDto {
  /** The type of the function tool. Always `function`. */
  @ApiProperty({ description: `The type of the function tool. Always \`function\`.`, example: 'function' })
  @Equals('function')
  type!: 'function';
}
