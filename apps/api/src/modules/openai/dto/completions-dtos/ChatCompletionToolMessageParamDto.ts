import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

import { ChatCompletionContentPartTextDto } from './ChatCompletionContentPartTextDto';

export class ChatCompletionToolMessageParamDto {
  /** The contents of the tool message. */
  @ApiProperty({
    description: `The contents of the tool message.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionContentPartTextDto) },
    ],
  })
  content!: string | ChatCompletionContentPartTextDto[];

  /** The role of the messages author, in this case `tool`. */
  @ApiProperty({
    description: `The role of the messages author, in this case \`tool\`.`,
    type: 'string',
    enum: ['tool'],
  })
  @Equals('tool')
  role!: 'tool';

  /** Tool call that this message is responding to. */
  @ApiProperty({
    description: `Tool call that this message is responding to.`,
    type: 'string',
  })
  @IsString()
  tool_call_id!: string;
}
