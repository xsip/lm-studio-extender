import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class DeleteFileDto {
  /** Path of the file to delete relative to the workspace root. */
  @ApiProperty({
    description: `Path of the file to delete relative to the workspace root.`,
    type: 'string',
  })
  @IsString()
  path!: string;

  /** The operation type. Always `delete_file`. */
  @ApiProperty({
    description: `The operation type. Always \`delete_file\`.`,
    type: 'string',
    enum: ['delete_file'],
  })
  @Equals('delete_file')
  type!: 'delete_file';
}
