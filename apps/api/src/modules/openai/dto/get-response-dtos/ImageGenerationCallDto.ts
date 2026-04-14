import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsString } from 'class-validator';

export class ImageGenerationCallDto {
  /** The unique ID of the image generation call. */
  @ApiProperty({ description: `The unique ID of the image generation call.`, type: 'string' })
  @IsString()
  id!: string;

  /** The generated image encoded in base64. */
  @ApiProperty({ description: `The generated image encoded in base64.` })
  result!: null | string;

  /** The status of the image generation call. */
  @ApiProperty({ description: `The status of the image generation call.`, enum: ['in_progress', 'completed', 'failed', 'generating'] })
  @IsIn(['in_progress', 'completed', 'failed', 'generating'])
  status!: 'in_progress' | 'completed' | 'failed' | 'generating';

  /** The type of the image generation call. Always `image_generation_call`. */
  @ApiProperty({ description: `The type of the image generation call. Always \`image_generation_call\`.`, example: 'image_generation_call' })
  @Equals('image_generation_call')
  type!: 'image_generation_call';
}
