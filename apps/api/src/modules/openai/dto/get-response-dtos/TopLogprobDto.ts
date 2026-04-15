import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class TopLogprobDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  token!: string;

  @ApiProperty({
    type: 'number',
    isArray: true,
  })
  @IsArray()
  bytes!: number[];

  @ApiProperty({ type: 'number' })
  @IsNumber()
  logprob!: number;
}
