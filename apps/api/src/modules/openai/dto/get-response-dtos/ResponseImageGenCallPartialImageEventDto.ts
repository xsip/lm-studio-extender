import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseImageGenCallPartialImageEventDto {
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

  /** Base64-encoded partial image data, suitable for rendering as an image. */
  @ApiProperty({
    description: `Base64-encoded partial image data, suitable for rendering as an image.`,
    type: 'string',
  })
  @IsString()
  partial_image_b64!: string;

  /**
   * 0-based index for the partial image (backend is 1-based, but this is 0-based for
   * the user).
   */
  @ApiProperty({
    description: `0-based index for the partial image (backend is 1-based, but this is 0-based for
  the user).`,
    type: 'number',
  })
  @IsNumber()
  partial_image_index!: number;

  /** The sequence number of the image generation item being processed. */
  @ApiProperty({
    description: `The sequence number of the image generation item being processed.`,
    type: 'number',
  })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.image_generation_call.partial_image'. */
  @ApiProperty({
    description: `The type of the event. Always 'response.image_generation_call.partial_image'.`,
    example: 'response.image_generation_call.partial_image',
  })
  @Equals('response.image_generation_call.partial_image')
  type!: 'response.image_generation_call.partial_image';
}
