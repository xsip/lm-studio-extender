import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpListToolsInProgressEventDto {
  /** The ID of the MCP tool call item that is being processed. */
  @ApiProperty({
    description: `The ID of the MCP tool call item that is being processed.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that is being processed. */
  @ApiProperty({
    description: `The index of the output item that is being processed.`,
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

  /** The type of the event. Always 'response.mcp_list_tools.in_progress'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.mcp_list_tools.in_progress'.`,
    type: 'string',
    enum: ['response.mcp_list_tools.in_progress'],
  })
  @Equals('response.mcp_list_tools.in_progress')
  type!: 'response.mcp_list_tools.in_progress';
}
