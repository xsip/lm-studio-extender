import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

import { ResponseOutputTextDto } from './ResponseOutputTextDto';
import { ResponseOutputRefusalDto } from './ResponseOutputRefusalDto';
import { ReasoningTextDto } from './ReasoningTextDto';

export class ResponseContentPartDoneEventDto {
  /** The index of the content part that is done. */
  @ApiProperty({ description: `The index of the content part that is done.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The ID of the output item that the content part was added to. */
  @ApiProperty({ description: `The ID of the output item that the content part was added to.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item that the content part was added to. */
  @ApiProperty({ description: `The index of the output item that the content part was added to.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The content part that is done. */
  @ApiProperty({ description: `The content part that is done.` })
  part!: ResponseOutputTextDto | ResponseOutputRefusalDto | ReasoningTextDto;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.content_part.done`. */
  @ApiProperty({ description: `The type of the event. Always \`response.content_part.done\`.`, example: 'response.content_part.done' })
  @Equals('response.content_part.done')
  type!: 'response.content_part.done';
}
