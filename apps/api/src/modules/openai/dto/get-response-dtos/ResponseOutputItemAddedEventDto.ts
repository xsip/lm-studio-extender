import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsNumber } from 'class-validator';

import { ResponseOutputMessageDto } from './ResponseOutputMessageDto';
import { ResponseFileSearchToolCallDto } from './ResponseFileSearchToolCallDto';
import { ResponseComputerToolCallDto } from './ResponseComputerToolCallDto';
import { ResponseFunctionWebSearchDto } from './ResponseFunctionWebSearchDto';
import { ResponseFunctionToolCallDto } from './ResponseFunctionToolCallDto';
import { ResponseReasoningItemDto } from './ResponseReasoningItemDto';
import { ResponseCodeInterpreterToolCallDto } from './ResponseCodeInterpreterToolCallDto';
import { ResponseCustomToolCallDto } from './ResponseCustomToolCallDto';
import { ResponseFunctionToolCallOutputItemDto } from './ResponseFunctionToolCallOutputItemDto';
import { ResponseComputerToolCallOutputItemDto } from './ResponseComputerToolCallOutputItemDto';
import { ResponseToolSearchCallDto } from './ResponseToolSearchCallDto';
import { ResponseToolSearchOutputItemDto } from './ResponseToolSearchOutputItemDto';
import { ResponseCompactionItemDto } from './ResponseCompactionItemDto';
import { ImageGenerationCallDto } from './ImageGenerationCallDto';
import { LocalShellCallDto } from './LocalShellCallDto';
import { LocalShellCallOutputDto } from './LocalShellCallOutputDto';
import { ResponseFunctionShellToolCallDto } from './ResponseFunctionShellToolCallDto';
import { ResponseFunctionShellToolCallOutputDto } from './ResponseFunctionShellToolCallOutputDto';
import { ResponseApplyPatchToolCallDto } from './ResponseApplyPatchToolCallDto';
import { ResponseApplyPatchToolCallOutputDto } from './ResponseApplyPatchToolCallOutputDto';
import { McpCallDto } from './McpCallDto';
import { McpListToolsDto } from './McpListToolsDto';
import { McpApprovalRequestDto } from './McpApprovalRequestDto';
import { McpApprovalResponseDto } from './McpApprovalResponseDto';
import { ResponseCustomToolCallOutputItemDto } from './ResponseCustomToolCallOutputItemDto';

@ApiExtraModels(
  ResponseOutputMessageDto,
  ResponseFileSearchToolCallDto,
  ResponseComputerToolCallDto,
  ResponseFunctionWebSearchDto,
  ResponseFunctionToolCallDto,
  ResponseReasoningItemDto,
  ResponseCodeInterpreterToolCallDto,
  ResponseCustomToolCallDto,
  ResponseFunctionToolCallOutputItemDto,
  ResponseComputerToolCallOutputItemDto,
  ResponseToolSearchCallDto,
  ResponseToolSearchOutputItemDto,
  ResponseCompactionItemDto,
  ImageGenerationCallDto,
  LocalShellCallDto,
  LocalShellCallOutputDto,
  ResponseFunctionShellToolCallDto,
  ResponseFunctionShellToolCallOutputDto,
  ResponseApplyPatchToolCallDto,
  ResponseApplyPatchToolCallOutputDto,
  McpCallDto,
  McpListToolsDto,
  McpApprovalRequestDto,
  McpApprovalResponseDto,
  ResponseCustomToolCallOutputItemDto,
)
export class ResponseOutputItemAddedEventDto {
  /** The output item that was added. */
  @ApiProperty({
    description: `The output item that was added.`,
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
  item!: ResponseOutputMessageDto | ResponseFileSearchToolCallDto | ResponseComputerToolCallDto | ResponseFunctionWebSearchDto | ResponseFunctionToolCallDto | ResponseReasoningItemDto | ResponseCodeInterpreterToolCallDto | ResponseCustomToolCallDto | ResponseFunctionToolCallOutputItemDto | ResponseComputerToolCallOutputItemDto | ResponseToolSearchCallDto | ResponseToolSearchOutputItemDto | ResponseCompactionItemDto | ImageGenerationCallDto | LocalShellCallDto | LocalShellCallOutputDto | ResponseFunctionShellToolCallDto | ResponseFunctionShellToolCallOutputDto | ResponseApplyPatchToolCallDto | ResponseApplyPatchToolCallOutputDto | McpCallDto | McpListToolsDto | McpApprovalRequestDto | McpApprovalResponseDto | ResponseCustomToolCallOutputItemDto;

  /** The index of the output item that was added. */
  @ApiProperty({
    description: `The index of the output item that was added.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.output_item.added`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.output_item.added\`.`,
    type: 'string',
    enum: ['response.output_item.added'],
  })
  @Equals('response.output_item.added')
  type!: 'response.output_item.added';
}
