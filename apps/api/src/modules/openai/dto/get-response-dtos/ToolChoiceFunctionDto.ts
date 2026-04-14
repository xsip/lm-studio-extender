import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ToolChoiceFunctionDto {
  /** The name of the function to call. */
  @ApiProperty({ description: `The name of the function to call.`, type: 'string' })
  @IsString()
  name!: string;

  /** For function calling, the type is always `function`. */
  @ApiProperty({ description: `For function calling, the type is always \`function\`.`, example: 'function' })
  @Equals('function')
  type!: 'function';
}
