import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

import { CodeInterpreterToolAutoDto } from './CodeInterpreterToolAutoDto';

export class CodeInterpreterDto {
  /** The code interpreter container. Can be a container ID or an object that
specifies uploaded file IDs to make available to your code, along with an
optional `memory_limit` setting. */
  @ApiProperty({ description: `The code interpreter container. Can be a container ID or an object that
specifies uploaded file IDs to make available to your code, along with an
optional \`memory_limit\` setting.` })
  container!: string | CodeInterpreterToolAutoDto;

  /** The type of the code interpreter tool. Always `code_interpreter`. */
  @ApiProperty({ description: `The type of the code interpreter tool. Always \`code_interpreter\`.`, example: 'code_interpreter' })
  @Equals('code_interpreter')
  type!: 'code_interpreter';
}
