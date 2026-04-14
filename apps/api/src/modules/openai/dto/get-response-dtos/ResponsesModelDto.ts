import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponsesModelDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  length!: number;
}
