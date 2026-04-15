import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ContentDto {
  /** The reasoning text from the model. */
  @ApiProperty({
    description: `The reasoning text from the model.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /** The type of the reasoning text. Always `reasoning_text`. */
  @ApiProperty({
    description: `The type of the reasoning text. Always \`reasoning_text\`.`,
    type: 'string',
    enum: ['reasoning_text'],
  })
  @Equals('reasoning_text')
  type!: 'reasoning_text';
}
