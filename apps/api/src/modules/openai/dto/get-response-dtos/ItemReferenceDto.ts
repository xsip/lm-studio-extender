import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ItemReferenceDto {
  /** The ID of the item to reference. */
  @ApiProperty({
    description: `The ID of the item to reference.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The type of item to reference. Always `item_reference`. */
  @ApiProperty({
    required: false,
    description: `The type of item to reference. Always \`item_reference\`.`,
    example: 'item_reference',
  })
  @IsOptional()
  @IsIn(['item_reference'])
  type?: null | 'item_reference';
}
