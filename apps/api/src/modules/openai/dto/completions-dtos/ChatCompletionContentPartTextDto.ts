import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ChatCompletionContentPartTextDto {
  /** The text content. */
  @ApiProperty({
    description: `The text content.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /** The type of the content part. */
  @ApiProperty({
    description: `The type of the content part.`,
    type: 'string',
    enum: ['text'],
  })
  @Equals('text')
  type!: 'text';
}
