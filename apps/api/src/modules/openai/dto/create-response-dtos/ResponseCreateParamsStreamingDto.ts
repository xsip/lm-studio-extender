import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ContextManagementDto } from './ContextManagementDto';
import { ResponseConversationParamDto } from './ResponseConversationParamDto';
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
import { ResponsesModelDto } from './ResponsesModelDto';
import { ResponsePromptDto } from './ResponsePromptDto';
import { ReasoningDto } from './ReasoningDto';
import { StreamOptionsDto } from './StreamOptionsDto';
import { ResponseTextConfigDto } from './ResponseTextConfigDto';
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

export class ResponseCreateParamsStreamingDto {

  /** Whether to run the model response in the background.
[Learn more](https://platform.openai.com/docs/guides/background). */
  @ApiProperty({
    required: false,
    description: `Whether to run the model response in the background.
[Learn more](https://platform.openai.com/docs/guides/background).`,
  })
  @IsOptional()
  background?: null | false | true;

  /** Context management configuration for this request. */
  @ApiProperty({
    required: false,
    description: `Context management configuration for this request.`,
  })
  @IsOptional()
  context_management?: null | ContextManagementDto[];

  /** The conversation that this response belongs to. Items from this conversation are
prepended to `input_items` for this response request. Input items and output
items from this response are automatically added to this conversation after this
response completes. */
  @ApiProperty({
    required: false,
    description: `The conversation that this response belongs to. Items from this conversation are
prepended to \`input_items\` for this response request. Input items and output
items from this response are automatically added to this conversation after this
response completes.`,
  })
  @IsOptional()
  conversation?: null | string | ResponseConversationParamDto;

  /** Specify additional output data to include in the model response. Currently
supported values are:

- `web_search_call.action.sources`: Include the sources of the web search tool
  call.
- `code_interpreter_call.outputs`: Includes the outputs of python code execution
  in code interpreter tool call items.
- `computer_call_output.output.image_url`: Include image urls from the computer
  call output.
- `file_search_call.results`: Include the search results of the file search tool
  call.
- `message.input_image.image_url`: Include image urls from the input message.
- `computer_call_output.output.image_url`: Include image urls from the computer
  call output.
- `reasoning.encrypted_content`: Includes an encrypted version of reasoning
  tokens in reasoning item outputs. This enables reasoning items to be used in
  multi-turn conversations when using the Responses API statelessly (like when
  the `store` parameter is set to `false`, or when an organization is enrolled
  in the zero data retention program).
- `code_interpreter_call.outputs`: Includes the outputs of python code execution
  in code interpreter tool call items. */
  @ApiProperty({
    required: false,
    description: `Specify additional output data to include in the model response. Currently
supported values are:

- \`web_search_call.action.sources\`: Include the sources of the web search tool
  call.
- \`code_interpreter_call.outputs\`: Includes the outputs of python code execution
  in code interpreter tool call items.
- \`computer_call_output.output.image_url\`: Include image urls from the computer
  call output.
- \`file_search_call.results\`: Include the search results of the file search tool
  call.
- \`message.input_image.image_url\`: Include image urls from the input message.
- \`computer_call_output.output.image_url\`: Include image urls from the computer
  call output.
- \`reasoning.encrypted_content\`: Includes an encrypted version of reasoning
  tokens in reasoning item outputs. This enables reasoning items to be used in
  multi-turn conversations when using the Responses API statelessly (like when
  the \`store\` parameter is set to \`false\`, or when an organization is enrolled
  in the zero data retention program).
- \`code_interpreter_call.outputs\`: Includes the outputs of python code execution
  in code interpreter tool call items.`,
  })
  @IsOptional()
  include?:
    | null
    | 'file_search_call.results'
    | 'web_search_call.results'
    | 'web_search_call.action.sources'
    | 'message.input_image.image_url'
    | 'computer_call_output.output.image_url'
    | 'code_interpreter_call.outputs'
    | 'reasoning.encrypted_content'
    | 'message.output_text.logprobs'[];

  /** Text, image, or file inputs to the model, used to generate a response.

Learn more:

- [Text inputs and outputs](https://platform.openai.com/docs/guides/text)
- [Image inputs](https://platform.openai.com/docs/guides/images)
- [File inputs](https://platform.openai.com/docs/guides/pdf-files)
- [Conversation state](https://platform.openai.com/docs/guides/conversation-state)
- [Function calling](https://platform.openai.com/docs/guides/function-calling) */
  @ApiProperty({
    required: false,
    description: `Text, image, or file inputs to the model, used to generate a response.

Learn more:

- [Text inputs and outputs](https://platform.openai.com/docs/guides/text)
- [Image inputs](https://platform.openai.com/docs/guides/images)
- [File inputs](https://platform.openai.com/docs/guides/pdf-files)
- [Conversation state](https://platform.openai.com/docs/guides/conversation-state)
- [Function calling](https://platform.openai.com/docs/guides/function-calling)`,
  })
  @IsOptional()
  input?:
    | string
    | EasyInputMessageDto
    | MessageDto
    | ResponseOutputMessageDto
    | ResponseFileSearchToolCallDto
    | ResponseComputerToolCallDto
    | ComputerCallOutputDto
    | ResponseFunctionWebSearchDto
    | ResponseFunctionToolCallDto
    | FunctionCallOutputDto
    | ToolSearchCallDto
    | ResponseToolSearchOutputItemParamDto
    | ResponseReasoningItemDto
    | ResponseCompactionItemParamDto
    | ImageGenerationCallDto
    | ResponseCodeInterpreterToolCallDto
    | LocalShellCallDto
    | LocalShellCallOutputDto
    | ShellCallDto
    | ShellCallOutputDto
    | ApplyPatchCallDto
    | ApplyPatchCallOutputDto
    | McpListToolsDto
    | McpApprovalRequestDto
    | McpApprovalResponseDto
    | McpCallDto
    | ResponseCustomToolCallOutputDto
    | ResponseCustomToolCallDto
    | ItemReferenceDto[];

