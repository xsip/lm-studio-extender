import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals } from 'class-validator';

import { ChatCompletionContentPartTextDto } from './ChatCompletionContentPartTextDto';

export class ChatCompletionPredictionContentDto {
  /**
   * The content that should be matched when generating a model response. If
   * generated tokens would match this content, the entire model response can be
   * returned much more quickly.
   */
  @ApiProperty({
    description: `The content that should be matched when generating a model response. If
  generated tokens would match this content, the entire model response can be
  returned much more quickly.`,
    isArray: true,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(ChatCompletionContentPartTextDto) },
    ],
  })
  content!: string | ChatCompletionContentPartTextDto[];

  /**
   * The type of the predicted content you want to provide. This type is currently
   * always `content`.
   */
  @ApiProperty({
    description: `The type of the predicted content you want to provide. This type is currently
  always \`content\`.`,
    type: 'string',
    enum: ['content'],
  })
  @Equals('content')
  type!: 'content';
}
