import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class ComparisonFilterDto {
  /** The key to compare against the value. */
  @ApiProperty({
    description: `The key to compare against the value.`,
    type: 'string',
  })
  @IsString()
  key!: string;

  /**
   * Specifies the comparison operator: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`,
   * `nin`.
   * 
   * - `eq`: equals
   * - `ne`: not equal
   * - `gt`: greater than
   * - `gte`: greater than or equal
   * - `lt`: less than
   * - `lte`: less than or equal
   * - `in`: in
   * - `nin`: not in
   */
  @ApiProperty({
    description: `Specifies the comparison operator: \`eq\`, \`ne\`, \`gt\`, \`gte\`, \`lt\`, \`lte\`, \`in\`,
  \`nin\`.
  
  - \`eq\`: equals
  - \`ne\`: not equal
  - \`gt\`: greater than
  - \`gte\`: greater than or equal
  - \`lt\`: less than
  - \`lte\`: less than or equal
  - \`in\`: in
  - \`nin\`: not in`,
    enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
  })
  @IsIn(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'])
  type!: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';

  /**
   * The value to compare against the attribute key; supports string, number, or
   * boolean types.
   */
  @ApiProperty({ description: `The value to compare against the attribute key; supports string, number, or
  boolean types.` })
  value!: string | number | false | true | string | number[];
}
