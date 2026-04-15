import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class ResponseFormatTextJSONSchemaConfigDto {
  /**
   * The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores
   * and dashes, with a maximum length of 64.
   */
  @ApiProperty({
    description: `The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores
  and dashes, with a maximum length of 64.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /**
   * The schema for the response format, described as a JSON Schema object. Learn how
   * to build JSON schemas [here](https://json-schema.org/).
   */
  @ApiProperty({ description: `The schema for the response format, described as a JSON Schema object. Learn how
  to build JSON schemas [here](https://json-schema.org/).` })
  schema!: any;

  /** The type of response format being defined. Always `json_schema`. */
  @ApiProperty({
    description: `The type of response format being defined. Always \`json_schema\`.`,
    type: 'string',
    enum: ['json_schema'],
  })
  @Equals('json_schema')
  type!: 'json_schema';

  /**
   * A description of what the response format is for, used by the model to determine
   * how to respond in the format.
   */
  @ApiProperty({
    required: false,
    description: `A description of what the response format is for, used by the model to determine
  how to respond in the format.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Whether to enable strict schema adherence when generating the output. If set to
   * true, the model will always follow the exact schema defined in the `schema`
   * field. Only a subset of JSON Schema is supported when `strict` is `true`. To
   * learn more, read the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   */
  @ApiProperty({
    required: false,
    description: `Whether to enable strict schema adherence when generating the output. If set to
  true, the model will always follow the exact schema defined in the \`schema\`
  field. Only a subset of JSON Schema is supported when \`strict\` is \`true\`. To
  learn more, read the
  [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).`,
  })
  @IsOptional()
  strict?: null | false | true;
}
