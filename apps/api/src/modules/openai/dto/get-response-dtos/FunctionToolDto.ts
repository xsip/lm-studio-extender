import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class FunctionToolDto {
  /** The name of the function to call. */
  @ApiProperty({
    description: `The name of the function to call.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** A JSON schema object describing the parameters of the function. */
  @ApiProperty({ description: `A JSON schema object describing the parameters of the function.` })
  parameters!: null | any;

  /** Whether to enforce strict parameter validation. Default `true`. */
  @ApiProperty({ description: `Whether to enforce strict parameter validation. Default \`true\`.` })
  strict!: null | false | true;

  /** The type of the function tool. Always `function`. */
  @ApiProperty({
    description: `The type of the function tool. Always \`function\`.`,
    example: 'function',
  })
  @Equals('function')
  type!: 'function';

  /** Whether this function is deferred and loaded via tool search. */
  @ApiProperty({
    required: false,
    description: `Whether this function is deferred and loaded via tool search.`,
  })
  @IsOptional()
  defer_loading?: false | true;

  /**
   * A description of the function. Used by the model to determine whether or not to
   * call the function.
   */
  @ApiProperty({
    required: false,
    description: `A description of the function. Used by the model to determine whether or not to
  call the function.`,
    type: 'string',
  })
  @IsOptional()
  description?: null | string;
}
