import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional } from 'class-validator';

export class ToolSearchToolDto {
  /** The type of the tool. Always `tool_search`. */
  @ApiProperty({ description: `The type of the tool. Always \`tool_search\`.`, example: 'tool_search' })
  @Equals('tool_search')
  type!: 'tool_search';

  /** Description shown to the model for a client-executed tool search tool. */
  @ApiProperty({ required: false, description: `Description shown to the model for a client-executed tool search tool.` })
  @IsOptional()
  description?: null | string;

  /** Whether tool search is executed by the server or by the client. */
  @ApiProperty({ required: false, description: `Whether tool search is executed by the server or by the client.`, enum: ['server', 'client'] })
  @IsOptional()
  @IsIn(['server', 'client'])
  execution?: 'server' | 'client';

  /** Parameter schema for a client-executed tool search tool. */
  @ApiProperty({ required: false, description: `Parameter schema for a client-executed tool search tool.` })
  @IsOptional()
  parameters?: unknown;
}
