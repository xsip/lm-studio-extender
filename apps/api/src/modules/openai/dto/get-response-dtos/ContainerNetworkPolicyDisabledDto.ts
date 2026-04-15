import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ContainerNetworkPolicyDisabledDto {
  /** Disable outbound network access. Always `disabled`. */
  @ApiProperty({
    description: `Disable outbound network access. Always \`disabled\`.`,
    type: 'string',
    enum: ['disabled'],
  })
  @Equals('disabled')
  type!: 'disabled';
}
