import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber } from 'class-validator';

export class ResponseAudioDoneEventDto {
  /** The sequence number of the delta. */
  @ApiProperty({
    description: `The sequence number of the delta.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.audio.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.audio.done\`.`,
    example: 'response.audio.done',
  })
  @Equals('response.audio.done')
  type!: 'response.audio.done';
}