  /** A system (or developer) message inserted into the model's context.

When using along with `previous_response_id`, the instructions from a previous
response will not be carried over to the next response. This makes it simple to
swap out system (or developer) messages in new responses. */
  @ApiProperty({
    required: false,
    description: `A system (or developer) message inserted into the model's context.

When using along with \`previous_response_id\`, the instructions from a previous
response will not be carried over to the next response. This makes it simple to
swap out system (or developer) messages in new responses.`,
  })
  @IsOptional()
  instructions?: null | string;

  /** An upper bound for the number of tokens that can be generated for a response,
including visible output tokens and
[reasoning tokens](https://platform.openai.com/docs/guides/reasoning). */
  @ApiProperty({
    required: false,
    description: `An upper bound for the number of tokens that can be generated for a response,
including visible output tokens and
[reasoning tokens](https://platform.openai.com/docs/guides/reasoning).`,
  })
  @IsOptional()
  max_output_tokens?: null | number;

  /** Set of 16 key-value pairs that can be attached to an object. This can be useful
for storing additional information about the object in a structured format, and
querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with
a maximum length of 512 characters. */
  @ApiProperty({
    required: false,
    description: `Set of 16 key-value pairs that can be attached to an object. This can be useful
for storing additional information about the object in a structured format, and
querying for objects via API or the dashboard.

Keys are strings with a maximum length of 64 characters. Values are strings with
a maximum length of 512 characters.`,
  })
  @IsOptional()
  metadata?: null | any;

