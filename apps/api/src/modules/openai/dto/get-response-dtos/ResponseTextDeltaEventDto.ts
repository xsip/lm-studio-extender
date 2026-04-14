import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LogprobDto } from './LogprobDto';

export class ResponseTextDeltaEventDto {
  /** The index of the content part that the text delta was added to. */
  @ApiProperty({ description: `The index of the content part that the text delta was added to.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The text delta that was added. */
  @ApiProperty({ description: `The text delta that was added.`, type: 'string' })
  @IsString()
  delta!: string;

  /** The ID of the output item that the text delta was added to. */
  @ApiProperty({ description: `The ID of the output item that the text delta was added to.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The log probabilities of the tokens in the delta. */
  @ApiProperty({ description: `The log probabilities of the tokens in the delta.`, type: () => [LogprobDto], isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogprobDto)
  logprobs!: LogprobDto[];

  /** The index of the output item that the text delta was added to. */
  @ApiProperty({ description: `The index of the output item that the text delta was added to.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number for this event. */
  @ApiProperty({ description: `The sequence number for this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always `response.output_text.delta`. */
  @ApiProperty({ description: `The type of the event. Always \`response.output_text.delta\`.`, example: 'response.output_text.delta' })
  @Equals('response.output_text.delta')
  type!: 'response.output_text.delta';
}
