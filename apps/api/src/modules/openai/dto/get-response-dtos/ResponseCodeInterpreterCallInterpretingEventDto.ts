import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCodeInterpreterCallInterpretingEventDto {
  /** The unique identifier of the code interpreter tool call item. */
  @ApiProperty({
    description: `The unique identifier of the code interpreter tool call item.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /**
   * The index of the output item in the response for which the code interpreter is
   * interpreting code.
   */
  @ApiProperty({
    description: `The index of the output item in the response for which the code interpreter is
  interpreting code.`,
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

  /** The type of the event. Always `response.code_interpreter_call.interpreting`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.code_interpreter_call.interpreting\`.`,
    type: 'string',
    enum: ['response.code_interpreter_call.interpreting'],
  })
  @Equals('response.code_interpreter_call.interpreting')
  type!: 'response.code_interpreter_call.interpreting';
}
