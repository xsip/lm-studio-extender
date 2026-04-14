import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResponsePromptDto {
  /** The unique identifier of the prompt template to use. */
  @ApiProperty({ description: `The unique identifier of the prompt template to use.`, type: 'string' })
  @IsString()
  id!: string;

  /** Optional map of values to substitute in for variables in your prompt. The
substitution values can either be strings, or other Response input types like
images or files. */
  @ApiProperty({ required: false, description: `Optional map of values to substitute in for variables in your prompt. The
substitution values can either be strings, or other Response input types like
images or files.` })
  @IsOptional()
  variables?: null | any;

  /** Optional version of the prompt template. */
  @ApiProperty({ required: false, description: `Optional version of the prompt template.` })
  @IsOptional()
  version?: null | string;
}
