import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseFailedEventDto {
  /** The response that failed. */
  @ApiProperty({
    description: `The response that failed.`,
    type: () => ResponseDto,
  })
  @ValidateNested()
  @Type(() => ResponseDto)
  response!: ResponseDto;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.failed`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.failed\`.`,
    type: 'string',
    enum: ['response.failed'],
  })
  @Equals('response.failed')
  type!: 'response.failed';
}
