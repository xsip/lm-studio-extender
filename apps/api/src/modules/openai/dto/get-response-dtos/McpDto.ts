import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional, IsString } from 'class-validator';

import { McpToolFilterDto } from './McpToolFilterDto';
import { McpToolApprovalFilterDto } from './McpToolApprovalFilterDto';

@ApiExtraModels(
  McpToolFilterDto,
  McpToolApprovalFilterDto,
)
export class McpDto {
  /** A label for this MCP server, used to identify it in tool calls. */
  @ApiProperty({
    description: `A label for this MCP server, used to identify it in tool calls.`,
    type: 'string',
  })
  @IsString()
  server_label!: string;

  /** The type of the MCP tool. Always `mcp`. */
  @ApiProperty({
    description: `The type of the MCP tool. Always \`mcp\`.`,
    example: 'mcp',
  })
  @Equals('mcp')
  type!: 'mcp';

  /** List of allowed tool names or a filter object. */
  @ApiProperty({
    required: false,
    description: `List of allowed tool names or a filter object.`,
    oneOf: [
      { $ref: getSchemaPath(McpToolFilterDto) },
    ],
  })
  @IsOptional()
  allowed_tools?: null | string[] | McpToolFilterDto;

  /**
   * An OAuth access token that can be used with a remote MCP server, either with a
   * custom MCP server URL or a service connector. Your application must handle the
   * OAuth authorization flow and provide the token here.
   */
  @ApiProperty({
    required: false,
    description: `An OAuth access token that can be used with a remote MCP server, either with a
  custom MCP server URL or a service connector. Your application must handle the
  OAuth authorization flow and provide the token here.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  authorization?: string;

  /**
   * Identifier for service connectors, like those available in ChatGPT. One of
   * `server_url` or `connector_id` must be provided. Learn more about service
   * connectors
   * [here](https://platform.openai.com/docs/guides/tools-remote-mcp#connectors).
   * 
   * Currently supported `connector_id` values are:
   * 
   * - Dropbox: `connector_dropbox`
   * - Gmail: `connector_gmail`
   * - Google Calendar: `connector_googlecalendar`
   * - Google Drive: `connector_googledrive`
   * - Microsoft Teams: `connector_microsoftteams`
   * - Outlook Calendar: `connector_outlookcalendar`
   * - Outlook Email: `connector_outlookemail`
   * - SharePoint: `connector_sharepoint`
   */
  @ApiProperty({
    required: false,
    description: `Identifier for service connectors, like those available in ChatGPT. One of
  \`server_url\` or \`connector_id\` must be provided. Learn more about service
  connectors
  [here](https://platform.openai.com/docs/guides/tools-remote-mcp#connectors).
  
  Currently supported \`connector_id\` values are:
  
  - Dropbox: \`connector_dropbox\`
  - Gmail: \`connector_gmail\`
  - Google Calendar: \`connector_googlecalendar\`
  - Google Drive: \`connector_googledrive\`
  - Microsoft Teams: \`connector_microsoftteams\`
  - Outlook Calendar: \`connector_outlookcalendar\`
  - Outlook Email: \`connector_outlookemail\`
  - SharePoint: \`connector_sharepoint\``,
    enum: ['connector_dropbox', 'connector_gmail', 'connector_googlecalendar', 'connector_googledrive', 'connector_microsoftteams', 'connector_outlookcalendar', 'connector_outlookemail', 'connector_sharepoint'],
  })
  @IsOptional()
  @IsIn(['connector_dropbox', 'connector_gmail', 'connector_googlecalendar', 'connector_googledrive', 'connector_microsoftteams', 'connector_outlookcalendar', 'connector_outlookemail', 'connector_sharepoint'])
  connector_id?: 'connector_dropbox' | 'connector_gmail' | 'connector_googlecalendar' | 'connector_googledrive' | 'connector_microsoftteams' | 'connector_outlookcalendar' | 'connector_outlookemail' | 'connector_sharepoint';

  /** Whether this MCP tool is deferred and discovered via tool search. */
  @ApiProperty({
    required: false,
    description: `Whether this MCP tool is deferred and discovered via tool search.`,
  })
  @IsOptional()
  defer_loading?: false | true;

  /**
   * Optional HTTP headers to send to the MCP server. Use for authentication or other
   * purposes.
   */
  @ApiProperty({
    required: false,
    description: `Optional HTTP headers to send to the MCP server. Use for authentication or other
  purposes.`,
  })
  @IsOptional()
  headers?: null | any;

  /** Specify which of the MCP server's tools require approval. */
  @ApiProperty({
    required: false,
    description: `Specify which of the MCP server's tools require approval.`,
    oneOf: [
      { $ref: getSchemaPath(McpToolApprovalFilterDto) },
    ],
  })
  @IsOptional()
  require_approval?: null | McpToolApprovalFilterDto | 'always' | 'never';

  /** Optional description of the MCP server, used to provide more context. */
  @ApiProperty({
    required: false,
    description: `Optional description of the MCP server, used to provide more context.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  server_description?: string;

  /**
   * The URL for the MCP server. One of `server_url` or `connector_id` must be
   * provided.
   */
  @ApiProperty({
    required: false,
    description: `The URL for the MCP server. One of \`server_url\` or \`connector_id\` must be
  provided.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  server_url?: string;
}
