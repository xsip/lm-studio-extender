import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsNumber, IsOptional } from 'class-validator';

export class ClickDto {
  /** Indicates which mouse button was pressed during the click. One of `left`,
`right`, `wheel`, `back`, or `forward`. */
  @ApiProperty({ description: `Indicates which mouse button was pressed during the click. One of \`left\`,
\`right\`, \`wheel\`, \`back\`, or \`forward\`.`, enum: ['left', 'right', 'wheel', 'back', 'forward'] })
  @IsIn(['left', 'right', 'wheel', 'back', 'forward'])
  button!: 'left' | 'right' | 'wheel' | 'back' | 'forward';

  /** Specifies the event type. For a click action, this property is always `click`. */
  @ApiProperty({ description: `Specifies the event type. For a click action, this property is always \`click\`.`, example: 'click' })
  @Equals('click')
  type!: 'click';

  /** The x-coordinate where the click occurred. */
  @ApiProperty({ description: `The x-coordinate where the click occurred.`, type: 'number' })
  @IsNumber()
  x!: number;

  /** The y-coordinate where the click occurred. */
  @ApiProperty({ description: `The y-coordinate where the click occurred.`, type: 'number' })
  @IsNumber()
  y!: number;

  /** The keys being held while clicking. */
  @ApiProperty({ required: false, description: `The keys being held while clicking.` })
  @IsOptional()
  keys?: null | string[];
}
