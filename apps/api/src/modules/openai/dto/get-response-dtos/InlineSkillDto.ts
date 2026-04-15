import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { InlineSkillSourceDto } from './InlineSkillSourceDto';

export class InlineSkillDto {
  /** The description of the skill. */
  @ApiProperty({
    description: `The description of the skill.`,
    type: 'string',
  })
  @IsString()
  description!: string;

  /** The name of the skill. */
  @ApiProperty({
    description: `The name of the skill.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** Inline skill payload */
  @ApiProperty({
    description: `Inline skill payload`,
    type: () => InlineSkillSourceDto,
  })
  @ValidateNested()
  @Type(() => InlineSkillSourceDto)
  source!: InlineSkillSourceDto;

  /** Defines an inline skill for this request. */
  @ApiProperty({
    description: `Defines an inline skill for this request.`,
    type: 'string',
    enum: ['inline'],
  })
  @Equals('inline')
  type!: 'inline';
}
