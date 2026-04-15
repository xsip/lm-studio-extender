import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber } from 'class-validator';

export class DoubleClickDto {
  /** The keys being held while double-clicking. */
  @ApiProperty({
    description: `The keys being held while double-clicking.`,
    type: 'string',
    isArray: true,
  })
  keys!: null | string[];

  /**
   * Specifies the event type. For a double click action, this property is always set
   * to `double_click`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a double click action, this property is always set
  to \`double_click\`.`,
    example: 'double_click',
  })
  @Equals('double_click')
  type!: 'double_click';

  /** The x-coordinate where the double click occurred. */
  @ApiProperty({
    description: `The x-coordinate where the double click occurred.`,
    type: 'number',
  })
  @IsNumber()
  x!: number;

  /** The y-coordinate where the double click occurred. */
  @ApiProperty({
    description: `The y-coordinate where the double click occurred.`,
    type: 'number',
  })
  @IsNumber()
  y!: number;
}
