import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ImageDto {
  /** The type of the output. Always `image`. */
  @ApiProperty({
    description: `The type of the output. Always \`image\`.`,
    type: 'string',
    enum: ['image'],
  })
  @Equals('image')
  type!: 'image';

  /** The URL of the image output from the code interpreter. */
  @ApiProperty({
    description: `The URL of the image output from the code interpreter.`,
    type: 'string',
  })
  @IsString()
  url!: string;
}
