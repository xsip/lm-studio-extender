import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseErrorDto } from './ResponseErrorDto';
import { IncompleteDetailsDto } from './IncompleteDetailsDto';
import { EasyInputMessageDto } from './EasyInputMessageDto';
import { MessageDto } from './MessageDto';
import { ResponseOutputMessageDto } from './ResponseOutputMessageDto';
import { ResponseFileSearchToolCallDto } from './ResponseFileSearchToolCallDto';
import { ResponseComputerToolCallDto } from './ResponseComputerToolCallDto';
import { ComputerCallOutputDto } from './ComputerCallOutputDto';
import { ResponseFunctionWebSearchDto } from './ResponseFunctionWebSearchDto';
import { ResponseFunctionToolCallDto } from './ResponseFunctionToolCallDto';
import { FunctionCallOutputDto } from './FunctionCallOutputDto';
import { ToolSearchCallDto } from './ToolSearchCallDto';
import { ResponseToolSearchOutputItemParamDto } from './ResponseToolSearchOutputItemParamDto';
import { ResponseReasoningItemDto } from './ResponseReasoningItemDto';
import { ResponseCompactionItemParamDto } from './ResponseCompactionItemParamDto';
import { ImageGenerationCallDto } from './ImageGenerationCallDto';
import { ResponseCodeInterpreterToolCallDto } from './ResponseCodeInterpreterToolCallDto';
import { LocalShellCallDto } from './LocalShellCallDto';
import { LocalShellCallOutputDto } from './LocalShellCallOutputDto';
import { ShellCallDto } from './ShellCallDto';
import { ShellCallOutputDto } from './ShellCallOutputDto';
import { ApplyPatchCallDto } from './ApplyPatchCallDto';
import { ApplyPatchCallOutputDto } from './ApplyPatchCallOutputDto';
import { McpListToolsDto } from './McpListToolsDto';
import { McpApprovalRequestDto } from './McpApprovalRequestDto';
import { McpApprovalResponseDto } from './McpApprovalResponseDto';
import { McpCallDto } from './McpCallDto';
import { ResponseCustomToolCallOutputDto } from './ResponseCustomToolCallOutputDto';
import { ResponseCustomToolCallDto } from './ResponseCustomToolCallDto';
import { ItemReferenceDto } from './ItemReferenceDto';
import { _Inline_0Dto } from './_Inline_0Dto';
import { ResponseFunctionToolCallOutputItemDto } from './ResponseFunctionToolCallOutputItemDto';
import { ResponseComputerToolCallOutputItemDto } from './ResponseComputerToolCallOutputItemDto';
import { ResponseToolSearchCallDto } from './ResponseToolSearchCallDto';
import { ResponseToolSearchOutputItemDto } from './ResponseToolSearchOutputItemDto';
import { ResponseCompactionItemDto } from './ResponseCompactionItemDto';
import { ResponseFunctionShellToolCallDto } from './ResponseFunctionShellToolCallDto';
import { ResponseFunctionShellToolCallOutputDto } from './ResponseFunctionShellToolCallOutputDto';
import { ResponseApplyPatchToolCallDto } from './ResponseApplyPatchToolCallDto';
import { ResponseApplyPatchToolCallOutputDto } from './ResponseApplyPatchToolCallOutputDto';
import { ResponseCustomToolCallOutputItemDto } from './ResponseCustomToolCallOutputItemDto';
import { ToolChoiceAllowedDto } from './ToolChoiceAllowedDto';
import { ToolChoiceTypesDto } from './ToolChoiceTypesDto';
import { ToolChoiceFunctionDto } from './ToolChoiceFunctionDto';
import { ToolChoiceMcpDto } from './ToolChoiceMcpDto';
import { ToolChoiceCustomDto } from './ToolChoiceCustomDto';
import { ToolChoiceApplyPatchDto } from './ToolChoiceApplyPatchDto';
import { ToolChoiceShellDto } from './ToolChoiceShellDto';
import { FunctionToolDto } from './FunctionToolDto';
import { FileSearchToolDto } from './FileSearchToolDto';
import { ComputerToolDto } from './ComputerToolDto';
import { ComputerUsePreviewToolDto } from './ComputerUsePreviewToolDto';
import { WebSearchToolDto } from './WebSearchToolDto';
import { McpDto } from './McpDto';
import { CodeInterpreterDto } from './CodeInterpreterDto';
import { ImageGenerationDto } from './ImageGenerationDto';
import { LocalShellDto } from './LocalShellDto';
import { FunctionShellToolDto } from './FunctionShellToolDto';
import { CustomToolDto } from './CustomToolDto';
import { NamespaceToolDto } from './NamespaceToolDto';
import { ToolSearchToolDto } from './ToolSearchToolDto';
import { WebSearchPreviewToolDto } from './WebSearchPreviewToolDto';
import { ApplyPatchToolDto } from './ApplyPatchToolDto';
import { ConversationDto } from './ConversationDto';
import { ResponsePromptDto } from './ResponsePromptDto';
import { ReasoningDto } from './ReasoningDto';
import { ResponseTextConfigDto } from './ResponseTextConfigDto';
import { ResponseUsageDto } from './ResponseUsageDto';

