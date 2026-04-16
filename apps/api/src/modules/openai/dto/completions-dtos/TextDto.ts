import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class TextDto {
  /** Unconstrained text format. Always `text`. */
  @ApiProperty({
    description: `Unconstrained text format. Always \`text\`.`,
    type: 'string',
    enum: ['text'],
  })
  @Equals('text')
  type!: 'text';
}
