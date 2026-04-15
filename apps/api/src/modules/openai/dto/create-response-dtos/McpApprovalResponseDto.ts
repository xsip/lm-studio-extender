import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsBoolean, IsOptional, IsString } from 'class-validator';

export class McpApprovalResponseDto {
  /** The ID of the approval request being answered. */
  @ApiProperty({
    description: `The ID of the approval request being answered.`,
    type: 'string',
  })
  @IsString()
  approval_request_id!: string;

  /** Whether the request was approved. */
  @ApiProperty({
    description: `Whether the request was approved.`,
    type: 'boolean',
  })
  @IsBoolean()
  approve!: boolean;

  /** The type of the item. Always `mcp_approval_response`. */
  @ApiProperty({
    description: `The type of the item. Always \`mcp_approval_response\`.`,
    example: 'mcp_approval_response',
  })
  @Equals('mcp_approval_response')
  type!: 'mcp_approval_response';

  /** The unique ID of the approval response */
  @ApiProperty({
    required: false,
    description: `The unique ID of the approval response`,
    type: 'string',
  })
  @IsOptional()
  id?: null | string;

  /** Optional reason for the decision. */
  @ApiProperty({
    required: false,
    description: `Optional reason for the decision.`,
    type: 'string',
  })
  @IsOptional()
  reason?: null | string;
}
