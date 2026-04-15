import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ResponseContainerReferenceDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  container_id!: string;

  /** The environment type. Always `container_reference`. */
  @ApiProperty({
    description: `The environment type. Always \`container_reference\`.`,
    type: 'string',
    enum: ['container_reference'],
  })
  @Equals('container_reference')
  type!: 'container_reference';
}
