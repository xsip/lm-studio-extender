import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LogprobDto } from './LogprobDto';

export class ResponseTextDoneEventDto {
  /** The index of the content part that the text content is finalized. */
  @ApiProperty({
    description: `The index of the content part that the text content is finalized.`,
    type: 'number',
  })
  @IsNumber()
  content_index!: number;

  /** The ID of the output item that the text content is finalized. */
  @ApiProperty({
    description: `The ID of the output item that the text content is finalized.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The log probabilities of the tokens in the delta. */
  @ApiProperty({
    description: `The log probabilities of the tokens in the delta.`,
    type: LogprobDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LogprobDto)
  logprobs!: LogprobDto[];

  /** The index of the output item that the text content is finalized. */
  @ApiProperty({
    description: `The index of the output item that the text content is finalized.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number for this event. */
  @ApiProperty({
    description: `The sequence number for this event.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The text content that is finalized. */
  @ApiProperty({
    description: `The text content that is finalized.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /** The type of the event. Always `response.output_text.done`. */
  @ApiProperty({
    description: `The type of the event. Always \`response.output_text.done\`.`,
    example: 'response.output_text.done',
  })
  @Equals('response.output_text.done')
  type!: 'response.output_text.done';
}
