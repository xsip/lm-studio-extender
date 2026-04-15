import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseCompletedEventDto {
  /** Properties of the completed response. */
  @ApiProperty({
    description: `Properties of the completed response.`,
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

  /** The type of the event. Always `response.completed`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.completed\`.`,
    example: 'response.completed',
  })
  @Equals('response.completed')
  type!: 'response.completed';
}
