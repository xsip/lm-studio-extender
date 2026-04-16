import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ChatCompletionRoleDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  length!: number;
}
