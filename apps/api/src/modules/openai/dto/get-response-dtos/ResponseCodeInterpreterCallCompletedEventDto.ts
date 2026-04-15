import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCodeInterpreterCallCompletedEventDto {
  /** The unique identifier of the code interpreter tool call item. */
  @ApiProperty({
    description: `The unique identifier of the code interpreter tool call item.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /**
   * The index of the output item in the response for which the code interpreter call
   * is completed.
   */
  @ApiProperty({
    description: `The index of the output item in the response for which the code interpreter call
  is completed.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event, used to order streaming events. */
  @ApiProperty({
    description: `The sequence number of this event, used to order streaming events.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.code_interpreter_call.completed`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.code_interpreter_call.completed\`.`,
    example: 'response.code_interpreter_call.completed',
  })
  @Equals('response.code_interpreter_call.completed')
  type!: 'response.code_interpreter_call.completed';
}
