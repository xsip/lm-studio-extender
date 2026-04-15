import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional } from 'class-validator';

export class ResponseInputImageDto {
  /**
   * The detail level of the image to be sent to the model. One of `high`, `low`,
   * `auto`, or `original`. Defaults to `auto`.
   */
  @ApiProperty({
    description: `The detail level of the image to be sent to the model. One of \`high\`, \`low\`,
  \`auto\`, or \`original\`. Defaults to \`auto\`.`,
    enum: ['low', 'high', 'auto', 'original'],
  })
  @IsIn(['low', 'high', 'auto', 'original'])
  detail!: 'low' | 'high' | 'auto' | 'original';

  /** The type of the input item. Always `input_image`. */
  @ApiProperty({
    description: `The type of the input item. Always \`input_image\`.`,
    example: 'input_image',
  })
  @Equals('input_image')
  type!: 'input_image';

  /** The ID of the file to be sent to the model. */
  @ApiProperty({
    required: false,
    description: `The ID of the file to be sent to the model.`,
    type: 'string',
  })
  @IsOptional()
  file_id?: null | string;

  /**
   * The URL of the image to be sent to the model. A fully qualified URL or base64
   * encoded image in a data URL.
   */
  @ApiProperty({
    required: false,
    description: `The URL of the image to be sent to the model. A fully qualified URL or base64
  encoded image in a data URL.`,
    type: 'string',
  })
  @IsOptional()
  image_url?: null | string;
}
