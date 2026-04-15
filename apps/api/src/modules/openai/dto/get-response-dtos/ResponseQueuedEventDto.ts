import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseQueuedEventDto {
  /** The full response object that is queued. */
  @ApiProperty({
    description: `The full response object that is queued.`,
    type: () => ResponseDto,
  })
  @ValidateNested()
  @Type(() => ResponseDto)
  response!: ResponseDto;

  /** The sequence number for this event. */
  @ApiProperty({
    description: `The sequence number for this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.queued'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.queued'.`,
    example: 'response.queued',
  })
  @Equals('response.queued')
  type!: 'response.queued';
}
