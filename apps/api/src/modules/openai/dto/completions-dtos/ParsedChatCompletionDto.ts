import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ParsedChoiceDto } from './ParsedChoiceDto';
import { CompletionUsageDto } from './CompletionUsageDto';

export class ParsedChatCompletionDto {
  /** A unique identifier for the chat completion. */
  @ApiProperty({
    description: `A unique identifier for the chat completion.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    type: ParsedChoiceDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParsedChoiceDto)
  choices!: ParsedChoiceDto[];

  /** The Unix timestamp (in seconds) of when the chat completion was created. */
  @ApiProperty({
    description: `The Unix timestamp (in seconds) of when the chat completion was created.`,
    type: 'number',
  })
  @IsNumber()
  created!: number;

  /** The model used for the chat completion. */
  @ApiProperty({
    description: `The model used for the chat completion.`,
    type: 'string',
  })
  @IsString()
  model!: string;

  /** The object type, which is always `chat.completion`. */
  @ApiProperty({
    description: `The object type, which is always \`chat.completion\`.`,
    type: 'string',
    enum: ['chat.completion'],
  })
  @Equals('chat.completion')
  object!: 'chat.completion';

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

  /** Usage statistics for the completion request. */
  @ApiProperty({
    required: false,
    description: `Usage statistics for the completion request.`,
    type: () => CompletionUsageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompletionUsageDto)
  usage?: CompletionUsageDto;
}
