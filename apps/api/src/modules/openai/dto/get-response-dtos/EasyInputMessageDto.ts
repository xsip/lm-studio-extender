import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional } from 'class-validator';

import { ResponseInputTextDto } from './ResponseInputTextDto';
import { ResponseInputImageDto } from './ResponseInputImageDto';
import { ResponseInputFileDto } from './ResponseInputFileDto';

export class EasyInputMessageDto {
  /** Text, image, or audio input to the model, used to generate a response. Can also
contain previous assistant responses. */
  @ApiProperty({ description: `Text, image, or audio input to the model, used to generate a response. Can also
contain previous assistant responses.` })
  content!: string | ResponseInputTextDto | ResponseInputImageDto | ResponseInputFileDto[];

  /** The role of the message input. One of `user`, `assistant`, `system`, or
`developer`. */
  @ApiProperty({ description: `The role of the message input. One of \`user\`, \`assistant\`, \`system\`, or
\`developer\`.`, enum: ['user', 'assistant', 'system', 'developer'] })
  @IsIn(['user', 'assistant', 'system', 'developer'])
  role!: 'user' | 'assistant' | 'system' | 'developer';

  /** Labels an `assistant` message as intermediate commentary (`commentary`) or the
final answer (`final_answer`). For models like `gpt-5.3-codex` and beyond, when
sending follow-up requests, preserve and resend phase on all assistant messages
— dropping it can degrade performance. Not used for user messages. */
  @ApiProperty({ required: false, description: `Labels an \`assistant\` message as intermediate commentary (\`commentary\`) or the
final answer (\`final_answer\`). For models like \`gpt-5.3-codex\` and beyond, when
sending follow-up requests, preserve and resend phase on all assistant messages
— dropping it can degrade performance. Not used for user messages.` })
  @IsOptional()
  phase?: null | 'commentary' | 'final_answer';

  /** The type of the message input. Always `message`. */
  @ApiProperty({ required: false, description: `The type of the message input. Always \`message\`.`, example: 'message' })
  @IsOptional()
  @Equals('message')
  type?: 'message';
}
