import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class SummaryDto {
  /** A summary of the reasoning output from the model so far. */
  @ApiProperty({ description: `A summary of the reasoning output from the model so far.`, type: 'string' })
  @IsString()
  text!: string;

  /** The type of the object. Always `summary_text`. */
  @ApiProperty({ description: `The type of the object. Always \`summary_text\`.`, example: 'summary_text' })
  @Equals('summary_text')
  type!: 'summary_text';
}
