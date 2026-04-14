import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ToolChoiceCustomDto {
  /** The name of the custom tool to call. */
  @ApiProperty({ description: `The name of the custom tool to call.`, type: 'string' })
  @IsString()
  name!: string;

  /** For custom tool calling, the type is always `custom`. */
  @ApiProperty({ description: `For custom tool calling, the type is always \`custom\`.`, example: 'custom' })
  @Equals('custom')
  type!: 'custom';
}
