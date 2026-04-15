import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsIn, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { InputImageMaskDto } from './InputImageMaskDto';
import { _Inline_0Dto } from './_Inline_0Dto';

@ApiExtraModels(
  _Inline_0Dto,
)
export class ImageGenerationDto {
  /** The type of the image generation tool. Always `image_generation`. */
  @ApiProperty({
    description: `The type of the image generation tool. Always \`image_generation\`.`,
    example: 'image_generation',
  })
  @Equals('image_generation')
  type!: 'image_generation';

  /** Whether to generate a new image or edit an existing image. Default: `auto`. */
  @ApiProperty({
    required: false,
    description: `Whether to generate a new image or edit an existing image. Default: \`auto\`.`,
    enum: ['auto', 'generate', 'edit'],
  })
  @IsOptional()
  @IsIn(['auto', 'generate', 'edit'])
  action?: 'auto' | 'generate' | 'edit';

  /**
   * Background type for the generated image. One of `transparent`, `opaque`, or
   * `auto`. Default: `auto`.
   */
  @ApiProperty({
    required: false,
    description: `Background type for the generated image. One of \`transparent\`, \`opaque\`, or
  \`auto\`. Default: \`auto\`.`,
    enum: ['auto', 'transparent', 'opaque'],
  })
  @IsOptional()
  @IsIn(['auto', 'transparent', 'opaque'])
  background?: 'auto' | 'transparent' | 'opaque';

  /**
   * Control how much effort the model will exert to match the style and features,
   * especially facial features, of input images. This parameter is only supported
   * for `gpt-image-1` and `gpt-image-1.5` and later models, unsupported for
   * `gpt-image-1-mini`. Supports `high` and `low`. Defaults to `low`.
   */
  @ApiProperty({
    required: false,
    description: `Control how much effort the model will exert to match the style and features,
  especially facial features, of input images. This parameter is only supported
  for \`gpt-image-1\` and \`gpt-image-1.5\` and later models, unsupported for
  \`gpt-image-1-mini\`. Supports \`high\` and \`low\`. Defaults to \`low\`.`,
    enum: ['low', 'high'],
  })
  @IsOptional()
  @IsIn(['low', 'high'])
  input_fidelity?: null | 'low' | 'high';

  /**
   * Optional mask for inpainting. Contains `image_url` (string, optional) and
   * `file_id` (string, optional).
   */
  @ApiProperty({
    required: false,
    description: `Optional mask for inpainting. Contains \`image_url\` (string, optional) and
  \`file_id\` (string, optional).`,
    type: () => InputImageMaskDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InputImageMaskDto)
  input_image_mask?: InputImageMaskDto;

  /** The image generation model to use. Default: `gpt-image-1`. */
  @ApiProperty({
    required: false,
    description: `The image generation model to use. Default: \`gpt-image-1\`.`,
    oneOf: [
      { $ref: getSchemaPath(_Inline_0Dto) },
    ],
  })
  @IsOptional()
  model?: _Inline_0Dto | 'gpt-image-1' | 'gpt-image-1-mini' | 'gpt-image-1.5';

  /** Moderation level for the generated image. Default: `auto`. */
  @ApiProperty({
    required: false,
    description: `Moderation level for the generated image. Default: \`auto\`.`,
    enum: ['low', 'auto'],
  })
  @IsOptional()
  @IsIn(['low', 'auto'])
  moderation?: 'low' | 'auto';

  /** Compression level for the output image. Default: 100. */
  @ApiProperty({
    required: false,
    description: `Compression level for the output image. Default: 100.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  output_compression?: number;

  /**
   * The output format of the generated image. One of `png`, `webp`, or `jpeg`.
   * Default: `png`.
   */
  @ApiProperty({
    required: false,
    description: `The output format of the generated image. One of \`png\`, \`webp\`, or \`jpeg\`.
  Default: \`png\`.`,
    enum: ['png', 'webp', 'jpeg'],
  })
  @IsOptional()
  @IsIn(['png', 'webp', 'jpeg'])
  output_format?: 'png' | 'webp' | 'jpeg';

  /**
   * Number of partial images to generate in streaming mode, from 0 (default value)
   * to 3.
   */
  @ApiProperty({
    required: false,
    description: `Number of partial images to generate in streaming mode, from 0 (default value)
  to 3.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  partial_images?: number;

  /**
   * The quality of the generated image. One of `low`, `medium`, `high`, or `auto`.
   * Default: `auto`.
   */
  @ApiProperty({
    required: false,
    description: `The quality of the generated image. One of \`low\`, \`medium\`, \`high\`, or \`auto\`.
  Default: \`auto\`.`,
    enum: ['low', 'high', 'auto', 'medium'],
  })
  @IsOptional()
  @IsIn(['low', 'high', 'auto', 'medium'])
  quality?: 'low' | 'high' | 'auto' | 'medium';

  /**
   * The size of the generated image. One of `1024x1024`, `1024x1536`, `1536x1024`,
   * or `auto`. Default: `auto`.
   */
  @ApiProperty({
    required: false,
    description: `The size of the generated image. One of \`1024x1024\`, \`1024x1536\`, \`1536x1024\`,
  or \`auto\`. Default: \`auto\`.`,
    enum: ['auto', '1024x1024', '1024x1536', '1536x1024'],
  })
  @IsOptional()
  @IsIn(['auto', '1024x1024', '1024x1536', '1536x1024'])
  size?: 'auto' | '1024x1024' | '1024x1536' | '1536x1024';
}
