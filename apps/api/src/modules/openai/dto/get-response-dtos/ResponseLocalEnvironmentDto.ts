import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ResponseLocalEnvironmentDto {
  /** The environment type. Always `local`. */
  @ApiProperty({
    description: `The environment type. Always \`local\`.`,
    type: 'string',
    enum: ['local'],
  })
  @Equals('local')
  type!: 'local';
}