@ApiExtraModels(
  ResponseErrorDto,
  IncompleteDetailsDto,
  EasyInputMessageDto,
  MessageDto,
  ResponseOutputMessageDto,
  ResponseFileSearchToolCallDto,
  ResponseComputerToolCallDto,
  ComputerCallOutputDto,
  ResponseFunctionWebSearchDto,
  ResponseFunctionToolCallDto,
  FunctionCallOutputDto,
  ToolSearchCallDto,
  ResponseToolSearchOutputItemParamDto,
  ResponseReasoningItemDto,
  ResponseCompactionItemParamDto,
  ImageGenerationCallDto,
  ResponseCodeInterpreterToolCallDto,
  LocalShellCallDto,
  LocalShellCallOutputDto,
  ShellCallDto,
  ShellCallOutputDto,
  ApplyPatchCallDto,
  ApplyPatchCallOutputDto,
  McpListToolsDto,
  McpApprovalRequestDto,
  McpApprovalResponseDto,
  McpCallDto,
  ResponseCustomToolCallOutputDto,
  ResponseCustomToolCallDto,
  ItemReferenceDto,
  _Inline_0Dto,
  ResponseFunctionToolCallOutputItemDto,
  ResponseComputerToolCallOutputItemDto,
  ResponseToolSearchCallDto,
  ResponseToolSearchOutputItemDto,
  ResponseCompactionItemDto,
  ResponseFunctionShellToolCallDto,
  ResponseFunctionShellToolCallOutputDto,
  ResponseApplyPatchToolCallDto,
  ResponseApplyPatchToolCallOutputDto,
  ResponseCustomToolCallOutputItemDto,
  ToolChoiceAllowedDto,
  ToolChoiceTypesDto,
  ToolChoiceFunctionDto,
  ToolChoiceMcpDto,
  ToolChoiceCustomDto,
  ToolChoiceApplyPatchDto,
  ToolChoiceShellDto,
  FunctionToolDto,
  FileSearchToolDto,
  ComputerToolDto,
  ComputerUsePreviewToolDto,
  WebSearchToolDto,
  McpDto,
  CodeInterpreterDto,
  ImageGenerationDto,
  LocalShellDto,
  FunctionShellToolDto,
  CustomToolDto,
  NamespaceToolDto,
  ToolSearchToolDto,
  WebSearchPreviewToolDto,
  ApplyPatchToolDto,
  ConversationDto,
  ResponsePromptDto,
  ReasoningDto,
)
export class ResponseDto {
  /** Unique identifier for this Response. */
  @ApiProperty({
    description: `Unique identifier for this Response.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** Unix timestamp (in seconds) of when this Response was created. */
  @ApiProperty({
    description: `Unix timestamp (in seconds) of when this Response was created.`,
    type: 'number',
  })
  @IsNumber()
  created_at!: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  output_text!: string;

  /** An error object returned when the model fails to generate a Response. */
  @ApiProperty({
    description: `An error object returned when the model fails to generate a Response.`,
    type: () => ResponseErrorDto,
  })
  error!: null | ResponseErrorDto;

  /** Details about why the response is incomplete. */
  @ApiProperty({
    description: `Details about why the response is incomplete.`,
    type: () => IncompleteDetailsDto,
  })
  incomplete_details!: null | IncompleteDetailsDto;

  /**
   * A system (or developer) message inserted into the model's context.
   * 
   * When using along with `previous_response_id`, the instructions from a previous
   * response will not be carried over to the next response. This makes it simple to
   * swap out system (or developer) messages in new responses.
   */
  @ApiProperty({
    description: `A system (or developer) message inserted into the model's context.
  
  When using along with \`previous_response_id\`, the instructions from a previous
  response will not be carried over to the next response. This makes it simple to
  swap out system (or developer) messages in new responses.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(EasyInputMessageDto) },
      { $ref: getSchemaPath(MessageDto) },
      { $ref: getSchemaPath(ResponseOutputMessageDto) },
      { $ref: getSchemaPath(ResponseFileSearchToolCallDto) },
      { $ref: getSchemaPath(ResponseComputerToolCallDto) },
      { $ref: getSchemaPath(ComputerCallOutputDto) },
      { $ref: getSchemaPath(ResponseFunctionWebSearchDto) },
      { $ref: getSchemaPath(ResponseFunctionToolCallDto) },
      { $ref: getSchemaPath(FunctionCallOutputDto) },
      { $ref: getSchemaPath(ToolSearchCallDto) },
      { $ref: getSchemaPath(ResponseToolSearchOutputItemParamDto) },
      { $ref: getSchemaPath(ResponseReasoningItemDto) },
      { $ref: getSchemaPath(ResponseCompactionItemParamDto) },
      { $ref: getSchemaPath(ImageGenerationCallDto) },
      { $ref: getSchemaPath(ResponseCodeInterpreterToolCallDto) },
      { $ref: getSchemaPath(LocalShellCallDto) },
      { $ref: getSchemaPath(LocalShellCallOutputDto) },
      { $ref: getSchemaPath(ShellCallDto) },
      { $ref: getSchemaPath(ShellCallOutputDto) },
      { $ref: getSchemaPath(ApplyPatchCallDto) },
      { $ref: getSchemaPath(ApplyPatchCallOutputDto) },
      { $ref: getSchemaPath(McpListToolsDto) },
      { $ref: getSchemaPath(McpApprovalRequestDto) },
      { $ref: getSchemaPath(McpApprovalResponseDto) },
      { $ref: getSchemaPath(McpCallDto) },
      { $ref: getSchemaPath(ResponseCustomToolCallOutputDto) },
      { $ref: getSchemaPath(ResponseCustomToolCallDto) },
      { $ref: getSchemaPath(ItemReferenceDto) },
    ],
  })
  instructions!: null | string | (EasyInputMessageDto | MessageDto | ResponseOutputMessageDto | ResponseFileSearchToolCallDto | ResponseComputerToolCallDto | ComputerCallOutputDto | ResponseFunctionWebSearchDto | ResponseFunctionToolCallDto | FunctionCallOutputDto | ToolSearchCallDto | ResponseToolSearchOutputItemParamDto | ResponseReasoningItemDto | ResponseCompactionItemParamDto | ImageGenerationCallDto | ResponseCodeInterpreterToolCallDto | LocalShellCallDto | LocalShellCallOutputDto | ShellCallDto | ShellCallOutputDto | ApplyPatchCallDto | ApplyPatchCallOutputDto | McpListToolsDto | McpApprovalRequestDto | McpApprovalResponseDto | McpCallDto | ResponseCustomToolCallOutputDto | ResponseCustomToolCallDto | ItemReferenceDto)[];

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard.
   * 
   * Keys are strings with a maximum length of 64 characters. Values are strings with
   * a maximum length of 512 characters.
   */
  @ApiProperty({ description: `Set of 16 key-value pairs that can be attached to an object. This can be useful
  for storing additional information about the object in a structured format, and
  querying for objects via API or the dashboard.
  
  Keys are strings with a maximum length of 64 characters. Values are strings with
  a maximum length of 512 characters.` })
  metadata!: null | any;

  /**
   * Model ID used to generate the response, like `gpt-4o` or `o3`. OpenAI offers a
   * wide range of models with different capabilities, performance characteristics,
   * and price points. Refer to the
   * [model guide](https://platform.openai.com/docs/models) to browse and compare
   * available models.
   */
  @ApiProperty({
    description: `Model ID used to generate the response, like \`gpt-4o\` or \`o3\`. OpenAI offers a
  wide range of models with different capabilities, performance characteristics,
  and price points. Refer to the
  [model guide](https://platform.openai.com/docs/models) to browse and compare
  available models.`,
    oneOf: [
      { $ref: getSchemaPath(_Inline_0Dto) },
      { type: 'string' },
    ],
  })
  model!: _Inline_0Dto | 'gpt-5.4' | 'gpt-5.4-mini' | 'gpt-5.4-nano' | 'gpt-5.4-mini-2026-03-17' | 'gpt-5.4-nano-2026-03-17' | 'gpt-5.3-chat-latest' | 'gpt-5.2' | 'gpt-5.2-2025-12-11' | 'gpt-5.2-chat-latest' | 'gpt-5.2-pro' | 'gpt-5.2-pro-2025-12-11' | 'gpt-5.1' | 'gpt-5.1-2025-11-13' | 'gpt-5.1-codex' | 'gpt-5.1-mini' | 'gpt-5.1-chat-latest' | 'gpt-5' | 'gpt-5-mini' | 'gpt-5-nano' | 'gpt-5-2025-08-07' | 'gpt-5-mini-2025-08-07' | 'gpt-5-nano-2025-08-07' | 'gpt-5-chat-latest' | 'gpt-4.1' | 'gpt-4.1-mini' | 'gpt-4.1-nano' | 'gpt-4.1-2025-04-14' | 'gpt-4.1-mini-2025-04-14' | 'gpt-4.1-nano-2025-04-14' | 'o4-mini' | 'o4-mini-2025-04-16' | 'o3' | 'o3-2025-04-16' | 'o3-mini' | 'o3-mini-2025-01-31' | 'o1' | 'o1-2024-12-17' | 'o1-preview' | 'o1-preview-2024-09-12' | 'o1-mini' | 'o1-mini-2024-09-12' | 'gpt-4o' | 'gpt-4o-2024-11-20' | 'gpt-4o-2024-08-06' | 'gpt-4o-2024-05-13' | 'gpt-4o-audio-preview' | 'gpt-4o-audio-preview-2024-10-01' | 'gpt-4o-audio-preview-2024-12-17' | 'gpt-4o-audio-preview-2025-06-03' | 'gpt-4o-mini-audio-preview' | 'gpt-4o-mini-audio-preview-2024-12-17' | 'gpt-4o-search-preview' | 'gpt-4o-mini-search-preview' | 'gpt-4o-search-preview-2025-03-11' | 'gpt-4o-mini-search-preview-2025-03-11' | 'chatgpt-4o-latest' | 'codex-mini-latest' | 'gpt-4o-mini' | 'gpt-4o-mini-2024-07-18' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-0125-preview' | 'gpt-4-turbo-preview' | 'gpt-4-1106-preview' | 'gpt-4-vision-preview' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-0613' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo-16k-0613' | 'o1-pro' | 'o1-pro-2025-03-19' | 'o3-pro' | 'o3-pro-2025-06-10' | 'o3-deep-research' | 'o3-deep-research-2025-06-26' | 'o4-mini-deep-research' | 'o4-mini-deep-research-2025-06-26' | 'computer-use-preview' | 'computer-use-preview-2025-03-11' | 'gpt-5-codex' | 'gpt-5-pro' | 'gpt-5-pro-2025-10-06' | 'gpt-5.1-codex-max';

