import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PartDto } from './PartDto';

export class ResponseReasoningSummaryPartDoneEventDto {
  /** The ID of the item this summary part is associated with. */
  @ApiProperty({
    description: `The ID of the item this summary part is associated with.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item this summary part is associated with. */
  @ApiProperty({
    description: `The index of the output item this summary part is associated with.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The completed summary part. */
  @ApiProperty({
    description: `The completed summary part.`,
    type: () => PartDto,
  })
  @ValidateNested()
  @Type(() => PartDto)
  part!: PartDto;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The index of the summary part within the reasoning summary. */
  @ApiProperty({
    description: `The index of the summary part within the reasoning summary.`,
    type: 'number',
  })
  @IsNumber()
  summary_index!: number;

  /** The type of the event. Always `response.reasoning_summary_part.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.reasoning_summary_part.done\`.`,
    example: 'response.reasoning_summary_part.done',
  })
  @Equals('response.reasoning_summary_part.done')
  type!: 'response.reasoning_summary_part.done';
}
