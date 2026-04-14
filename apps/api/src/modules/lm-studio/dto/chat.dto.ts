import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

// ---------------------------------------------------------------------------
// Input variants
// ---------------------------------------------------------------------------

export class TextInputDto {
  @ApiProperty({ enum: ['message'] })
  @IsIn(['message'])
  type: 'message';

  @ApiProperty()
  @IsString()
  content: string;
}

export class ImageInputDto {
  @ApiProperty({ enum: ['image'] })
  @IsIn(['image'])
  type: 'image';

  @ApiProperty({ description: 'Base64-encoded data URL of the image' })
  @IsString()
  data_url: string;
}

// ---------------------------------------------------------------------------
// Integration variants
// ---------------------------------------------------------------------------

export class PluginIntegrationDto {
  @ApiProperty({ enum: ['plugin'] })
  @IsIn(['plugin'])
  type: 'plugin';

  @ApiProperty()
  @IsString()
  id: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_tools?: string[];
}

export class EphemeralMcpIntegrationDto {
  @ApiProperty({ enum: ['ephemeral_mcp'] })
  @IsIn(['ephemeral_mcp'])
  type: 'ephemeral_mcp';

  @ApiProperty()
  @IsString()
  server_label: string;

  @ApiProperty()
  @IsString()
  server_url: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_tools?: string[];

  @ApiPropertyOptional({
    description: 'Custom HTTP headers sent to the MCP server',
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Main chat request DTO
// ---------------------------------------------------------------------------

export class ChatRequestDto {
  @ApiProperty({ description: 'Unique identifier for the model to use' })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Message(s) to send to the model',
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          oneOf: [
            { $ref: getSchemaPath(TextInputDto) },
            { $ref: getSchemaPath(ImageInputDto) },
          ],
        },
      },
    ],
  })
  input: string | (TextInputDto | ImageInputDto)[];

  @ApiPropertyOptional({
    description: 'System prompt that sets model behaviour',
  })
  @IsOptional()
  @IsString()
  system_prompt?: string;

  @ApiPropertyOptional({
    description: 'Integrations (plugins / ephemeral MCP servers) to enable',
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(PluginIntegrationDto) },
        { $ref: getSchemaPath(EphemeralMcpIntegrationDto) },
      ],
    },
  })
  @IsOptional()
  @IsArray()
  integrations?: (string | PluginIntegrationDto | EphemeralMcpIntegrationDto)[];

  @ApiPropertyOptional({
    description: 'Stream partial outputs via SSE',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  @ApiPropertyOptional({ description: 'Sampling temperature [0,1]' })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Nucleus sampling probability [0,1]' })
  @IsOptional()
  @IsNumber()
  top_p?: number;

  @ApiPropertyOptional({ description: 'Top-k most probable tokens' })
  @IsOptional()
  @IsInt()
  top_k?: number;

  @ApiPropertyOptional({
    description: 'Minimum base probability for token selection [0,1]',
  })
  @IsOptional()
  @IsNumber()
  min_p?: number;

  @ApiPropertyOptional({ description: 'Repetition penalty (1 = no penalty)' })
  @IsOptional()
  @IsNumber()
  repeat_penalty?: number;

  @ApiPropertyOptional({ description: 'Maximum number of tokens to generate' })
  @IsOptional()
  @IsInt()
  max_output_tokens?: number;

  @ApiPropertyOptional({
    enum: ['off', 'low', 'medium', 'high', 'on'],
    description: 'Reasoning effort level',
  })
  @IsOptional()
  @IsIn(['off', 'low', 'medium', 'high', 'on'])
  reasoning?: 'off' | 'low' | 'medium' | 'high' | 'on';

  @ApiPropertyOptional({
    description:
      'Context length in tokens (recommended to raise for MCP usage)',
  })
  @IsOptional()
  @IsInt()
  context_length?: number;

  @ApiPropertyOptional({
    description: 'Whether to persist the chat and return a response_id',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  store?: boolean;

  @ApiPropertyOptional({
    description:
      'Previous response ID to continue a stored conversation (must start with "resp_")',
  })
  @IsOptional()
  @IsString()
  previous_response_id?: string;
}
