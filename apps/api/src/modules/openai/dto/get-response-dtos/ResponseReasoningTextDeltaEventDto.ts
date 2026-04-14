import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseReasoningTextDeltaEventDto {
  /** The index of the reasoning content part this delta is associated with. */
  @ApiProperty({ description: `The index of the reasoning content part this delta is associated with.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The text delta that was added to the reasoning content. */
  @ApiProperty({ description: `The text delta that was added to the reasoning content.`, type: 'string' })
  @IsString()
  delta!: string;

  /** The ID of the item this reasoning text delta is associated with. */
  @ApiProperty({ description: `The ID of the item this reasoning text delta is associated with.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item this reasoning text delta is associated with. */
  @ApiProperty({ description: `The index of the output item this reasoning text delta is associated with.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.reasoning_text.delta`. */
  @ApiProperty({ description: `The type of the event. Always \`response.reasoning_text.delta\`.`, example: 'response.reasoning_text.delta' })
  @Equals('response.reasoning_text.delta')
  type!: 'response.reasoning_text.delta';
}
