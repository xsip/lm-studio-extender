import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpCallArgumentsDeltaEventDto {
  /**
   * A JSON string containing the partial update to the arguments for the MCP tool
   * call.
   */
  @ApiProperty({
    description: `A JSON string containing the partial update to the arguments for the MCP tool
  call.`,
    type: 'string',
  })
  @IsString()
  delta!: string;

  /** The unique identifier of the MCP tool call item being processed. */
  @ApiProperty({
    description: `The unique identifier of the MCP tool call item being processed.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response's output array. */
  @ApiProperty({
    description: `The index of the output item in the response's output array.`,
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

  /** The type of the event. Always 'response.mcp_call_arguments.delta'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.mcp_call_arguments.delta'.`,
    type: 'string',
    enum: ['response.mcp_call_arguments.delta'],
  })
  @Equals('response.mcp_call_arguments.delta')
  type!: 'response.mcp_call_arguments.delta';
}
