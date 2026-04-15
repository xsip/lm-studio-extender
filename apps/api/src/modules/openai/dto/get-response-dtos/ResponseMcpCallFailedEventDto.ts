import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpCallFailedEventDto {
  /** The ID of the MCP tool call item that failed. */
  @ApiProperty({
    description: `The ID of the MCP tool call item that failed.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that failed. */
  @ApiProperty({
    description: `The index of the output item that failed.`,
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

  /** The type of the event. Always 'response.mcp_call.failed'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.mcp_call.failed'.`,
    type: 'string',
    enum: ['response.mcp_call.failed'],
  })
  @Equals('response.mcp_call.failed')
  type!: 'response.mcp_call.failed';
}
