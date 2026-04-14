import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseRefusalDeltaEventDto {
  /** The index of the content part that the refusal text is added to. */
  @ApiProperty({ description: `The index of the content part that the refusal text is added to.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The refusal text that is added. */
  @ApiProperty({ description: `The refusal text that is added.`, type: 'string' })
  @IsString()
  delta!: string;

  /** The ID of the output item that the refusal text is added to. */
  @ApiProperty({ description: `The ID of the output item that the refusal text is added to.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item that the refusal text is added to. */
  @ApiProperty({ description: `The index of the output item that the refusal text is added to.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.refusal.delta`. */
  @ApiProperty({ description: `The type of the event. Always \`response.refusal.delta\`.`, example: 'response.refusal.delta' })
  @Equals('response.refusal.delta')
  type!: 'response.refusal.delta';
}
