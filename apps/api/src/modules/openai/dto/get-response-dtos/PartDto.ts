import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class PartDto {
  /** The text of the summary part. */
  @ApiProperty({ description: `The text of the summary part.`, type: 'string' })
  @IsString()
  text!: string;

  /** The type of the summary part. Always `summary_text`. */
  @ApiProperty({ description: `The type of the summary part. Always \`summary_text\`.`, example: 'summary_text' })
  @Equals('summary_text')
  type!: 'summary_text';
}
