import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { URLCitationDto } from './URLCitationDto';

export class AnnotationDto {
  /** The type of the URL citation. Always `url_citation`. */
  @ApiProperty({
    description: `The type of the URL citation. Always \`url_citation\`.`,
    type: 'string',
    enum: ['url_citation'],
  })
  @Equals('url_citation')
  type!: 'url_citation';

  /** A URL citation when using web search. */
  @ApiProperty({
    description: `A URL citation when using web search.`,
    type: () => URLCitationDto,
  })
  @ValidateNested()
  @Type(() => URLCitationDto)
  url_citation!: URLCitationDto;
}
