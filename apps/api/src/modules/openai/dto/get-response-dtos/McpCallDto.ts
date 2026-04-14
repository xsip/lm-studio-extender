import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional, IsString } from 'class-validator';

export class McpCallDto {
  /** The unique ID of the tool call. */
  @ApiProperty({ description: `The unique ID of the tool call.`, type: 'string' })
  @IsString()
  id!: string;

  /** A JSON string of the arguments passed to the tool. */
  @ApiProperty({ description: `A JSON string of the arguments passed to the tool.`, type: 'string' })
  @IsString()
  arguments!: string;

  /** The name of the tool that was run. */
  @ApiProperty({ description: `The name of the tool that was run.`, type: 'string' })
  @IsString()
  name!: string;

  /** The label of the MCP server running the tool. */
  @ApiProperty({ description: `The label of the MCP server running the tool.`, type: 'string' })
  @IsString()
  server_label!: string;

  /** The type of the item. Always `mcp_call`. */
  @ApiProperty({ description: `The type of the item. Always \`mcp_call\`.`, example: 'mcp_call' })
  @Equals('mcp_call')
  type!: 'mcp_call';

  /** Unique identifier for the MCP tool call approval request. Include this value in
a subsequent `mcp_approval_response` input to approve or reject the
corresponding tool call. */
  @ApiProperty({ required: false, description: `Unique identifier for the MCP tool call approval request. Include this value in
a subsequent \`mcp_approval_response\` input to approve or reject the
corresponding tool call.` })
  @IsOptional()
  approval_request_id?: null | string;

  /** The error from the tool call, if any. */
  @ApiProperty({ required: false, description: `The error from the tool call, if any.` })
  @IsOptional()
  error?: null | string;

  /** The output from the tool call. */
  @ApiProperty({ required: false, description: `The output from the tool call.` })
  @IsOptional()
  output?: null | string;

  /** The status of the tool call. One of `in_progress`, `completed`, `incomplete`,
`calling`, or `failed`. */
  @ApiProperty({ required: false, description: `The status of the tool call. One of \`in_progress\`, \`completed\`, \`incomplete\`,
\`calling\`, or \`failed\`.`, enum: ['in_progress', 'completed', 'incomplete', 'failed', 'calling'] })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'incomplete', 'failed', 'calling'])
  status?: 'in_progress' | 'completed' | 'incomplete' | 'failed' | 'calling';
}
