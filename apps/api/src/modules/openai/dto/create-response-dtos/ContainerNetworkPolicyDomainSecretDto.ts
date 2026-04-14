import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ContainerNetworkPolicyDomainSecretDto {
  /** The domain associated with the secret. */
  @ApiProperty({ description: `The domain associated with the secret.`, type: 'string' })
  @IsString()
  domain!: string;

  /** The name of the secret to inject for the domain. */
  @ApiProperty({ description: `The name of the secret to inject for the domain.`, type: 'string' })
  @IsString()
  name!: string;

  /** The secret value to inject for the domain. */
  @ApiProperty({ description: `The secret value to inject for the domain.`, type: 'string' })
  @IsString()
  value!: string;
}
