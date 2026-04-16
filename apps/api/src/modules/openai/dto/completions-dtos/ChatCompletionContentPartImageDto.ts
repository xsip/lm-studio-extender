import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ImageURLDto } from './ImageURLDto';

export class ChatCompletionContentPartImageDto {
  @ApiProperty({ type: () => ImageURLDto })
  @ValidateNested()
  @Type(() => ImageURLDto)
  image_url!: ImageURLDto;

  /** The type of the content part. */
  @ApiProperty({
    description: `The type of the content part.`,
    type: 'string',
    enum: ['image_url'],
  })
  @Equals('image_url')
  type!: 'image_url';
}
