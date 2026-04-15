import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional } from 'class-validator';

export class UserLocationDto {
  /** Free text input for the city of the user, e.g. `San Francisco`. */
  @ApiProperty({
    required: false,
    description: `Free text input for the city of the user, e.g. \`San Francisco\`.`,
    type: 'string',
  })
  @IsOptional()
  city?: null | string;

  /**
   * The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of
   * the user, e.g. `US`.
   */
  @ApiProperty({
    required: false,
    description: `The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of
  the user, e.g. \`US\`.`,
    type: 'string',
  })
  @IsOptional()
  country?: null | string;

  /** Free text input for the region of the user, e.g. `California`. */
  @ApiProperty({
    required: false,
    description: `Free text input for the region of the user, e.g. \`California\`.`,
    type: 'string',
  })
  @IsOptional()
  region?: null | string;

  /**
   * The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the
   * user, e.g. `America/Los_Angeles`.
   */
  @ApiProperty({
    required: false,
    description: `The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the
  user, e.g. \`America/Los_Angeles\`.`,
    type: 'string',
  })
  @IsOptional()
  timezone?: null | string;

  /** The type of location approximation. Always `approximate`. */
  @ApiProperty({
    required: false,
    description: `The type of location approximation. Always \`approximate\`.`,
    type: 'string',
    enum: ['approximate'],
  })
  @IsOptional()
  @Equals('approximate')
  type?: 'approximate';
}
