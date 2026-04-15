import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

import { TextDto } from './TextDto';
import { GrammarDto } from './GrammarDto';

@ApiExtraModels(
  TextDto,
  GrammarDto,
)
export class CustomToolDto {
  /** The name of the custom tool, used to identify it in tool calls. */
  @ApiProperty({
    description: `The name of the custom tool, used to identify it in tool calls.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** The type of the custom tool. Always `custom`. */
  @ApiProperty({
    description: `The type of the custom tool. Always \`custom\`.`,
    type: 'string',
    enum: ['custom'],
  })
  @Equals('custom')
  type!: 'custom';

  /** Whether this tool should be deferred and discovered via tool search. */
  @ApiProperty({
    required: false,
    description: `Whether this tool should be deferred and discovered via tool search.`,
  })
  @IsOptional()
  defer_loading?: false | true;

  /** Optional description of the custom tool, used to provide more context. */
  @ApiProperty({
    required: false,
    description: `Optional description of the custom tool, used to provide more context.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /** The input format for the custom tool. Default is unconstrained text. */
  @ApiProperty({
    required: false,
    description: `The input format for the custom tool. Default is unconstrained text.`,
    oneOf: [
      { $ref: getSchemaPath(TextDto) },
      { $ref: getSchemaPath(GrammarDto) },
    ],
  })
  @IsOptional()
  format?: TextDto | GrammarDto;
}
