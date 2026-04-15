import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseImageGenCallGeneratingEventDto {
  /** The unique identifier of the image generation item being processed. */
  @ApiProperty({
    description: `The unique identifier of the image generation item being processed.`,
    type: 'string',
  })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response's output array. */
  @ApiProperty({
    description: `The index of the output item in the response's output array.`,
    type: 'number',
  })
  @IsNumber()
  output_index!: number;

  /** The sequence number of the image generation item being processed. */
  @ApiProperty({
    description: `The sequence number of the image generation item being processed.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.image_generation_call.generating'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.image_generation_call.generating'.`,
    type: 'string',
    enum: ['response.image_generation_call.generating'],
  })
  @Equals('response.image_generation_call.generating')
  type!: 'response.image_generation_call.generating';
}
