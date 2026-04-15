import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional, IsString } from 'class-validator';

import { ResponseOutputTextDto } from './ResponseOutputTextDto';
import { ResponseOutputRefusalDto } from './ResponseOutputRefusalDto';

@ApiExtraModels(
  ResponseOutputTextDto,
  ResponseOutputRefusalDto,
)
export class ResponseOutputMessageDto {
  /** The unique ID of the output message. */
  @ApiProperty({
    description: `The unique ID of the output message.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The content of the output message. */
  @ApiProperty({
    description: `The content of the output message.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(ResponseOutputTextDto) },
      { $ref: getSchemaPath(ResponseOutputRefusalDto) },
    ],
  })
  @IsArray()
  content!: (ResponseOutputTextDto | ResponseOutputRefusalDto)[];

  /** The role of the output message. Always `assistant`. */
  @ApiProperty({
    description: `The role of the output message. Always \`assistant\`.`,
    type: 'string',
    enum: ['assistant'],
  })
  @Equals('assistant')
  role!: 'assistant';

  /**
   * The status of the message input. One of `in_progress`, `completed`, or
   * `incomplete`. Populated when input items are returned via API.
   */
  @ApiProperty({
    description: `The status of the message input. One of \`in_progress\`, \`completed\`, or
  \`incomplete\`. Populated when input items are returned via API.`,
    enum: ['in_progress', 'completed', 'incomplete'],
  })
  @IsIn(['in_progress', 'completed', 'incomplete'])
  status!: 'in_progress' | 'completed' | 'incomplete';

  /** The type of the output message. Always `message`. */
  @ApiProperty({
    description: `The type of the output message. Always \`message\`.`,
    type: 'string',
    enum: ['message'],
  })
  @Equals('message')
  type!: 'message';

  /**
   * Labels an `assistant` message as intermediate commentary (`commentary`) or the
   * final answer (`final_answer`). For models like `gpt-5.3-codex` and beyond, when
   * sending follow-up requests, preserve and resend phase on all assistant messages
   * — dropping it can degrade performance. Not used for user messages.
   */
  @ApiProperty({
    required: false,
    description: `Labels an \`assistant\` message as intermediate commentary (\`commentary\`) or the
  final answer (\`final_answer\`). For models like \`gpt-5.3-codex\` and beyond, when
  sending follow-up requests, preserve and resend phase on all assistant messages
  — dropping it can degrade performance. Not used for user messages.`,
    enum: ['commentary', 'final_answer'],
  })
  @IsOptional()
  @IsIn(['commentary', 'final_answer'])
  phase?: null | 'commentary' | 'final_answer';
}
