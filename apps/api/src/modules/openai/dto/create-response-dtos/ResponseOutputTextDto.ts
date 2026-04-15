import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FileCitationDto } from './FileCitationDto';
import { URLCitationDto } from './URLCitationDto';
import { ContainerFileCitationDto } from './ContainerFileCitationDto';
import { FilePathDto } from './FilePathDto';
import { LogprobDto } from './LogprobDto';

@ApiExtraModels(
  FileCitationDto,
  URLCitationDto,
  ContainerFileCitationDto,
  FilePathDto,
)
export class ResponseOutputTextDto {
  /** The annotations of the text output. */
  @ApiProperty({
    description: `The annotations of the text output.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(FileCitationDto) },
      { $ref: getSchemaPath(URLCitationDto) },
      { $ref: getSchemaPath(ContainerFileCitationDto) },
      { $ref: getSchemaPath(FilePathDto) },
    ],
  })
  @IsArray()
  annotations!: FileCitationDto | URLCitationDto | ContainerFileCitationDto | FilePathDto[];

  /** The text output from the model. */
  @ApiProperty({
    description: `The text output from the model.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /** The type of the output text. Always `output_text`. */
  @ApiProperty({
    description: `The type of the output text. Always \`output_text\`.`,
    example: 'output_text',
  })
  @Equals('output_text')
  type!: 'output_text';

  @ApiProperty({
    required: false,
    type: LogprobDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogprobDto)
  logprobs?: LogprobDto[];
}
