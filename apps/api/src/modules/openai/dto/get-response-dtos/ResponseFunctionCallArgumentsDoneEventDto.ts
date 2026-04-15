import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseFunctionCallArgumentsDoneEventDto {
  /** The function-call arguments. */
  @ApiProperty({
    description: `The function-call arguments.`,
    type: 'string',
  })
  @IsString()
  arguments!: string;

  /** The ID of the item. */
  @ApiProperty({
    description: `The ID of the item.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The name of the function that was called. */
  @ApiProperty({
    description: `The name of the function that was called.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** The index of the output item. */
  @ApiProperty({
    description: `The index of the output item.`,
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

  @ApiProperty({ example: 'response.function_call_arguments.done' })
  @Equals('response.function_call_arguments.done')
  type!: 'response.function_call_arguments.done';
}
