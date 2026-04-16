import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { FunctionParametersDto } from './FunctionParametersDto';

export class _Inline_u05lxdDto {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  @ApiProperty({
    description: `The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
  underscores and dashes, with a maximum length of 64.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  @ApiProperty({
    required: false,
    description: `A description of what the function does, used by the model to choose when and
  how to call the function.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
   * and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   * 
   * Omitting `parameters` defines a function with an empty parameter list.
   */
  @ApiProperty({
    required: false,
    description: `The parameters the functions accepts, described as a JSON Schema object. See the
  [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
  and the
  [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
  documentation about the format.
  
  Omitting \`parameters\` defines a function with an empty parameter list.`,
    type: () => FunctionParametersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FunctionParametersDto)
  parameters?: FunctionParametersDto;
}
