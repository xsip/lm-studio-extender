import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class InputAudioDto {
  /** Base64 encoded audio data. */
  @ApiProperty({
    description: `Base64 encoded audio data.`,
    type: 'string',
  })
  @IsString()
  data!: string;

  /** The format of the encoded audio data. Currently supports "wav" and "mp3". */
  @ApiProperty({
    description: `The format of the encoded audio data. Currently supports "wav" and "mp3".`,
    enum: ['wav', 'mp3'],
  })
  @IsIn(['wav', 'mp3'])
  format!: 'wav' | 'mp3';
}
