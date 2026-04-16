import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

import { ChatCompletionContentPartTextDto } from './ChatCompletionContentPartTextDto';

export class ChatCompletionDeveloperMessageParamDto {
  /** The contents of the developer message. */
  @ApiProperty({
    description: `The contents of the developer message.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionContentPartTextDto) },
    ],
  })
  content!: string | ChatCompletionContentPartTextDto[];

  /** The role of the messages author, in this case `developer`. */
  @ApiProperty({
    description: `The role of the messages author, in this case \`developer\`.`,
    type: 'string',
    enum: ['developer'],
  })
  @Equals('developer')
  role!: 'developer';

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
