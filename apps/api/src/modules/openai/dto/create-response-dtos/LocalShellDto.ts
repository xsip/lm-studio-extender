import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class LocalShellDto {
  /** The type of the local shell tool. Always `local_shell`. */
  @ApiProperty({ description: `The type of the local shell tool. Always \`local_shell\`.`, example: 'local_shell' })
  @Equals('local_shell')
  type!: 'local_shell';
}
