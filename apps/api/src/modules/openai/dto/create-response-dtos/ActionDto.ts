import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional } from 'class-validator';

export class ActionDto {
  /** The command to run. */
  @ApiProperty({
    description: `The command to run.`,
    type: 'string',
    isArray: true,
  })
  @IsArray()
  command!: string[];

  /** Environment variables to set for the command. */
  @ApiProperty({ description: `Environment variables to set for the command.` })
  env!: any;

  /** The type of the local shell action. Always `exec`. */
  @ApiProperty({
    description: `The type of the local shell action. Always \`exec\`.`,
    type: 'string',
    enum: ['exec'],
  })
  @Equals('exec')
  type!: 'exec';

  /** Optional timeout in milliseconds for the command. */
  @ApiProperty({
    required: false,
    description: `Optional timeout in milliseconds for the command.`,
    type: 'number',
  })
  @IsOptional()
  timeout_ms?: null | number;

  /** Optional user to run the command as. */
  @ApiProperty({
    required: false,
    description: `Optional user to run the command as.`,
    type: 'string',
  })
  @IsOptional()
  user?: null | string;

  /** Optional working directory to run the command in. */
  @ApiProperty({
    required: false,
    description: `Optional working directory to run the command in.`,
    type: 'string',
  })
  @IsOptional()
  working_directory?: null | string;
}
