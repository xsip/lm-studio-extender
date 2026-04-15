import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional } from 'class-validator';

import { ContainerNetworkPolicyDisabledDto } from './ContainerNetworkPolicyDisabledDto';
import { ContainerNetworkPolicyAllowlistDto } from './ContainerNetworkPolicyAllowlistDto';

@ApiExtraModels(
  ContainerNetworkPolicyDisabledDto,
  ContainerNetworkPolicyAllowlistDto,
)
export class CodeInterpreterToolAutoDto {
  /** Always `auto`. */
  @ApiProperty({
    description: `Always \`auto\`.`,
    type: 'string',
    enum: ['auto'],
  })
  @Equals('auto')
  type!: 'auto';

  /** An optional list of uploaded files to make available to your code. */
  @ApiProperty({
    required: false,
    description: `An optional list of uploaded files to make available to your code.`,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  file_ids?: string[];

  /** The memory limit for the code interpreter container. */
  @ApiProperty({
    required: false,
    description: `The memory limit for the code interpreter container.`,
    enum: ['1g', '4g', '16g', '64g'],
  })
  @IsOptional()
  @IsIn(['1g', '4g', '16g', '64g'])
  memory_limit?: null | '1g' | '4g' | '16g' | '64g';

  /** Network access policy for the container. */
  @ApiProperty({
    required: false,
    description: `Network access policy for the container.`,
    oneOf: [
      { $ref: getSchemaPath(ContainerNetworkPolicyDisabledDto) },
      { $ref: getSchemaPath(ContainerNetworkPolicyAllowlistDto) },
    ],
  })
  @IsOptional()
  network_policy?: ContainerNetworkPolicyDisabledDto | ContainerNetworkPolicyAllowlistDto;
}
