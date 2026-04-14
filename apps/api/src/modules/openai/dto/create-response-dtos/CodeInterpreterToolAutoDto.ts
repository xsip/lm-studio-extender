import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString } from 'class-validator';

import { ContainerNetworkPolicyDisabledDto } from './ContainerNetworkPolicyDisabledDto';
import { ContainerNetworkPolicyAllowlistDto } from './ContainerNetworkPolicyAllowlistDto';

export class CodeInterpreterToolAutoDto {
  /** Always `auto`. */
  @ApiProperty({ description: `Always \`auto\`.`, example: 'auto' })
  @Equals('auto')
  type!: 'auto';

  /** An optional list of uploaded files to make available to your code. */
  @ApiProperty({ required: false, description: `An optional list of uploaded files to make available to your code.`, isArray: true })
  @IsOptional()
  @IsArray()
  file_ids?: string[];

  /** The memory limit for the code interpreter container. */
  @ApiProperty({ required: false, description: `The memory limit for the code interpreter container.` })
  @IsOptional()
  memory_limit?: null | '1g' | '4g' | '16g' | '64g';

  /** Network access policy for the container. */
  @ApiProperty({ required: false, description: `Network access policy for the container.` })
  @IsOptional()
  network_policy?: ContainerNetworkPolicyDisabledDto | ContainerNetworkPolicyAllowlistDto;
}
