import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TopLogprobDto } from './TopLogprobDto';

export class LogprobDto {
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

  @ApiProperty({
    type: TopLogprobDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopLogprobDto)
  top_logprobs!: TopLogprobDto[];
}
