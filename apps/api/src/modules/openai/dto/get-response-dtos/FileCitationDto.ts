import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class FileCitationDto {
  /** The ID of the file. */
  @ApiProperty({ description: `The ID of the file.`, type: 'string' })
  @IsString()
  file_id!: string;

  /** The filename of the file cited. */
  @ApiProperty({ description: `The filename of the file cited.`, type: 'string' })
  @IsString()
  filename!: string;

  /** The index of the file in the list of files. */
  @ApiProperty({ description: `The index of the file in the list of files.`, type: 'number' })
  @IsNumber()
  index!: number;

  /** The type of the file citation. Always `file_citation`. */
  @ApiProperty({ description: `The type of the file citation. Always \`file_citation\`.`, example: 'file_citation' })
  @Equals('file_citation')
  type!: 'file_citation';
}
