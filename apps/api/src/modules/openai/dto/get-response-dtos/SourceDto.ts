import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class SourceDto {
  /** The type of source. Always `url`. */
  @ApiProperty({
    description: `The type of source. Always \`url\`.`,
    type: 'string',
    enum: ['url'],
  })
  @Equals('url')
  type!: 'url';

  /** The URL of the source. */
  @ApiProperty({
    description: `The URL of the source.`,
    type: 'string',
  })
  @IsString()
  url!: string;
}
