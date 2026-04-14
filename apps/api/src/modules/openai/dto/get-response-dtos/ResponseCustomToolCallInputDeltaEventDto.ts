import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCustomToolCallInputDeltaEventDto {
  /** The incremental input data (delta) for the custom tool call. */
  @ApiProperty({ description: `The incremental input data (delta) for the custom tool call.`, type: 'string' })
  @IsString()
  delta!: string;

  /** Unique identifier for the API item associated with this event. */
  @ApiProperty({ description: `Unique identifier for the API item associated with this event.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output this delta applies to. */
  @ApiProperty({ description: `The index of the output this delta applies to.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The event type identifier. */
  @ApiProperty({ description: `The event type identifier.`, example: 'response.custom_tool_call_input.delta' })
  @Equals('response.custom_tool_call_input.delta')
  type!: 'response.custom_tool_call_input.delta';
}
