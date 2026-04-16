import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FileDto {
  @ApiProperty({ type: () => FileDto })
  @ValidateNested()
  @Type(() => FileDto)
  file!: FileDto;

  /** The type of the content part. Always `file`. */
  @ApiProperty({
    description: `The type of the content part. Always \`file\`.`,
    type: 'string',
    enum: ['file'],
  })
  @Equals('file')
  type!: 'file';
}
