import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseDto } from './ResponseDto';

export class ResponseInProgressEventDto {
  /** The response that is in progress. */
  @ApiProperty({ description: `The response that is in progress.`, type: () => ResponseDto })
  @ValidateNested()
  @Type(() => ResponseDto)
  response!: ResponseDto;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.in_progress`. */
  @ApiProperty({ description: `The type of the event. Always \`response.in_progress\`.`, example: 'response.in_progress' })
  @Equals('response.in_progress')
  type!: 'response.in_progress';
}
