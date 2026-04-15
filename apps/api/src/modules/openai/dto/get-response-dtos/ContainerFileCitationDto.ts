import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ContainerFileCitationDto {
  /** The ID of the container file. */
  @ApiProperty({
    description: `The ID of the container file.`,
    type: 'string',
  })
  @IsString()
  container_id!: string;

  /** The index of the last character of the container file citation in the message. */
  @ApiProperty({
    description: `The index of the last character of the container file citation in the message.`,
    type: 'number',
  })
  @IsNumber()
  end_index!: number;

  /** The ID of the file. */
  @ApiProperty({
    description: `The ID of the file.`,
    type: 'string',
  })
  @IsString()
  file_id!: string;

  /** The filename of the container file cited. */
  @ApiProperty({
    description: `The filename of the container file cited.`,
    type: 'string',
  })
  @IsString()
  filename!: string;

  /** The index of the first character of the container file citation in the message. */
  @ApiProperty({
    description: `The index of the first character of the container file citation in the message.`,
    type: 'number',
  })
  @IsNumber()
  start_index!: number;

  /** The type of the container file citation. Always `container_file_citation`. */
  @ApiProperty({
    description: `The type of the container file citation. Always \`container_file_citation\`.`,
    type: 'string',
    enum: ['container_file_citation'],
  })
  @Equals('container_file_citation')
  type!: 'container_file_citation';
}
