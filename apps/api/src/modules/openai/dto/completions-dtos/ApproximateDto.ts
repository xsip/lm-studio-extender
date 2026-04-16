import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApproximateDto {
  /** Free text input for the city of the user, e.g. `San Francisco`. */
  @ApiProperty({
    required: false,
    description: `Free text input for the city of the user, e.g. \`San Francisco\`.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  city?: string;

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
  @IsString()
  country?: string;

  /** Free text input for the region of the user, e.g. `California`. */
  @ApiProperty({
    required: false,
    description: `Free text input for the region of the user, e.g. \`California\`.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  region?: string;

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
  @IsString()
  timezone?: string;
}
