import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class UpdateFileDto {
  /** Unified diff content to apply to the existing file. */
  @ApiProperty({ description: `Unified diff content to apply to the existing file.`, type: 'string' })
  @IsString()
  diff!: string;

  /** Path of the file to update relative to the workspace root. */
  @ApiProperty({ description: `Path of the file to update relative to the workspace root.`, type: 'string' })
  @IsString()
  path!: string;

  /** The operation type. Always `update_file`. */
  @ApiProperty({ description: `The operation type. Always \`update_file\`.`, example: 'update_file' })
  @Equals('update_file')
  type!: 'update_file';
}
