import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ResponseFormatTextDto {
  /** The type of response format being defined. Always `text`. */
  @ApiProperty({
    description: `The type of response format being defined. Always \`text\`.`,
    type: 'string',
    enum: ['text'],
  })
  @Equals('text')
  type!: 'text';
}
