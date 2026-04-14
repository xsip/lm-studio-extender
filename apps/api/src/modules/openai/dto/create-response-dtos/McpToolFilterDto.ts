import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class McpToolFilterDto {
  /** Indicates whether or not a tool modifies data or is read-only. If an MCP server
is
[annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
it will match this filter. */
  @ApiProperty({ required: false, description: `Indicates whether or not a tool modifies data or is read-only. If an MCP server
is
[annotated with \`readOnlyHint\`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
it will match this filter.`, enum: [false, true] })
  @IsOptional()
  @IsIn([false, true])
  read_only?: false | true;

  /** List of allowed tool names. */
  @ApiProperty({ required: false, description: `List of allowed tool names.`, isArray: true })
  @IsOptional()
  @IsArray()
  tool_names?: string[];
}
