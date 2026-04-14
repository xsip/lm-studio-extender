import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class CreateFileDto {
  /** Unified diff content to apply when creating the file. */
  @ApiProperty({ description: `Unified diff content to apply when creating the file.`, type: 'string' })
  @IsString()
  diff!: string;

  /** Path of the file to create relative to the workspace root. */
  @ApiProperty({ description: `Path of the file to create relative to the workspace root.`, type: 'string' })
  @IsString()
  path!: string;

  /** The operation type. Always `create_file`. */
  @ApiProperty({ description: `The operation type. Always \`create_file\`.`, example: 'create_file' })
  @Equals('create_file')
  type!: 'create_file';
}
