import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCustomToolCallInputDoneEventDto {
  /** The complete input data for the custom tool call. */
  @ApiProperty({
    description: `The complete input data for the custom tool call.`,
    type: 'string',
  })
  @IsString()
  input!: string;

  /** Unique identifier for the API item associated with this event. */
  @ApiProperty({
    description: `Unique identifier for the API item associated with this event.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output this event applies to. */
  @ApiProperty({
    description: `The index of the output this event applies to.`,
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

  /** The event type identifier. */
  @ApiProperty({
    description: `The event type identifier.`,
    type: 'string',
    enum: ['response.custom_tool_call_input.done'],
  })
  @Equals('response.custom_tool_call_input.done')
  type!: 'response.custom_tool_call_input.done';
}
