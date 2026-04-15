import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseFunctionCallArgumentsDeltaEventDto {
  /** The function-call arguments delta that is added. */
  @ApiProperty({
    description: `The function-call arguments delta that is added.`,
    type: 'string',
  })
  @IsString()
  delta!: string;

  /** The ID of the output item that the function-call arguments delta is added to. */
  @ApiProperty({
    description: `The ID of the output item that the function-call arguments delta is added to.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that the function-call arguments delta is added to. */
  @ApiProperty({
    description: `The index of the output item that the function-call arguments delta is added to.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({
    description: `The sequence number of this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.function_call_arguments.delta`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.function_call_arguments.delta\`.`,
    type: 'string',
    enum: ['response.function_call_arguments.delta'],
  })
  @Equals('response.function_call_arguments.delta')
  type!: 'response.function_call_arguments.delta';
}
