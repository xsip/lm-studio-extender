import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

import { ChatCompletionContentPartTextDto } from './ChatCompletionContentPartTextDto';
import { ChatCompletionContentPartImageDto } from './ChatCompletionContentPartImageDto';
import { ChatCompletionContentPartInputAudioDto } from './ChatCompletionContentPartInputAudioDto';
import { FileDto } from './FileDto';

@ApiExtraModels(
  ChatCompletionContentPartTextDto,
  ChatCompletionContentPartImageDto,
  ChatCompletionContentPartInputAudioDto,
  FileDto,
)
export class ChatCompletionUserMessageParamDto {
  /** The contents of the user message. */
  @ApiProperty({
    description: `The contents of the user message.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionContentPartTextDto) },
      { $ref: getSchemaPath(ChatCompletionContentPartImageDto) },
      { $ref: getSchemaPath(ChatCompletionContentPartInputAudioDto) },
      { $ref: getSchemaPath(FileDto) },
    ],
  })
  content!: string | (ChatCompletionContentPartTextDto | ChatCompletionContentPartImageDto | ChatCompletionContentPartInputAudioDto | FileDto)[];

  /** The role of the messages author, in this case `user`. */
  @ApiProperty({
    description: `The role of the messages author, in this case \`user\`.`,
    type: 'string',
    enum: ['user'],
  })
  @Equals('user')
  role!: 'user';

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
