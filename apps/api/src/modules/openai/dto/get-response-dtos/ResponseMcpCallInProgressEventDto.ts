import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpCallInProgressEventDto {
  /** The unique identifier of the MCP tool call item being processed. */
  @ApiProperty({ description: `The unique identifier of the MCP tool call item being processed.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response's output array. */
  @ApiProperty({ description: `The index of the output item in the response's output array.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.mcp_call.in_progress'. */
  @ApiProperty({ description: `The type of the event. Always 'response.mcp_call.in_progress'.`, example: 'response.mcp_call.in_progress' })
  @Equals('response.mcp_call.in_progress')
  type!: 'response.mcp_call.in_progress';
}
