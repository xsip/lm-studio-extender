import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseReasoningSummaryTextDoneEventDto {
  /** The ID of the item this summary text is associated with. */
  @ApiProperty({ description: `The ID of the item this summary text is associated with.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item this summary text is associated with. */
  @ApiProperty({ description: `The index of the output item this summary text is associated with.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The index of the summary part within the reasoning summary. */
  @ApiProperty({ description: `The index of the summary part within the reasoning summary.`, type: 'number' })
  @IsNumber()
  summary_index!: number;

  /** The full text of the completed reasoning summary. */
  @ApiProperty({ description: `The full text of the completed reasoning summary.`, type: 'string' })
  @IsString()
  text!: string;

  /** The type of the event. Always `response.reasoning_summary_text.done`. */
  @ApiProperty({ description: `The type of the event. Always \`response.reasoning_summary_text.done\`.`, example: 'response.reasoning_summary_text.done' })
  @Equals('response.reasoning_summary_text.done')
  type!: 'response.reasoning_summary_text.done';
}
