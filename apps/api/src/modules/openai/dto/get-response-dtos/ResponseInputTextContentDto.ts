import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ResponseInputTextContentDto {
  /** The text input to the model. */
  @ApiProperty({
    description: `The text input to the model.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /** The type of the input item. Always `input_text`. */
  @ApiProperty({
    description: `The type of the input item. Always \`input_text\`.`,
    type: 'string',
    enum: ['input_text'],
  })
  @Equals('input_text')
  type!: 'input_text';
}
