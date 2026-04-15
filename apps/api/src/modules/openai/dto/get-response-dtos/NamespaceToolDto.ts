import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Equals, IsArray, IsString } from 'class-validator';

import { CustomToolDto } from './CustomToolDto';
import { _Inline_6nksgqDto } from './_Inline_6nksgqDto';

@ApiExtraModels(
  CustomToolDto,
  _Inline_6nksgqDto,
)
export class NamespaceToolDto {
  /** A description of the namespace shown to the model. */
  @ApiProperty({
    description: `A description of the namespace shown to the model.`,
    type: 'string',
  })
  @IsString()
  description!: string;

  /** The namespace name used in tool calls (for example, `crm`). */
  @ApiProperty({
    description: `The namespace name used in tool calls (for example, \`crm\`).`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** The function/custom tools available inside this namespace. */
  @ApiProperty({
    description: `The function/custom tools available inside this namespace.`,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(CustomToolDto) },
      { $ref: getSchemaPath(_Inline_6nksgqDto) },
    ],
  })
  @IsArray()
  tools!: (CustomToolDto | _Inline_6nksgqDto)[];

  /** The type of the tool. Always `namespace`. */
  @ApiProperty({
    description: `The type of the tool. Always \`namespace\`.`,
    type: 'string',
    enum: ['namespace'],
  })
  @Equals('namespace')
  type!: 'namespace';
}
