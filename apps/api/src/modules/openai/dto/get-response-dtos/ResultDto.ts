import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ResultDto {
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard. Keys are strings with a maximum
   * length of 64 characters. Values are strings with a maximum length of 512
   * characters, booleans, or numbers.
   */
  @ApiProperty({
    required: false,
    description: `Set of 16 key-value pairs that can be attached to an object. This can be useful
  for storing additional information about the object in a structured format, and
  querying for objects via API or the dashboard. Keys are strings with a maximum
  length of 64 characters. Values are strings with a maximum length of 512
  characters, booleans, or numbers.`,
  })
  @IsOptional()
  attributes?: null | any;

  /** The unique ID of the file. */
  @ApiProperty({
    required: false,
    description: `The unique ID of the file.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  file_id?: string;

  /** The name of the file. */
  @ApiProperty({
    required: false,
    description: `The name of the file.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  filename?: string;

  /** The relevance score of the file - a value between 0 and 1. */
  @ApiProperty({
    required: false,
    description: `The relevance score of the file - a value between 0 and 1.`,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  score?: number;

  /** The text that was retrieved from the file. */
  @ApiProperty({
    required: false,
    description: `The text that was retrieved from the file.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  text?: string;
}
