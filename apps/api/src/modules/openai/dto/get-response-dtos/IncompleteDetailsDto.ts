import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class IncompleteDetailsDto {
  /** The reason why the response is incomplete. */
  @ApiProperty({ required: false, description: `The reason why the response is incomplete.`, enum: ['max_output_tokens', 'content_filter'] })
  @IsOptional()
  @IsIn(['max_output_tokens', 'content_filter'])
  reason?: 'max_output_tokens' | 'content_filter';
}
