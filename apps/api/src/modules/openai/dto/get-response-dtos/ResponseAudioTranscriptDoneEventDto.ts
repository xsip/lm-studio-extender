import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber } from 'class-validator';

export class ResponseAudioTranscriptDoneEventDto {
  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.audio.transcript.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.audio.transcript.done\`.`,
    type: 'string',
    enum: ['response.audio.transcript.done'],
  })
  @Equals('response.audio.transcript.done')
  type!: 'response.audio.transcript.done';
}
