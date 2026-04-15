import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsOptional } from 'class-validator';

import { ContainerAutoDto } from './ContainerAutoDto';
import { LocalEnvironmentDto } from './LocalEnvironmentDto';
import { ContainerReferenceDto } from './ContainerReferenceDto';

@ApiExtraModels(
  ContainerAutoDto,
  LocalEnvironmentDto,
  ContainerReferenceDto,
)
export class FunctionShellToolDto {
  /** The type of the shell tool. Always `shell`. */
  @ApiProperty({
    description: `The type of the shell tool. Always \`shell\`.`,
    example: 'shell',
  })
  @Equals('shell')
  type!: 'shell';

  @ApiProperty({
    required: false,
    oneOf: [
      { $ref: getSchemaPath(ContainerAutoDto) },
      { $ref: getSchemaPath(LocalEnvironmentDto) },
      { $ref: getSchemaPath(ContainerReferenceDto) },
    ],
  })
  @IsOptional()
  environment?: null | ContainerAutoDto | LocalEnvironmentDto | ContainerReferenceDto;
}
