import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseWebSearchCallInProgressEventDto {
  /** Unique ID for the output item associated with the web search call. */
  @ApiProperty({
    description: `Unique ID for the output item associated with the web search call.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item that the web search call is associated with. */
  @ApiProperty({
    description: `The index of the output item that the web search call is associated with.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number of the web search call being processed. */
  @ApiProperty({
    description: `The sequence number of the web search call being processed.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.web_search_call.in_progress`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.web_search_call.in_progress\`.`,
    type: 'string',
    enum: ['response.web_search_call.in_progress'],
  })
  @Equals('response.web_search_call.in_progress')
  type!: 'response.web_search_call.in_progress';
}
