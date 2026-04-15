import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class LogsDto {
  /** The logs output from the code interpreter. */
  @ApiProperty({
    description: `The logs output from the code interpreter.`,
    type: 'string',
  })
  @IsString()
  logs!: string;

  /** The type of the output. Always `logs`. */
  @ApiProperty({
    description: `The type of the output. Always \`logs\`.`,
    type: 'string',
    enum: ['logs'],
  })
  @Equals('logs')
  type!: 'logs';
}
