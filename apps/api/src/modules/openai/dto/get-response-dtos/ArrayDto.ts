import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ArrayDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  length!: number;
}
