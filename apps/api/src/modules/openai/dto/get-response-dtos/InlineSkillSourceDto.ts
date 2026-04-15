import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class InlineSkillSourceDto {
  /** Base64-encoded skill zip bundle. */
  @ApiProperty({
    description: `Base64-encoded skill zip bundle.`,
    type: 'string',
  })
  @IsString()
  data!: string;

  /** The media type of the inline skill payload. Must be `application/zip`. */
  @ApiProperty({
    description: `The media type of the inline skill payload. Must be \`application/zip\`.`,
    type: 'string',
    enum: ['application/zip'],
  })
  @Equals('application/zip')
  media_type!: 'application/zip';

  /** The type of the inline skill source. Must be `base64`. */
  @ApiProperty({
    description: `The type of the inline skill source. Must be \`base64\`.`,
    type: 'string',
    enum: ['base64'],
  })
  @Equals('base64')
  type!: 'base64';
}
