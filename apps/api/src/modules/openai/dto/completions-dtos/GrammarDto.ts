import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GrammarDto {
  /** Your chosen grammar. */
  @ApiProperty({
    description: `Your chosen grammar.`,
    type: () => GrammarDto,
  })
  @ValidateNested()
  @Type(() => GrammarDto)
  grammar!: GrammarDto;

  /** Grammar format. Always `grammar`. */
  @ApiProperty({
    description: `Grammar format. Always \`grammar\`.`,
    type: 'string',
    enum: ['grammar'],
  })
  @Equals('grammar')
  type!: 'grammar';
}
