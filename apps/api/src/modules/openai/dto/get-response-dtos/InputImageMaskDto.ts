import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class InputImageMaskDto {
  /** File ID for the mask image. */
  @ApiProperty({
    required: false,
    description: `File ID for the mask image.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  file_id?: string;

  /** Base64-encoded mask image. */
  @ApiProperty({
    required: false,
    description: `Base64-encoded mask image.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
