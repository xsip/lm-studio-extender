import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseStatusDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  length!: number;
}
