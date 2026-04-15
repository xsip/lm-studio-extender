import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ResponseCompactionItemDto {
  /** The unique ID of the compaction item. */
  @ApiProperty({
    description: `The unique ID of the compaction item.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The encrypted content that was produced by compaction. */
  @ApiProperty({
    description: `The encrypted content that was produced by compaction.`,
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

  /** The identifier of the actor that created the item. */
  @ApiProperty({
    required: false,
    description: `The identifier of the actor that created the item.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  created_by?: string;
}
