import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn } from 'class-validator';

export class ToolChoiceAllowedDto {
  /**
   * Constrains the tools available to the model to a pre-defined set.
   * 
   * `auto` allows the model to pick from among the allowed tools and generate a
   * message.
   * 
   * `required` requires the model to call one or more of the allowed tools.
   */
  @ApiProperty({
    description: `Constrains the tools available to the model to a pre-defined set.
  
  \`auto\` allows the model to pick from among the allowed tools and generate a
  message.
  
  \`required\` requires the model to call one or more of the allowed tools.`,
    enum: ['auto', 'required'],
  })
  @IsIn(['auto', 'required'])
  mode!: 'auto' | 'required';

  /**
   * A list of tool definitions that the model should be allowed to call.
   * 
   * For the Responses API, the list of tool definitions might look like:
   * 
   * ```json
   * [
   *   { "type": "function", "name": "get_weather" },
   *   { "type": "mcp", "server_label": "deepwiki" },
   *   { "type": "image_generation" }
   * ]
   * ```
   */
  @ApiProperty({
    description: `A list of tool definitions that the model should be allowed to call.
  
  For the Responses API, the list of tool definitions might look like:
  
  \`\`\`json
  [
    { "type": "function", "name": "get_weather" },
    { "type": "mcp", "server_label": "deepwiki" },
    { "type": "image_generation" }
  ]
  \`\`\``,
    isArray: true,
  })
  @IsArray()
  tools!: any[];

  /** Allowed tool configuration type. Always `allowed_tools`. */
  @ApiProperty({
    description: `Allowed tool configuration type. Always \`allowed_tools\`.`,
    type: 'string',
    enum: ['allowed_tools'],
  })
  @Equals('allowed_tools')
  type!: 'allowed_tools';
}
