import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class CustomToolInputFormatDto {
  /** Unconstrained text format. Always `text`. */
  @ApiProperty({ description: `Unconstrained text format. Always \`text\`.`, example: 'text' })
  @Equals('text')
  type!: 'text';
}
