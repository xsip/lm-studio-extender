import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { InputAudioDto } from './InputAudioDto';

export class ChatCompletionContentPartInputAudioDto {
  @ApiProperty({ type: () => InputAudioDto })
  @ValidateNested()
  @Type(() => InputAudioDto)
  input_audio!: InputAudioDto;

  /** The type of the content part. Always `input_audio`. */
  @ApiProperty({
    description: `The type of the content part. Always \`input_audio\`.`,
    type: 'string',
    enum: ['input_audio'],
  })
  @Equals('input_audio')
  type!: 'input_audio';
}
