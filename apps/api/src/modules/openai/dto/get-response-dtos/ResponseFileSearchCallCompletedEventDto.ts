import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseFileSearchCallCompletedEventDto {
  /** The ID of the output item that the file search call is initiated. */
  @ApiProperty({
    description: `The ID of the output item that the file search call is initiated.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that the file search call is initiated. */
  @ApiProperty({
    description: `The index of the output item that the file search call is initiated.`,
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

  /** The type of the event. Always `response.file_search_call.completed`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.file_search_call.completed\`.`,
    example: 'response.file_search_call.completed',
  })
  @Equals('response.file_search_call.completed')
  type!: 'response.file_search_call.completed';
}
