import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ResponseCompactionItemParamDto {
  /** The encrypted content of the compaction summary. */
  @ApiProperty({
    description: `The encrypted content of the compaction summary.`,
    type: 'string',
  })
  @IsString()
  encrypted_content!: string;

  /** The type of the item. Always `compaction`. */
  @ApiProperty({
    description: `The type of the item. Always \`compaction\`.`,
    type: 'string',
    enum: ['compaction'],
  })
  @Equals('compaction')
  type!: 'compaction';

  /** The ID of the compaction item. */
  @ApiProperty({
    required: false,
    description: `The ID of the compaction item.`,
    type: 'string',
  })
  @IsOptional()
  id?: null | string;
}
