import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpCallCompletedEventDto {
  /** The ID of the MCP tool call item that completed. */
  @ApiProperty({ description: `The ID of the MCP tool call item that completed.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item that completed. */
  @ApiProperty({ description: `The index of the output item that completed.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.mcp_call.completed'. */
  @ApiProperty({ description: `The type of the event. Always 'response.mcp_call.completed'.`, example: 'response.mcp_call.completed' })
  @Equals('response.mcp_call.completed')
  type!: 'response.mcp_call.completed';
}
