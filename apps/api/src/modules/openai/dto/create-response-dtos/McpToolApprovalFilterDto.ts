import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { AlwaysDto } from './AlwaysDto';
import { NeverDto } from './NeverDto';

export class McpToolApprovalFilterDto {
  /** A filter object to specify which tools are allowed. */
  @ApiProperty({ required: false, description: `A filter object to specify which tools are allowed.`, type: () => AlwaysDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AlwaysDto)
  always?: AlwaysDto;

  /** A filter object to specify which tools are allowed. */
  @ApiProperty({ required: false, description: `A filter object to specify which tools are allowed.`, type: () => NeverDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NeverDto)
  never?: NeverDto;
}
