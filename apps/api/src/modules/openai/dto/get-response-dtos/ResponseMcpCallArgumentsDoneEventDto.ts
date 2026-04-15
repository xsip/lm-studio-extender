import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseMcpCallArgumentsDoneEventDto {
  /** A JSON string containing the finalized arguments for the MCP tool call. */
  @ApiProperty({
    description: `A JSON string containing the finalized arguments for the MCP tool call.`,
    type: 'string',
  })
  @IsString()
  arguments!: string;

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

  /** The type of the event. Always 'response.mcp_call_arguments.done'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.mcp_call_arguments.done'.`,
    example: 'response.mcp_call_arguments.done',
  })
  @Equals('response.mcp_call_arguments.done')
  type!: 'response.mcp_call_arguments.done';
}
