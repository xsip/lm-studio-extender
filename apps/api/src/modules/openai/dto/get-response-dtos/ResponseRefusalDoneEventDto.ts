import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseRefusalDoneEventDto {
  /** The index of the content part that the refusal text is finalized. */
  @ApiProperty({
    description: `The index of the content part that the refusal text is finalized.`,
    type: 'number',
  })
  @IsNumber()
  content_index!: number;

  /** The ID of the output item that the refusal text is finalized. */
  @ApiProperty({
    description: `The ID of the output item that the refusal text is finalized.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that the refusal text is finalized. */
  @ApiProperty({
    description: `The index of the output item that the refusal text is finalized.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The refusal text that is finalized. */
  @ApiProperty({
    description: `The refusal text that is finalized.`,
    type: 'string',
  })
  @IsString()
  refusal!: string;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.refusal.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.refusal.done\`.`,
    example: 'response.refusal.done',
  })
  @Equals('response.refusal.done')
  type!: 'response.refusal.done';
}
