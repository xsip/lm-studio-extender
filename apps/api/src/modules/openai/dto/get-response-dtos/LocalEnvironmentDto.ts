import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LocalSkillDto } from './LocalSkillDto';

export class LocalEnvironmentDto {
  /** Use a local computer environment. */
  @ApiProperty({
    description: `Use a local computer environment.`,
    example: 'local',
  })
  @Equals('local')
  type!: 'local';

  /** An optional list of skills. */
  @ApiProperty({
    required: false,
    description: `An optional list of skills.`,
    type: LocalSkillDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalSkillDto)
  skills?: LocalSkillDto[];
}
