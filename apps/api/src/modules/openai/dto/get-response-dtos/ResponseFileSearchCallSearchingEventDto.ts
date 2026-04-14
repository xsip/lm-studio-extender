import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseFileSearchCallSearchingEventDto {
  /** The ID of the output item that the file search call is initiated. */
  @ApiProperty({ description: `The ID of the output item that the file search call is initiated.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item that the file search call is searching. */
  @ApiProperty({ description: `The index of the output item that the file search call is searching.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.file_search_call.searching`. */
  @ApiProperty({ description: `The type of the event. Always \`response.file_search_call.searching\`.`, example: 'response.file_search_call.searching' })
  @Equals('response.file_search_call.searching')
  type!: 'response.file_search_call.searching';
}
