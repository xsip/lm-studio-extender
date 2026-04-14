import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class FilePathDto {
  /** The ID of the file. */
  @ApiProperty({ description: `The ID of the file.`, type: 'string' })
  @IsString()
  file_id!: string;

  /** The index of the file in the list of files. */
  @ApiProperty({ description: `The index of the file in the list of files.`, type: 'number' })
  @IsNumber()
  index!: number;

  /** The type of the file path. Always `file_path`. */
  @ApiProperty({ description: `The type of the file path. Always \`file_path\`.`, example: 'file_path' })
  @Equals('file_path')
  type!: 'file_path';
}
