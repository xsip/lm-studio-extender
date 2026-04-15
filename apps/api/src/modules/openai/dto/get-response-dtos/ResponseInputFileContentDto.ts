import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional } from 'class-validator';

export class ResponseInputFileContentDto {
  /** The type of the input item. Always `input_file`. */
  @ApiProperty({
    description: `The type of the input item. Always \`input_file\`.`,
    type: 'string',
    enum: ['input_file'],
  })
  @Equals('input_file')
  type!: 'input_file';

  /** The base64-encoded data of the file to be sent to the model. */
  @ApiProperty({
    required: false,
    description: `The base64-encoded data of the file to be sent to the model.`,
    type: 'string',
  })
  @IsOptional()
  file_data?: null | string;

  /** The ID of the file to be sent to the model. */
  @ApiProperty({
    required: false,
    description: `The ID of the file to be sent to the model.`,
    type: 'string',
  })
  @IsOptional()
  file_id?: null | string;

  /** The URL of the file to be sent to the model. */
  @ApiProperty({
    required: false,
    description: `The URL of the file to be sent to the model.`,
    type: 'string',
  })
  @IsOptional()
  file_url?: null | string;

  /** The name of the file to be sent to the model. */
  @ApiProperty({
    required: false,
    description: `The name of the file to be sent to the model.`,
    type: 'string',
  })
  @IsOptional()
  filename?: null | string;
}
