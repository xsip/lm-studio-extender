import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PathDto {
  /** The x-coordinate. */
  @ApiProperty({
    description: `The x-coordinate.`,
    type: 'number',
  })
  @IsNumber()
  x!: number;

  /** The y-coordinate. */
  @ApiProperty({
    description: `The y-coordinate.`,
    type: 'number',
  })
  @IsNumber()
  y!: number;
}
