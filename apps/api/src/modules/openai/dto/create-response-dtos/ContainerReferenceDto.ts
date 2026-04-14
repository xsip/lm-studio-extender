import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ContainerReferenceDto {
  /** The ID of the referenced container. */
  @ApiProperty({ description: `The ID of the referenced container.`, type: 'string' })
  @IsString()
  container_id!: string;

  /** References a container created with the /v1/containers endpoint */
  @ApiProperty({ description: `References a container created with the /v1/containers endpoint`, example: 'container_reference' })
  @Equals('container_reference')
  type!: 'container_reference';
}
