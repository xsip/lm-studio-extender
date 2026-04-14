import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString } from 'class-validator';

export class ActionDto {
  /** The command to run. */
  @ApiProperty({ description: `The command to run.`, isArray: true })
  @IsArray()
  command!: string[];

  /** Environment variables to set for the command. */
  @ApiProperty({ description: `Environment variables to set for the command.` })
  env!: any;

  /** The type of the local shell action. Always `exec`. */
  @ApiProperty({ description: `The type of the local shell action. Always \`exec\`.`, example: 'exec' })
  @Equals('exec')
  type!: 'exec';

  /** Optional timeout in milliseconds for the command. */
  @ApiProperty({ required: false, description: `Optional timeout in milliseconds for the command.` })
  @IsOptional()
  timeout_ms?: null | number;

  /** Optional user to run the command as. */
  @ApiProperty({ required: false, description: `Optional user to run the command as.` })
  @IsOptional()
  user?: null | string;

  /** Optional working directory to run the command in. */
  @ApiProperty({ required: false, description: `Optional working directory to run the command in.` })
  @IsOptional()
  working_directory?: null | string;
}
