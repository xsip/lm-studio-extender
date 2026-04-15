import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsString } from 'class-validator';

export class GrammarDto {
  /** The grammar definition. */
  @ApiProperty({
    description: `The grammar definition.`,
    type: 'string',
  })
  @IsString()
  definition!: string;

  /** The syntax of the grammar definition. One of `lark` or `regex`. */
  @ApiProperty({
    description: `The syntax of the grammar definition. One of \`lark\` or \`regex\`.`,
    enum: ['lark', 'regex'],
  })
  @IsIn(['lark', 'regex'])
  syntax!: 'lark' | 'regex';

  /** Grammar format. Always `grammar`. */
  @ApiProperty({
    description: `Grammar format. Always \`grammar\`.`,
    type: 'string',
    enum: ['grammar'],
  })
  @Equals('grammar')
  type!: 'grammar';
}
