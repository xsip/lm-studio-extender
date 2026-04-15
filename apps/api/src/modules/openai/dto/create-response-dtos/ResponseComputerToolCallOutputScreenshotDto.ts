import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ResponseComputerToolCallOutputScreenshotDto {
  /**
   * Specifies the event type. For a computer screenshot, this property is always set
   * to `computer_screenshot`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a computer screenshot, this property is always set
  to \`computer_screenshot\`.`,
    example: 'computer_screenshot',
  })
  @Equals('computer_screenshot')
  type!: 'computer_screenshot';

  /** The identifier of an uploaded file that contains the screenshot. */
  @ApiProperty({
    required: false,
    description: `The identifier of an uploaded file that contains the screenshot.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  file_id?: string;

  /** The URL of the screenshot image. */
  @ApiProperty({
    required: false,
    description: `The URL of the screenshot image.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
