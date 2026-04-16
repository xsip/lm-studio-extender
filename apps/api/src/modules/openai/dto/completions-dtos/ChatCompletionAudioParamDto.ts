import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { DDto } from './DDto';

@ApiExtraModels(
  DDto,
)
export class ChatCompletionAudioParamDto {
  /**
   * Specifies the output audio format. Must be one of `wav`, `mp3`, `flac`, `opus`,
   * or `pcm16`.
   */
  @ApiProperty({
    description: `Specifies the output audio format. Must be one of \`wav\`, \`mp3\`, \`flac\`, \`opus\`,
  or \`pcm16\`.`,
    enum: ['wav', 'aac', 'mp3', 'flac', 'opus', 'pcm16'],
  })
  @IsIn(['wav', 'aac', 'mp3', 'flac', 'opus', 'pcm16'])
  format!: 'wav' | 'aac' | 'mp3' | 'flac' | 'opus' | 'pcm16';

  /**
   * The voice the model uses to respond. Supported built-in voices are `alloy`,
   * `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`, `sage`, `shimmer`,
   * `marin`, and `cedar`. You may also provide a custom voice object with an `id`,
   * for example `{ "id": "voice_1234" }`.
   */
  @ApiProperty({
    description: `The voice the model uses to respond. Supported built-in voices are \`alloy\`,
  \`ash\`, \`ballad\`, \`coral\`, \`echo\`, \`fable\`, \`nova\`, \`onyx\`, \`sage\`, \`shimmer\`,
  \`marin\`, and \`cedar\`. You may also provide a custom voice object with an \`id\`,
  for example \`{ "id": "voice_1234" }\`.`,
    oneOf: [
      { type: 'string' },
      { $ref: getSchemaPath(DDto) },
    ],
  })
  voice!: string | DDto;
}