  /** Model ID used to generate the response, like `gpt-4o` or `o3`. OpenAI offers a
wide range of models with different capabilities, performance characteristics,
and price points. Refer to the
[model guide](https://platform.openai.com/docs/models) to browse and compare
available models. */
  @ApiProperty({
    required: false,
    description: `Model ID used to generate the response, like \`gpt-4o\` or \`o3\`. OpenAI offers a
wide range of models with different capabilities, performance characteristics,
and price points. Refer to the
[model guide](https://platform.openai.com/docs/models) to browse and compare
available models.`,
    type: () => ResponsesModelDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => String)
  model?: string;

  /** Whether to allow the model to run tool calls in parallel. */
  @ApiProperty({
    required: false,
    description: `Whether to allow the model to run tool calls in parallel.`,
  })
  @IsOptional()
  parallel_tool_calls?: null | false | true;

  /** The unique ID of the previous response to the model. Use this to create
multi-turn conversations. Learn more about
[conversation state](https://platform.openai.com/docs/guides/conversation-state).
Cannot be used in conjunction with `conversation`. */
  @ApiProperty({
    required: false,
    description: `The unique ID of the previous response to the model. Use this to create
multi-turn conversations. Learn more about
[conversation state](https://platform.openai.com/docs/guides/conversation-state).
Cannot be used in conjunction with \`conversation\`.`,
  })
  @IsOptional()
  previous_response_id?: null | string;

  /** Reference to a prompt template and its variables.
[Learn more](https://platform.openai.com/docs/guides/text?api-mode=responses#reusable-prompts). */
  @ApiProperty({
    required: false,
    description: `Reference to a prompt template and its variables.
[Learn more](https://platform.openai.com/docs/guides/text?api-mode=responses#reusable-prompts).`,
  })
  @IsOptional()
  prompt?: null | ResponsePromptDto;

  /** Used by OpenAI to cache responses for similar requests to optimize your cache
hit rates. Replaces the `user` field.
[Learn more](https://platform.openai.com/docs/guides/prompt-caching). */
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

  /** The retention policy for the prompt cache. Set to `24h` to enable extended
prompt caching, which keeps cached prefixes active for longer, up to a maximum
of 24 hours.
[Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention). */
  @ApiProperty({
    required: false,
    description: `The retention policy for the prompt cache. Set to \`24h\` to enable extended
prompt caching, which keeps cached prefixes active for longer, up to a maximum
of 24 hours.
[Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).`,
  })
  @IsOptional()
  prompt_cache_retention?: null | 'in-memory' | '24h';

  /** **gpt-5 and o-series models only**

Configuration options for
[reasoning models](https://platform.openai.com/docs/guides/reasoning). */
  @ApiProperty({
    required: false,
    description: `**gpt-5 and o-series models only**

Configuration options for
[reasoning models](https://platform.openai.com/docs/guides/reasoning).`,
  })
  @IsOptional()
  reasoning?: null | ReasoningDto;

  /** A stable identifier used to help detect users of your application that may be
violating OpenAI's usage policies. The IDs should be a string that uniquely
identifies each user, with a maximum length of 64 characters. We recommend
hashing their username or email address, in order to avoid sending us any
identifying information.
[Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers). */
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

  /** Specifies the latency tier to use for processing the request. This parameter is
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

When this parameter is set, the response body will include the `service_tier`
utilized. */
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
  })
  @IsOptional()
  service_tier?: null | 'auto' | 'default' | 'flex' | 'scale' | 'priority';

  /** Whether to store the generated model response for later retrieval via API. */
  @ApiProperty({
    required: false,
    description: `Whether to store the generated model response for later retrieval via API.`,
  })
  @IsOptional()
  store?: null | false | true;

  /** If set to true, the model response data will be streamed to the client as it is
generated using
[server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
See the
[Streaming section below](https://platform.openai.com/docs/api-reference/responses-streaming)
for more information. */
  @ApiProperty({
    required: false,
    description: `If set to true, the model response data will be streamed to the client as it is
generated using
[server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
See the
[Streaming section below](https://platform.openai.com/docs/api-reference/responses-streaming)
for more information.`,
  })
  @IsOptional()
  stream?: null | false | true;

  /** Options for streaming responses. Only set this when you set `stream: true`. */
  @ApiProperty({
    required: false,
    description: `Options for streaming responses. Only set this when you set \`stream: true\`.`,
  })
  @IsOptional()
  stream_options?: null | StreamOptionsDto;

  /** What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
make the output more random, while lower values like 0.2 will make it more
focused and deterministic. We generally recommend altering this or `top_p` but
not both. */
  @ApiProperty({
    required: false,
    description: `What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
make the output more random, while lower values like 0.2 will make it more
focused and deterministic. We generally recommend altering this or \`top_p\` but
not both.`,
  })
  @IsOptional()
  temperature?: null | number;

  /** Configuration options for a text response from the model. Can be plain text or
structured JSON data. Learn more:

- [Text inputs and outputs](https://platform.openai.com/docs/guides/text)
- [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) */
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

  /** How the model should select which tool (or tools) to use when generating a
response. See the `tools` parameter to see how to specify which tools the model
can call. */
  @ApiProperty({
    required: false,
    description: `How the model should select which tool (or tools) to use when generating a
response. See the \`tools\` parameter to see how to specify which tools the model
can call.`,
  })
  @IsOptional()
  tool_choice?:
    | 'auto'
    | 'none'
    | 'required'
    | ToolChoiceAllowedDto
    | ToolChoiceTypesDto
    | ToolChoiceFunctionDto
    | ToolChoiceMcpDto
    | ToolChoiceCustomDto
    | ToolChoiceApplyPatchDto
    | ToolChoiceShellDto;

  /** An array of tools the model may call while generating a response. You can
specify which tool to use by setting the `tool_choice` parameter.

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
  You can also use custom tools to call your own code. */
  @ApiProperty({
    required: false,
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
  })
  @IsOptional()
  @IsArray()
  tools?:
    | FunctionToolDto
    | FileSearchToolDto
    | ComputerToolDto
    | ComputerUsePreviewToolDto
    | WebSearchToolDto
    | McpDto
    | CodeInterpreterDto
    | ImageGenerationDto
    | LocalShellDto
    | FunctionShellToolDto
    | CustomToolDto
    | NamespaceToolDto
    | ToolSearchToolDto
    | WebSearchPreviewToolDto
    | ApplyPatchToolDto[];

  /** An alternative to sampling with temperature, called nucleus sampling, where the
model considers the results of the tokens with top_p probability mass. So 0.1
means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or `temperature` but not both. */
  @ApiProperty({
    required: false,
    description: `An alternative to sampling with temperature, called nucleus sampling, where the
model considers the results of the tokens with top_p probability mass. So 0.1
means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or \`temperature\` but not both.`,
  })
  @IsOptional()
  top_p?: null | number;

  /** The truncation strategy to use for the model response.

- `auto`: If the input to this Response exceeds the model's context window size,
  the model will truncate the response to fit the context window by dropping
  items from the beginning of the conversation.
- `disabled` (default): If the input size will exceed the context window size
  for a model, the request will fail with a 400 error. */
  @ApiProperty({
    required: false,
    description: `The truncation strategy to use for the model response.

- \`auto\`: If the input to this Response exceeds the model's context window size,
  the model will truncate the response to fit the context window by dropping
  items from the beginning of the conversation.
- \`disabled\` (default): If the input size will exceed the context window size
  for a model, the request will fail with a 400 error.`,
  })
  @IsOptional()
  truncation?: null | 'auto' | 'disabled';

  @ApiProperty({ required: false, type: 'string' })
  @IsOptional()
  @IsString()
  user?: string;
}
