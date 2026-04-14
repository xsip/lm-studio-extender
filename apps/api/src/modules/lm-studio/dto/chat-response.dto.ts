import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

// ---------------------------------------------------------------------------
// Output item variants
// ---------------------------------------------------------------------------

export class MessageOutputDto {
  @ApiProperty({ enum: ['message'] })
  type: 'message';

  @ApiProperty()
  content: string;
}

export class ProviderInfoDto {
  @ApiProperty({ enum: ['plugin', 'ephemeral_mcp'] })
  type: 'plugin' | 'ephemeral_mcp';

  @ApiPropertyOptional()
  plugin_id?: string;

  @ApiPropertyOptional()
  server_label?: string;
}

export class ToolCallOutputDto {
  @ApiProperty({ enum: ['tool_call'] })
  type: 'tool_call';

  @ApiProperty()
  tool: string;

  @ApiProperty({ type: Object })
  arguments: Record<string, unknown>;

  @ApiProperty()
  output: string;

  @ApiProperty({ type: ProviderInfoDto })
  provider_info: ProviderInfoDto;
}

export class ReasoningOutputDto {
  @ApiProperty({ enum: ['reasoning'] })
  type: 'reasoning';

  @ApiProperty()
  content: string;
}

export class InvalidToolCallMetadataDto {
  @ApiProperty({ enum: ['invalid_name', 'invalid_arguments'] })
  type: 'invalid_name' | 'invalid_arguments';

  @ApiProperty()
  tool_name: string;

  @ApiPropertyOptional({ type: Object })
  arguments?: Record<string, unknown>;

  @ApiPropertyOptional({ type: ProviderInfoDto })
  provider_info?: ProviderInfoDto;
}

export class InvalidToolCallOutputDto {
  @ApiProperty({ enum: ['invalid_tool_call'] })
  type: 'invalid_tool_call';

  @ApiProperty()
  reason: string;

  @ApiProperty({ type: InvalidToolCallMetadataDto })
  metadata: InvalidToolCallMetadataDto;
}

export type OutputItem =
  | MessageOutputDto
  | ToolCallOutputDto
  | ReasoningOutputDto
  | InvalidToolCallOutputDto;

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export class ChatStatsDto {
  @ApiProperty({
    description:
      'Number of input tokens (includes formatting, tool defs, prior messages)',
  })
  input_tokens: number;

  @ApiProperty({ description: 'Total output tokens generated' })
  total_output_tokens: number;

  @ApiProperty({ description: 'Tokens used for reasoning' })
  reasoning_output_tokens: number;

  @ApiProperty({ description: 'Generation speed in tokens/s' })
  tokens_per_second: number;

  @ApiProperty({ description: 'Seconds to first token' })
  time_to_first_token_seconds: number;

  @ApiPropertyOptional({
    description:
      'Model load time in seconds (present only when model was not already loaded)',
  })
  model_load_time_seconds?: number;
}

// ---------------------------------------------------------------------------
// Chat response
// ---------------------------------------------------------------------------
@ApiExtraModels(
  MessageOutputDto,
  ToolCallOutputDto,
  ReasoningOutputDto,
  InvalidToolCallOutputDto,
)
export class ChatResponseDto {
  @ApiProperty({
    description: 'Loaded model instance that generated the response',
  })
  model_instance_id: string;

  @ApiProperty({
    description: 'Array of output items',
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MessageOutputDto) },
      { $ref: getSchemaPath(ToolCallOutputDto) },
      { $ref: getSchemaPath(ReasoningOutputDto) },
      { $ref: getSchemaPath(InvalidToolCallOutputDto) },
    ],
  })
  output: Array<
    | MessageOutputDto
    | ToolCallOutputDto
    | ReasoningOutputDto
    | InvalidToolCallOutputDto
  >;

  @ApiProperty({ type: ChatStatsDto })
  stats: ChatStatsDto;

  @ApiPropertyOptional({
    description:
      'Response ID for subsequent requests (present when store=true)',
  })
  response_id?: string;
}
