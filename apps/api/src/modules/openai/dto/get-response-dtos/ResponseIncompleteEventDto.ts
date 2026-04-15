import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseIncompleteEventDto {
  /** The response that was incomplete. */
  @ApiProperty({
    description: `The response that was incomplete.`,
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

  /** The type of the event. Always `response.incomplete`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.incomplete\`.`,
    type: 'string',
    enum: ['response.incomplete'],
  })
  @Equals('response.incomplete')
  type!: 'response.incomplete';
}
