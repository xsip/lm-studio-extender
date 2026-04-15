import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseCreatedEventDto {
  /** The response that was created. */
  @ApiProperty({
    description: `The response that was created.`,
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

  /** The type of the event. Always `response.created`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.created\`.`,
    type: 'string',
    enum: ['response.created'],
  })
  @Equals('response.created')
  type!: 'response.created';
}
