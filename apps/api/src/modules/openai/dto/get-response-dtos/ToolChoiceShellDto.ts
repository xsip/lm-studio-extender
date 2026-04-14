import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ToolChoiceShellDto {
  /** The tool to call. Always `shell`. */
  @ApiProperty({ description: `The tool to call. Always \`shell\`.`, example: 'shell' })
  @Equals('shell')
  type!: 'shell';
}
