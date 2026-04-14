import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpListToolsCompletedEventDto {
  /** The ID of the MCP tool call item that produced this output. */
  @ApiProperty({ description: `The ID of the MCP tool call item that produced this output.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item that was processed. */
  @ApiProperty({ description: `The index of the output item that was processed.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.mcp_list_tools.completed'. */
  @ApiProperty({ description: `The type of the event. Always 'response.mcp_list_tools.completed'.`, example: 'response.mcp_list_tools.completed' })
  @Equals('response.mcp_list_tools.completed')
  type!: 'response.mcp_list_tools.completed';
}
