import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional } from 'class-validator';

import { LocalEnvironmentDto } from './LocalEnvironmentDto';
import { ContainerReferenceDto } from './ContainerReferenceDto';
import { ContainerAutoDto } from './ContainerAutoDto';

export class FunctionShellToolDto {
  /** The type of the shell tool. Always `shell`. */
  @ApiProperty({ description: `The type of the shell tool. Always \`shell\`.`, example: 'shell' })
  @Equals('shell')
  type!: 'shell';

  @ApiProperty({ required: false })
  @IsOptional()
  environment?: null | LocalEnvironmentDto | ContainerReferenceDto | ContainerAutoDto;
}
