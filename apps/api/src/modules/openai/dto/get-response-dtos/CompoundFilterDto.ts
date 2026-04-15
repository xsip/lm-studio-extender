import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn } from 'class-validator';

export class CompoundFilterDto {
  /**
   * Array of filters to combine. Items can be `ComparisonFilter` or
   * `CompoundFilter`.
   */
  @ApiProperty({
    description: `Array of filters to combine. Items can be \`ComparisonFilter\` or
  \`CompoundFilter\`.`,
    isArray: true,
  })
  @IsArray()
  filters!: unknown[];

  /** Type of operation: `and` or `or`. */
  @ApiProperty({
    description: `Type of operation: \`and\` or \`or\`.`,
    enum: ['and', 'or'],
  })
  @IsIn(['and', 'or'])
  type!: 'and' | 'or';
}
