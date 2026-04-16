import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ChatCompletionModalityDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  length!: number;
}
