import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { ResponseFormatTextDto } from './ResponseFormatTextDto';
import { ResponseFormatTextJSONSchemaConfigDto } from './ResponseFormatTextJSONSchemaConfigDto';
import { ResponseFormatJSONObjectDto } from './ResponseFormatJSONObjectDto';

@ApiExtraModels(
  ResponseFormatTextDto,
  ResponseFormatTextJSONSchemaConfigDto,
  ResponseFormatJSONObjectDto,
)
export class ResponseTextConfigDto {
  /**
   * An object specifying the format that the model must output.
   * 
   * Configuring `{ "type": "json_schema" }` enables Structured Outputs, which
   * ensures the model will match your supplied JSON schema. Learn more in the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   * 
   * The default format is `{ "type": "text" }` with no additional options.
   * 
   * **Not recommended for gpt-4o and newer models:**
   * 
   * Setting to `{ "type": "json_object" }` enables the older JSON mode, which
   * ensures the message the model generates is valid JSON. Using `json_schema` is
   * preferred for models that support it.
   */
  @ApiProperty({
    required: false,
    description: `An object specifying the format that the model must output.
  
  Configuring \`{ "type": "json_schema" }\` enables Structured Outputs, which
  ensures the model will match your supplied JSON schema. Learn more in the
  [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
  
  The default format is \`{ "type": "text" }\` with no additional options.
  
  **Not recommended for gpt-4o and newer models:**
  
  Setting to \`{ "type": "json_object" }\` enables the older JSON mode, which
  ensures the message the model generates is valid JSON. Using \`json_schema\` is
  preferred for models that support it.`,
    oneOf: [
      { $ref: getSchemaPath(ResponseFormatTextDto) },
      { $ref: getSchemaPath(ResponseFormatTextJSONSchemaConfigDto) },
      { $ref: getSchemaPath(ResponseFormatJSONObjectDto) },
    ],
  })
  @IsOptional()
  format?: ResponseFormatTextDto | ResponseFormatTextJSONSchemaConfigDto | ResponseFormatJSONObjectDto;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in
   * more concise responses, while higher values will result in more verbose
   * responses. Currently supported values are `low`, `medium`, and `high`.
   */
  @ApiProperty({
    required: false,
    description: `Constrains the verbosity of the model's response. Lower values will result in
  more concise responses, while higher values will result in more verbose
  responses. Currently supported values are \`low\`, \`medium\`, and \`high\`.`,
    enum: ['low', 'high', 'medium'],
  })
  @IsOptional()
  @IsIn(['low', 'high', 'medium'])
  verbosity?: null | 'low' | 'high' | 'medium';
}
