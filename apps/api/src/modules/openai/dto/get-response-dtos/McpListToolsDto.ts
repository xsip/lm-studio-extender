import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ToolDto } from './ToolDto';

export class McpListToolsDto {
  /** The unique ID of the list. */
  @ApiProperty({
    description: `The unique ID of the list.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The label of the MCP server. */
  @ApiProperty({
    description: `The label of the MCP server.`,
    type: 'string',
  })
  @IsString()
  server_label!: string;

  /** The tools available on the server. */
  @ApiProperty({
    description: `The tools available on the server.`,
    type: ToolDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  tools!: ToolDto[];

  /** The type of the item. Always `mcp_list_tools`. */
  @ApiProperty({
    description: `The type of the item. Always \`mcp_list_tools\`.`,
    example: 'mcp_list_tools',
  })
  @Equals('mcp_list_tools')
  type!: 'mcp_list_tools';

  /** Error message if the server could not list tools. */
  @ApiProperty({
    required: false,
    description: `Error message if the server could not list tools.`,
    type: 'string',
  })
  @IsOptional()
  error?: null | string;
}
