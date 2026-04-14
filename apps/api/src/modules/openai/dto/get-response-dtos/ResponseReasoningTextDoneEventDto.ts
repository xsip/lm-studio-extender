import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseReasoningTextDoneEventDto {
  /** The index of the reasoning content part. */
  @ApiProperty({ description: `The index of the reasoning content part.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The ID of the item this reasoning text is associated with. */
  @ApiProperty({ description: `The ID of the item this reasoning text is associated with.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item this reasoning text is associated with. */
  @ApiProperty({ description: `The index of the output item this reasoning text is associated with.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The full text of the completed reasoning content. */
  @ApiProperty({ description: `The full text of the completed reasoning content.`, type: 'string' })
  @IsString()
  text!: string;

  /** The type of the event. Always `response.reasoning_text.done`. */
  @ApiProperty({ description: `The type of the event. Always \`response.reasoning_text.done\`.`, example: 'response.reasoning_text.done' })
  @Equals('response.reasoning_text.done')
  type!: 'response.reasoning_text.done';
}
