import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsOptional } from 'class-validator';

export class MoveDto {
  /**
   * Specifies the event type. For a move action, this property is always set to
   * `move`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a move action, this property is always set to
  \`move\`.`,
    example: 'move',
  })
  @Equals('move')
  type!: 'move';

  /** The x-coordinate to move to. */
  @ApiProperty({
    description: `The x-coordinate to move to.`,
    type: 'number',
  })
  @IsNumber()
  x!: number;

  /** The y-coordinate to move to. */
  @ApiProperty({
    description: `The y-coordinate to move to.`,
    type: 'number',
  })
  @IsNumber()
  y!: number;

  /** The keys being held while moving the mouse. */
  @ApiProperty({
    required: false,
    description: `The keys being held while moving the mouse.`,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  keys?: null | string[];
}
