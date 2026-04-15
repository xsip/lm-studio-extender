import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ContextManagementDto {
  /** The context management entry type. Currently only 'compaction' is supported. */
  @ApiProperty({
    description: `The context management entry type. Currently only 'compaction' is supported.`,
    type: 'string',
  })
  @IsString()
  type!: string;

  /** Token threshold at which compaction should be triggered for this entry. */
  @ApiProperty({
    required: false,
    description: `Token threshold at which compaction should be triggered for this entry.`,
    type: 'number',
  })
  @IsOptional()
  compact_threshold?: null | number;
}
