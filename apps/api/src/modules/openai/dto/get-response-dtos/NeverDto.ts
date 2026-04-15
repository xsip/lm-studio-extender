import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class NeverDto {
  /**
   * Indicates whether or not a tool modifies data or is read-only. If an MCP server
   * is
   * [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
   * it will match this filter.
   */
  @ApiProperty({
    required: false,
    description: `Indicates whether or not a tool modifies data or is read-only. If an MCP server
  is
  [annotated with \`readOnlyHint\`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
  it will match this filter.`,
  })
  @IsOptional()
  read_only?: false | true;

  /** List of allowed tool names. */
  @ApiProperty({
    required: false,
    description: `List of allowed tool names.`,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  tool_names?: string[];
}
