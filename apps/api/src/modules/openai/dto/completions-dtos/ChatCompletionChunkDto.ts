import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ChoiceDto } from './ChoiceDto';
import { CompletionUsageDto } from './CompletionUsageDto';

@ApiExtraModels(
  CompletionUsageDto,
)
export class ChatCompletionChunkDto {
  /** A unique identifier for the chat completion. Each chunk has the same ID. */
  @ApiProperty({
    description: `A unique identifier for the chat completion. Each chunk has the same ID.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /**
   * A list of chat completion choices. Can contain more than one elements if `n` is
   * greater than 1. Can also be empty for the last chunk if you set
   * `stream_options: {"include_usage": true}`.
   */
  @ApiProperty({
    description: `A list of chat completion choices. Can contain more than one elements if \`n\` is
  greater than 1. Can also be empty for the last chunk if you set
  \`stream_options: {"include_usage": true}\`.`,
    type: ChoiceDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices!: ChoiceDto[];

  /**
   * The Unix timestamp (in seconds) of when the chat completion was created. Each
   * chunk has the same timestamp.
   */
  @ApiProperty({
    description: `The Unix timestamp (in seconds) of when the chat completion was created. Each
  chunk has the same timestamp.`,
    type: 'number',
  })
  @IsNumber()
  created!: number;

  /** The model to generate the completion. */
  @ApiProperty({
    description: `The model to generate the completion.`,
    type: 'string',
  })
  @IsString()
  model!: string;

  /** The object type, which is always `chat.completion.chunk`. */
  @ApiProperty({
    description: `The object type, which is always \`chat.completion.chunk\`.`,
    type: 'string',
    enum: ['chat.completion.chunk'],
  })
  @Equals('chat.completion.chunk')
  object!: 'chat.completion.chunk';

  /**
   * Specifies the processing type used for serving the request.
   * 
   * - If set to 'auto', then the request will be processed with the service tier
   *   configured in the Project settings. Unless otherwise configured, the Project
   *   will use 'default'.
   * - If set to 'default', then the request will be processed with the standard
   *   pricing and performance for the selected model.
   * - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
   *   '[priority](https://openai.com/api-priority-processing/)', then the request
   *   will be processed with the corresponding service tier.
   * - When not set, the default behavior is 'auto'.
   * 
   * When the `service_tier` parameter is set, the response body will include the
   * `service_tier` value based on the processing mode actually used to serve the
   * request. This response value may be different from the value set in the
   * parameter.
   */
  @ApiProperty({
    required: false,
    description: `Specifies the processing type used for serving the request.
  
  - If set to 'auto', then the request will be processed with the service tier
    configured in the Project settings. Unless otherwise configured, the Project
    will use 'default'.
  - If set to 'default', then the request will be processed with the standard
    pricing and performance for the selected model.
  - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
    '[priority](https://openai.com/api-priority-processing/)', then the request
    will be processed with the corresponding service tier.
  - When not set, the default behavior is 'auto'.
  
  When the \`service_tier\` parameter is set, the response body will include the
  \`service_tier\` value based on the processing mode actually used to serve the
  request. This response value may be different from the value set in the
  parameter.`,
    enum: ['auto', 'default', 'flex', 'scale', 'priority'],
  })
  @IsOptional()
  @IsIn(['auto', 'default', 'flex', 'scale', 'priority'])
  service_tier?: null | 'auto' | 'default' | 'flex' | 'scale' | 'priority';

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  system_fingerprint?: string;

  /**
   * An optional field that will only be present when you set
   * `stream_options: {"include_usage": true}` in your request. When present, it
   * contains a null value **except for the last chunk** which contains the token
   * usage statistics for the entire request.
   * 
   * **NOTE:** If the stream is interrupted or cancelled, you may not receive the
   * final usage chunk which contains the total token usage for the request.
   */
  @ApiProperty({
    required: false,
    description: `An optional field that will only be present when you set
  \`stream_options: {"include_usage": true}\` in your request. When present, it
  contains a null value **except for the last chunk** which contains the token
  usage statistics for the entire request.
  
  **NOTE:** If the stream is interrupted or cancelled, you may not receive the
  final usage chunk which contains the total token usage for the request.`,
    type: () => CompletionUsageDto,
  })
  @IsOptional()
  usage?: null | CompletionUsageDto;
}