  /** The object type of this resource - always set to `response`. */
  @ApiProperty({
    description: `The object type of this resource - always set to \`response\`.`,
    type: 'string',
    enum: ['response'],
  })
  @Equals('response')
  object!: 'response';

  /**
   * An array of content items generated by the model.
   * 
   * - The length and order of items in the `output` array is dependent on the
   *   model's response.
   * - Rather than accessing the first item in the `output` array and assuming it's
   *   an `assistant` message with the content generated by the model, you might
   *   consider using the `output_text` property where supported in SDKs.
   */
  @ApiProperty({
    description: `An array of content items generated by the model.
  
  - The length and order of items in the \`output\` array is dependent on the
    model's response.
  - Rather than accessing the first item in the \`output\` array and assuming it's
    an \`assistant\` message with the content generated by the model, you might
    consider using the \`output_text\` property where supported in SDKs.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(ResponseOutputMessageDto) },
      { $ref: getSchemaPath(ResponseFileSearchToolCallDto) },
      { $ref: getSchemaPath(ResponseComputerToolCallDto) },
      { $ref: getSchemaPath(ResponseFunctionWebSearchDto) },
      { $ref: getSchemaPath(ResponseFunctionToolCallDto) },
      { $ref: getSchemaPath(ResponseReasoningItemDto) },
      { $ref: getSchemaPath(ResponseCodeInterpreterToolCallDto) },
      { $ref: getSchemaPath(ResponseCustomToolCallDto) },
      { $ref: getSchemaPath(ResponseFunctionToolCallOutputItemDto) },
      { $ref: getSchemaPath(ResponseComputerToolCallOutputItemDto) },
      { $ref: getSchemaPath(ResponseToolSearchCallDto) },
      { $ref: getSchemaPath(ResponseToolSearchOutputItemDto) },
      { $ref: getSchemaPath(ResponseCompactionItemDto) },
      { $ref: getSchemaPath(ImageGenerationCallDto) },
      { $ref: getSchemaPath(LocalShellCallDto) },
      { $ref: getSchemaPath(LocalShellCallOutputDto) },
      { $ref: getSchemaPath(ResponseFunctionShellToolCallDto) },
      { $ref: getSchemaPath(ResponseFunctionShellToolCallOutputDto) },
      { $ref: getSchemaPath(ResponseApplyPatchToolCallDto) },
      { $ref: getSchemaPath(ResponseApplyPatchToolCallOutputDto) },
      { $ref: getSchemaPath(McpCallDto) },
      { $ref: getSchemaPath(McpListToolsDto) },
      { $ref: getSchemaPath(McpApprovalRequestDto) },
      { $ref: getSchemaPath(McpApprovalResponseDto) },
      { $ref: getSchemaPath(ResponseCustomToolCallOutputItemDto) },
    ],
  })
  @IsArray()
  output!: (ResponseOutputMessageDto | ResponseFileSearchToolCallDto | ResponseComputerToolCallDto | ResponseFunctionWebSearchDto | ResponseFunctionToolCallDto | ResponseReasoningItemDto | ResponseCodeInterpreterToolCallDto | ResponseCustomToolCallDto | ResponseFunctionToolCallOutputItemDto | ResponseComputerToolCallOutputItemDto | ResponseToolSearchCallDto | ResponseToolSearchOutputItemDto | ResponseCompactionItemDto | ImageGenerationCallDto | LocalShellCallDto | LocalShellCallOutputDto | ResponseFunctionShellToolCallDto | ResponseFunctionShellToolCallOutputDto | ResponseApplyPatchToolCallDto | ResponseApplyPatchToolCallOutputDto | McpCallDto | McpListToolsDto | McpApprovalRequestDto | McpApprovalResponseDto | ResponseCustomToolCallOutputItemDto)[];

  /** Whether to allow the model to run tool calls in parallel. */
  @ApiProperty({
    description: `Whether to allow the model to run tool calls in parallel.`,
    type: 'boolean',
  })
  @IsBoolean()
  parallel_tool_calls!: boolean;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic. We generally recommend altering this or `top_p` but
   * not both.
   */
  @ApiProperty({
    description: `What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
  make the output more random, while lower values like 0.2 will make it more
  focused and deterministic. We generally recommend altering this or \`top_p\` but
  not both.`,
    type: 'number',
  })
  temperature!: null | number;

