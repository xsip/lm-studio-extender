import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString } from 'class-validator';

import { ContainerNetworkPolicyDisabledDto } from './ContainerNetworkPolicyDisabledDto';
import { ContainerNetworkPolicyAllowlistDto } from './ContainerNetworkPolicyAllowlistDto';
import { SkillReferenceDto } from './SkillReferenceDto';
import { InlineSkillDto } from './InlineSkillDto';

export class ContainerAutoDto {
  /** Automatically creates a container for this request */
  @ApiProperty({ description: `Automatically creates a container for this request`, example: 'container_auto' })
  @Equals('container_auto')
  type!: 'container_auto';

  /** An optional list of uploaded files to make available to your code. */
  @ApiProperty({ required: false, description: `An optional list of uploaded files to make available to your code.`, isArray: true })
  @IsOptional()
  @IsArray()
  file_ids?: string[];

  /** The memory limit for the container. */
  @ApiProperty({ required: false, description: `The memory limit for the container.` })
  @IsOptional()
  memory_limit?: null | '1g' | '4g' | '16g' | '64g';

  /** Network access policy for the container. */
  @ApiProperty({ required: false, description: `Network access policy for the container.` })
  @IsOptional()
  network_policy?: ContainerNetworkPolicyDisabledDto | ContainerNetworkPolicyAllowlistDto;

  /** An optional list of skills referenced by id or inline data. */
  @ApiProperty({ required: false, description: `An optional list of skills referenced by id or inline data.`, isArray: true })
  @IsOptional()
  @IsArray()
  skills?: SkillReferenceDto | InlineSkillDto[];
}
