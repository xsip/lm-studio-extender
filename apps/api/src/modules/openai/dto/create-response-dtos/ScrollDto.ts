import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsOptional } from 'class-validator';

export class ScrollDto {
  /** The horizontal scroll distance. */
  @ApiProperty({
    description: `The horizontal scroll distance.`,
    type: 'number',
  })
  @IsNumber()
  scroll_x!: number;

  /** The vertical scroll distance. */
  @ApiProperty({
    description: `The vertical scroll distance.`,
    type: 'number',
  })
  @IsNumber()
  scroll_y!: number;

  /**
   * Specifies the event type. For a scroll action, this property is always set to
   * `scroll`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a scroll action, this property is always set to
  \`scroll\`.`,
    type: 'string',
    enum: ['scroll'],
  })
  @Equals('scroll')
  type!: 'scroll';

  /** The x-coordinate where the scroll occurred. */
  @ApiProperty({
    description: `The x-coordinate where the scroll occurred.`,
    type: 'number',
  })
  @IsNumber()
  x!: number;

  /** The y-coordinate where the scroll occurred. */
  @ApiProperty({
    description: `The y-coordinate where the scroll occurred.`,
    type: 'number',
  })
  @IsNumber()
  y!: number;

  /** The keys being held while scrolling. */
  @ApiProperty({
    required: false,
    description: `The keys being held while scrolling.`,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  keys?: null | string[];
}
