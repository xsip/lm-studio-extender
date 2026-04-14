import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ResponseInputFileDto {
  /** The type of the input item. Always `input_file`. */
  @ApiProperty({ description: `The type of the input item. Always \`input_file\`.`, example: 'input_file' })
  @Equals('input_file')
  type!: 'input_file';

  /** The content of the file to be sent to the model. */
  @ApiProperty({ required: false, description: `The content of the file to be sent to the model.`, type: 'string' })
  @IsOptional()
  @IsString()
  file_data?: string;

  /** The ID of the file to be sent to the model. */
  @ApiProperty({ required: false, description: `The ID of the file to be sent to the model.` })
  @IsOptional()
  file_id?: null | string;

  /** The URL of the file to be sent to the model. */
  @ApiProperty({ required: false, description: `The URL of the file to be sent to the model.`, type: 'string' })
  @IsOptional()
  @IsString()
  file_url?: string;

  /** The name of the file to be sent to the model. */
  @ApiProperty({ required: false, description: `The name of the file to be sent to the model.`, type: 'string' })
  @IsOptional()
  @IsString()
  filename?: string;
}
