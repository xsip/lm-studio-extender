import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class McpApprovalRequestDto {
  /** The unique ID of the approval request. */
  @ApiProperty({
    description: `The unique ID of the approval request.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** A JSON string of arguments for the tool. */
  @ApiProperty({
    description: `A JSON string of arguments for the tool.`,
    type: 'string',
  })
  @IsString()
  arguments!: string;

  /** The name of the tool to run. */
  @ApiProperty({
    description: `The name of the tool to run.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** The label of the MCP server making the request. */
  @ApiProperty({
    description: `The label of the MCP server making the request.`,
    type: 'string',
  })
  @IsString()
  server_label!: string;

  /** The type of the item. Always `mcp_approval_request`. */
  @ApiProperty({
    description: `The type of the item. Always \`mcp_approval_request\`.`,
    type: 'string',
    enum: ['mcp_approval_request'],
  })
  @Equals('mcp_approval_request')
  type!: 'mcp_approval_request';
}
