import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseAudioTranscriptDeltaEventDto {
  /** The partial transcript of the audio response. */
  @ApiProperty({ description: `The partial transcript of the audio response.`, type: 'string' })
  @IsString()
  delta!: string;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.audio.transcript.delta`. */
  @ApiProperty({ description: `The type of the event. Always \`response.audio.transcript.delta\`.`, example: 'response.audio.transcript.delta' })
  @Equals('response.audio.transcript.delta')
  type!: 'response.audio.transcript.delta';
}
