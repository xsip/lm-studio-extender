import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseReasoningSummaryTextDeltaEventDto {
  /** The text delta that was added to the summary. */
  @ApiProperty({
    description: `The text delta that was added to the summary.`,
    type: 'string',
  })
  @IsString()
  delta!: string;

  /** The ID of the item this summary text delta is associated with. */
  @ApiProperty({
    description: `The ID of the item this summary text delta is associated with.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item this summary text delta is associated with. */
  @ApiProperty({
    description: `The index of the output item this summary text delta is associated with.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

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

  /** The type of the event. Always `response.reasoning_summary_text.delta`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.reasoning_summary_text.delta\`.`,
    example: 'response.reasoning_summary_text.delta',
  })
  @Equals('response.reasoning_summary_text.delta')
  type!: 'response.reasoning_summary_text.delta';
}
