import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseOutputItemDto } from './ResponseOutputItemDto';

export class ResponseOutputItemDoneEventDto {
  /** The output item that was marked done. */
  @ApiProperty({ description: `The output item that was marked done.`, type: () => ResponseOutputItemDto })
  @ValidateNested()
  @Type(() => ResponseOutputItemDto)
  item!: ResponseOutputItemDto;

  /** The index of the output item that was marked done. */
  @ApiProperty({ description: `The index of the output item that was marked done.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.output_item.done`. */
  @ApiProperty({ description: `The type of the event. Always \`response.output_item.done\`.`, example: 'response.output_item.done' })
  @Equals('response.output_item.done')
  type!: 'response.output_item.done';
}
