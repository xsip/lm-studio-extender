import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseErrorEventDto {
  /** The error code. */
  @ApiProperty({
    description: `The error code.`,
    type: 'string',
  })
  code!: null | string;

  /** The error message. */
  @ApiProperty({
    description: `The error message.`,
    type: 'string',
  })
  @IsString()
  message!: string;

  /** The error parameter. */
  @ApiProperty({
    description: `The error parameter.`,
    type: 'string',
  })
  param!: null | string;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `error`. */
  @ApiProperty({
    description: `The type of the event. Always \`error\`.`,
    type: 'string',
    enum: ['error'],
  })
  @Equals('error')
  type!: 'error';
}
