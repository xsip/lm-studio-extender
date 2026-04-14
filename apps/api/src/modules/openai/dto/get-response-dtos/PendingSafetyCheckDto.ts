import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PendingSafetyCheckDto {
  /** The ID of the pending safety check. */
  @ApiProperty({ description: `The ID of the pending safety check.`, type: 'string' })
  @IsString()
  id!: string;

  /** The type of the pending safety check. */
  @ApiProperty({ required: false, description: `The type of the pending safety check.` })
  @IsOptional()
  code?: null | string;

  /** Details about the pending safety check. */
  @ApiProperty({ required: false, description: `Details about the pending safety check.` })
  @IsOptional()
  message?: null | string;
}
