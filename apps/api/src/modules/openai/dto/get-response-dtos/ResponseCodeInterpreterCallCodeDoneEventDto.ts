import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCodeInterpreterCallCodeDoneEventDto {
  /** The final code snippet output by the code interpreter. */
  @ApiProperty({
    description: `The final code snippet output by the code interpreter.`,
    type: 'string',
  })
  @IsString()
  code!: string;

  /** The unique identifier of the code interpreter tool call item. */
  @ApiProperty({
    description: `The unique identifier of the code interpreter tool call item.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response for which the code is finalized. */
  @ApiProperty({
    description: `The index of the output item in the response for which the code is finalized.`,
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

  /** The type of the event. Always `response.code_interpreter_call_code.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.code_interpreter_call_code.done\`.`,
    type: 'string',
    enum: ['response.code_interpreter_call_code.done'],
  })
  @Equals('response.code_interpreter_call_code.done')
  type!: 'response.code_interpreter_call_code.done';
}
