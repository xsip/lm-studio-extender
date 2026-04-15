import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseAudioDeltaEventDto {
  /** A chunk of Base64 encoded response audio bytes. */
  @ApiProperty({
    description: `A chunk of Base64 encoded response audio bytes.`,
    type: 'string',
  })
  @IsString()
  delta!: string;

  /** A sequence number for this chunk of the stream response. */
  @ApiProperty({
    description: `A sequence number for this chunk of the stream response.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.audio.delta`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.audio.delta\`.`,
    type: 'string',
    enum: ['response.audio.delta'],
  })
  @Equals('response.audio.delta')
  type!: 'response.audio.delta';
}