  /**
   * How the model should select which tool (or tools) to use when generating a
   * response. See the `tools` parameter to see how to specify which tools the model
   * can call.
   */
  @ApiProperty({
    description: `How the model should select which tool (or tools) to use when generating a
  response. See the \`tools\` parameter to see how to specify which tools the model
  can call.`,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ToolChoiceAllowedDto) },
      { $ref: getSchemaPath(ToolChoiceTypesDto) },
      { $ref: getSchemaPath(ToolChoiceFunctionDto) },
      { $ref: getSchemaPath(ToolChoiceMcpDto) },
      { $ref: getSchemaPath(ToolChoiceCustomDto) },
      { $ref: getSchemaPath(ToolChoiceApplyPatchDto) },
      { $ref: getSchemaPath(ToolChoiceShellDto) },
    ],
  })
  tool_choice!: 'auto' | 'none' | 'required' | ToolChoiceAllowedDto | ToolChoiceTypesDto | ToolChoiceFunctionDto | ToolChoiceMcpDto | ToolChoiceCustomDto | ToolChoiceApplyPatchDto | ToolChoiceShellDto;

  /**
   * An array of tools the model may call while generating a response. You can
   * specify which tool to use by setting the `tool_choice` parameter.
   * 
   * We support the following categories of tools:
   * 
   * - **Built-in tools**: Tools that are provided by OpenAI that extend the model's
   *   capabilities, like
   *   [web search](https://platform.openai.com/docs/guides/tools-web-search) or
   *   [file search](https://platform.openai.com/docs/guides/tools-file-search).
   *   Learn more about
   *   [built-in tools](https://platform.openai.com/docs/guides/tools).
   * - **MCP Tools**: Integrations with third-party systems via custom MCP servers or
   *   predefined connectors such as Google Drive and SharePoint. Learn more about
   *   [MCP Tools](https://platform.openai.com/docs/guides/tools-connectors-mcp).
   * - **Function calls (custom tools)**: Functions that are defined by you, enabling
   *   the model to call your own code with strongly typed arguments and outputs.
   *   Learn more about
   *   [function calling](https://platform.openai.com/docs/guides/function-calling).
   *   You can also use custom tools to call your own code.
   */
  @ApiProperty({
    description: `An array of tools the model may call while generating a response. You can
  specify which tool to use by setting the \`tool_choice\` parameter.
  
  We support the following categories of tools:
  
  - **Built-in tools**: Tools that are provided by OpenAI that extend the model's
    capabilities, like
    [web search](https://platform.openai.com/docs/guides/tools-web-search) or
    [file search](https://platform.openai.com/docs/guides/tools-file-search).
    Learn more about
    [built-in tools](https://platform.openai.com/docs/guides/tools).
  - **MCP Tools**: Integrations with third-party systems via custom MCP servers or
    predefined connectors such as Google Drive and SharePoint. Learn more about
    [MCP Tools](https://platform.openai.com/docs/guides/tools-connectors-mcp).
  - **Function calls (custom tools)**: Functions that are defined by you, enabling
    the model to call your own code with strongly typed arguments and outputs.
    Learn more about
    [function calling](https://platform.openai.com/docs/guides/function-calling).
    You can also use custom tools to call your own code.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(FunctionToolDto) },
      { $ref: getSchemaPath(FileSearchToolDto) },
      { $ref: getSchemaPath(ComputerToolDto) },
      { $ref: getSchemaPath(ComputerUsePreviewToolDto) },
      { $ref: getSchemaPath(WebSearchToolDto) },
      { $ref: getSchemaPath(McpDto) },
      { $ref: getSchemaPath(CodeInterpreterDto) },
      { $ref: getSchemaPath(ImageGenerationDto) },
      { $ref: getSchemaPath(LocalShellDto) },
      { $ref: getSchemaPath(FunctionShellToolDto) },
      { $ref: getSchemaPath(CustomToolDto) },
      { $ref: getSchemaPath(NamespaceToolDto) },
      { $ref: getSchemaPath(ToolSearchToolDto) },
      { $ref: getSchemaPath(WebSearchPreviewToolDto) },
      { $ref: getSchemaPath(ApplyPatchToolDto) },
    ],
  })
  @IsArray()
  tools!: (FunctionToolDto | FileSearchToolDto | ComputerToolDto | ComputerUsePreviewToolDto | WebSearchToolDto | McpDto | CodeInterpreterDto | ImageGenerationDto | LocalShellDto | FunctionShellToolDto | CustomToolDto | NamespaceToolDto | ToolSearchToolDto | WebSearchPreviewToolDto | ApplyPatchToolDto)[];

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered.
   * 
   * We generally recommend altering this or `temperature` but not both.
   */
  @ApiProperty({
    description: `An alternative to sampling with temperature, called nucleus sampling, where the
  model considers the results of the tokens with top_p probability mass. So 0.1
  means only the tokens comprising the top 10% probability mass are considered.
  
  We generally recommend altering this or \`temperature\` but not both.`,
    type: 'number',
  })
  top_p!: null | number;

  /**
   * Whether to run the model response in the background.
   * [Learn more](https://platform.openai.com/docs/guides/background).
   */
  @ApiProperty({
    required: false,
    description: `Whether to run the model response in the background.
  [Learn more](https://platform.openai.com/docs/guides/background).`,
  })
  @IsOptional()
  background?: null | false | true;

  /**
   * Unix timestamp (in seconds) of when this Response was completed. Only present
   * when the status is `completed`.
   */
  @ApiProperty({
    required: false,
    description: `Unix timestamp (in seconds) of when this Response was completed. Only present
  when the status is \`completed\`.`,
    type: 'number',
  })
  @IsOptional()
  completed_at?: null | number;

  /**
   * The conversation that this response belonged to. Input items and output items
   * from this response were automatically added to this conversation.
   */
  @ApiProperty({
    required: false,
    description: `The conversation that this response belonged to. Input items and output items
  from this response were automatically added to this conversation.`,
    type: () => ConversationDto,
  })
  @IsOptional()
  conversation?: null | ConversationDto;

  /**
   * An upper bound for the number of tokens that can be generated for a response,
   * including visible output tokens and
   * [reasoning tokens](https://platform.openai.com/docs/guides/reasoning).
   */
  @ApiProperty({
    required: false,
    description: `An upper bound for the number of tokens that can be generated for a response,
  including visible output tokens and
  [reasoning tokens](https://platform.openai.com/docs/guides/reasoning).`,
    type: 'number',
  })
  @IsOptional()
  max_output_tokens?: null | number;

  /**
   * The unique ID of the previous response to the model. Use this to create
   * multi-turn conversations. Learn more about
   * [conversation state](https://platform.openai.com/docs/guides/conversation-state).
   * Cannot be used in conjunction with `conversation`.
   */
  @ApiProperty({
    required: false,
    description: `The unique ID of the previous response to the model. Use this to create
  multi-turn conversations. Learn more about
  [conversation state](https://platform.openai.com/docs/guides/conversation-state).
  Cannot be used in conjunction with \`conversation\`.`,
    type: 'string',
  })
  @IsOptional()
  previous_response_id?: null | string;

  /**
   * Reference to a prompt template and its variables.
   * [Learn more](https://platform.openai.com/docs/guides/text?api-mode=responses#reusable-prompts).
   */
  @ApiProperty({
    required: false,
    description: `Reference to a prompt template and its variables.
  [Learn more](https://platform.openai.com/docs/guides/text?api-mode=responses#reusable-prompts).`,
    type: () => ResponsePromptDto,
  })
  @IsOptional()
  prompt?: null | ResponsePromptDto;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache
   * hit rates. Replaces the `user` field.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching).
   */
  @ApiProperty({
    required: false,
    description: `Used by OpenAI to cache responses for similar requests to optimize your cache
  hit rates. Replaces the \`user\` field.
  [Learn more](https://platform.openai.com/docs/guides/prompt-caching).`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  prompt_cache_key?: string;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended
   * prompt caching, which keeps cached prefixes active for longer, up to a maximum
   * of 24 hours.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).
   */
  @ApiProperty({
    required: false,
    description: `The retention policy for the prompt cache. Set to \`24h\` to enable extended
  prompt caching, which keeps cached prefixes active for longer, up to a maximum
  of 24 hours.
  [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).`,
    enum: ['in-memory', '24h'],
  })
  @IsOptional()
  @IsIn(['in-memory', '24h'])
  prompt_cache_retention?: null | 'in-memory' | '24h';

  /**
   * **gpt-5 and o-series models only**
   * 
   * Configuration options for
   * [reasoning models](https://platform.openai.com/docs/guides/reasoning).
   */
  @ApiProperty({
    required: false,
    description: `**gpt-5 and o-series models only**
  
  Configuration options for
  [reasoning models](https://platform.openai.com/docs/guides/reasoning).`,
    type: () => ReasoningDto,
  })
  @IsOptional()
  reasoning?: null | ReasoningDto;

  /**
   * A stable identifier used to help detect users of your application that may be
   * violating OpenAI's usage policies. The IDs should be a string that uniquely
   * identifies each user, with a maximum length of 64 characters. We recommend
   * hashing their username or email address, in order to avoid sending us any
   * identifying information.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  @ApiProperty({
    required: false,
    description: `A stable identifier used to help detect users of your application that may be
  violating OpenAI's usage policies. The IDs should be a string that uniquely
  identifies each user, with a maximum length of 64 characters. We recommend
  hashing their username or email address, in order to avoid sending us any
  identifying information.
  [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  safety_identifier?: string;

  /**
   * Specifies the latency tier to use for processing the request. This parameter is
   * relevant for customers subscribed to the scale tier service:
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
   * When this parameter is set, the response body will include the `service_tier`
   * utilized.
   */
  @ApiProperty({
    required: false,
    description: `Specifies the latency tier to use for processing the request. This parameter is
  relevant for customers subscribed to the scale tier service:
  
  - If set to 'auto', then the request will be processed with the service tier
    configured in the Project settings. Unless otherwise configured, the Project
    will use 'default'.
  - If set to 'default', then the request will be processed with the standard
    pricing and performance for the selected model.
  - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
    '[priority](https://openai.com/api-priority-processing/)', then the request
    will be processed with the corresponding service tier.
  - When not set, the default behavior is 'auto'.
  
  When this parameter is set, the response body will include the \`service_tier\`
  utilized.`,
    enum: ['auto', 'default', 'flex', 'scale', 'priority'],
  })
  @IsOptional()
  @IsIn(['auto', 'default', 'flex', 'scale', 'priority'])
  service_tier?: null | 'auto' | 'default' | 'flex' | 'scale' | 'priority';

  /**
   * The status of the response generation. One of `completed`, `failed`,
   * `in_progress`, `cancelled`, `queued`, or `incomplete`.
   */
  @ApiProperty({
    required: false,
    description: `The status of the response generation. One of \`completed\`, \`failed\`,
  \`in_progress\`, \`cancelled\`, \`queued\`, or \`incomplete\`.`,
    enum: ['in_progress', 'completed', 'incomplete', 'failed', 'cancelled', 'queued'],
  })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'incomplete', 'failed', 'cancelled', 'queued'])
  status?: 'in_progress' | 'completed' | 'incomplete' | 'failed' | 'cancelled' | 'queued';

  /**
   * Configuration options for a text response from the model. Can be plain text or
   * structured JSON data. Learn more:
   * 
   * - [Text inputs and outputs](https://platform.openai.com/docs/guides/text)
   * - [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
   */
  @ApiProperty({
    required: false,
    description: `Configuration options for a text response from the model. Can be plain text or
  structured JSON data. Learn more:
  
  - [Text inputs and outputs](https://platform.openai.com/docs/guides/text)
  - [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)`,
    type: () => ResponseTextConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResponseTextConfigDto)
  text?: ResponseTextConfigDto;

  /**
   * The truncation strategy to use for the model response.
   * 
   * - `auto`: If the input to this Response exceeds the model's context window size,
   *   the model will truncate the response to fit the context window by dropping
   *   items from the beginning of the conversation.
   * - `disabled` (default): If the input size will exceed the context window size
   *   for a model, the request will fail with a 400 error.
   */
  @ApiProperty({
    required: false,
    description: `The truncation strategy to use for the model response.
  
  - \`auto\`: If the input to this Response exceeds the model's context window size,
    the model will truncate the response to fit the context window by dropping
    items from the beginning of the conversation.
  - \`disabled\` (default): If the input size will exceed the context window size
    for a model, the request will fail with a 400 error.`,
    enum: ['auto', 'disabled'],
  })
  @IsOptional()
  @IsIn(['auto', 'disabled'])
  truncation?: null | 'auto' | 'disabled';

  /**
   * Represents token usage details including input tokens, output tokens, a
   * breakdown of output tokens, and the total tokens used.
   */
  @ApiProperty({
    required: false,
    description: `Represents token usage details including input tokens, output tokens, a
  breakdown of output tokens, and the total tokens used.`,
    type: () => ResponseUsageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResponseUsageDto)
  usage?: ResponseUsageDto;

  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  user?: string;
}
