import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ToolChoiceMcpDto {
  /** The label of the MCP server to use. */
  @ApiProperty({
    description: `The label of the MCP server to use.`,
    type: 'string',
  })
  @IsString()
  server_label!: string;

  /** For MCP tools, the type is always `mcp`. */
  @ApiProperty({
    description: `For MCP tools, the type is always \`mcp\`.`,
    example: 'mcp',
  })
  @Equals('mcp')
  type!: 'mcp';

  /** The name of the tool to call on the server. */
  @ApiProperty({
    required: false,
    description: `The name of the tool to call on the server.`,
    type: 'string',
  })
  @IsOptional()
  name?: null | string;
}
