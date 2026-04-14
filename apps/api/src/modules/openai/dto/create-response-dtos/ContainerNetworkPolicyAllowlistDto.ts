import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ContainerNetworkPolicyDomainSecretDto } from './ContainerNetworkPolicyDomainSecretDto';

export class ContainerNetworkPolicyAllowlistDto {
  /** A list of allowed domains when type is `allowlist`. */
  @ApiProperty({ description: `A list of allowed domains when type is \`allowlist\`.`, isArray: true })
  @IsArray()
  allowed_domains!: string[];

  /** Allow outbound network access only to specified domains. Always `allowlist`. */
  @ApiProperty({ description: `Allow outbound network access only to specified domains. Always \`allowlist\`.`, example: 'allowlist' })
  @Equals('allowlist')
  type!: 'allowlist';

  /** Optional domain-scoped secrets for allowlisted domains. */
  @ApiProperty({ required: false, description: `Optional domain-scoped secrets for allowlisted domains.`, type: () => [ContainerNetworkPolicyDomainSecretDto], isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContainerNetworkPolicyDomainSecretDto)
  domain_secrets?: ContainerNetworkPolicyDomainSecretDto[];
}
