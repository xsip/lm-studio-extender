import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber } from 'class-validator';

export class ExitDto {
  /** The exit code returned by the shell process. */
  @ApiProperty({
    description: `The exit code returned by the shell process.`,
    type: 'number',
  })
  @IsNumber()
  exit_code!: number;

  /** The outcome type. Always `exit`. */
  @ApiProperty({
    description: `The outcome type. Always \`exit\`.`,
    type: 'string',
    enum: ['exit'],
  })
  @Equals('exit')
  type!: 'exit';
}
