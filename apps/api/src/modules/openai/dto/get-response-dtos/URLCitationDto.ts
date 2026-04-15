import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class URLCitationDto {
  /** The index of the last character of the URL citation in the message. */
  @ApiProperty({
    description: `The index of the last character of the URL citation in the message.`,
    type: 'number',
  })
  @IsNumber()
  end_index!: number;

  /** The index of the first character of the URL citation in the message. */
  @ApiProperty({
    description: `The index of the first character of the URL citation in the message.`,
    type: 'number',
  })
  @IsNumber()
  start_index!: number;

  /** The title of the web resource. */
  @ApiProperty({
    description: `The title of the web resource.`,
    type: 'string',
  })
  @IsString()
  title!: string;

  /** The type of the URL citation. Always `url_citation`. */
  @ApiProperty({
    description: `The type of the URL citation. Always \`url_citation\`.`,
    type: 'string',
    enum: ['url_citation'],
  })
  @Equals('url_citation')
  type!: 'url_citation';

  /** The URL of the web resource. */
  @ApiProperty({
    description: `The URL of the web resource.`,
    type: 'string',
  })
  @IsString()
  url!: string;
}
