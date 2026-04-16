import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

import { ChatCompletionContentPartTextDto } from './ChatCompletionContentPartTextDto';

export class ChatCompletionSystemMessageParamDto {
  /** The contents of the system message. */
  @ApiProperty({
    description: `The contents of the system message.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionContentPartTextDto) },
    ],
  })
  content!: string | ChatCompletionContentPartTextDto[];

  /** The role of the messages author, in this case `system`. */
  @ApiProperty({
    description: `The role of the messages author, in this case \`system\`.`,
    type: 'string',
    enum: ['system'],
  })
  @Equals('system')
  role!: 'system';

  /**
   * An optional name for the participant. Provides the model information to
   * differentiate between participants of the same role.
   */
  @ApiProperty({
    required: false,
    description: `An optional name for the participant. Provides the model information to
  differentiate between participants of the same role.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
