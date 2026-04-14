import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseCodeInterpreterCallInProgressEventDto {
  /** The unique identifier of the code interpreter tool call item. */
  @ApiProperty({ description: `The unique identifier of the code interpreter tool call item.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response for which the code interpreter call
is in progress. */
  @ApiProperty({ description: `The index of the output item in the response for which the code interpreter call
is in progress.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event, used to order streaming events. */
  @ApiProperty({ description: `The sequence number of this event, used to order streaming events.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.code_interpreter_call.in_progress`. */
  @ApiProperty({ description: `The type of the event. Always \`response.code_interpreter_call.in_progress\`.`, example: 'response.code_interpreter_call.in_progress' })
  @Equals('response.code_interpreter_call.in_progress')
  type!: 'response.code_interpreter_call.in_progress';
}
