import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { JSONSchemaDto } from './JSONSchemaDto';

export class ResponseFormatJSONSchemaDto {
  /** Structured Outputs configuration options, including a JSON Schema. */
  @ApiProperty({
    description: `Structured Outputs configuration options, including a JSON Schema.`,
    type: () => JSONSchemaDto,
  })
  @ValidateNested()
  @Type(() => JSONSchemaDto)
  json_schema!: JSONSchemaDto;

  /** The type of response format being defined. Always `json_schema`. */
  @ApiProperty({
    description: `The type of response format being defined. Always \`json_schema\`.`,
    type: 'string',
    enum: ['json_schema'],
  })
  @Equals('json_schema')
  type!: 'json_schema';
}
