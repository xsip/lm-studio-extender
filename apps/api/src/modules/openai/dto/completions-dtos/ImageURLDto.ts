import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ImageURLDto {
  /** Either a URL of the image or the base64 encoded image data. */
  @ApiProperty({
    description: `Either a URL of the image or the base64 encoded image data.`,
    type: 'string',
  })
  @IsString()
  url!: string;

  /**
   * Specifies the detail level of the image. Learn more in the
   * [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).
   */
  @ApiProperty({
    required: false,
    description: `Specifies the detail level of the image. Learn more in the
  [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).`,
    enum: ['auto', 'low', 'high'],
  })
  @IsOptional()
  @IsIn(['auto', 'low', 'high'])
  detail?: 'auto' | 'low' | 'high';
}
