import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ApproximateDto } from './ApproximateDto';

export class UserLocationDto {
  /** Approximate location parameters for the search. */
  @ApiProperty({
    description: `Approximate location parameters for the search.`,
    type: () => ApproximateDto,
  })
  @ValidateNested()
  @Type(() => ApproximateDto)
  approximate!: ApproximateDto;

  /** The type of location approximation. Always `approximate`. */
  @ApiProperty({
    description: `The type of location approximation. Always \`approximate\`.`,
    type: 'string',
    enum: ['approximate'],
  })
  @Equals('approximate')
  type!: 'approximate';
}
