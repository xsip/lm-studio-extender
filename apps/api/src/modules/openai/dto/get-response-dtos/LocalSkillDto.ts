import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocalSkillDto {
  /** The description of the skill. */
  @ApiProperty({ description: `The description of the skill.`, type: 'string' })
  @IsString()
  description!: string;

  /** The name of the skill. */
  @ApiProperty({ description: `The name of the skill.`, type: 'string' })
  @IsString()
  name!: string;

  /** The path to the directory containing the skill. */
  @ApiProperty({ description: `The path to the directory containing the skill.`, type: 'string' })
  @IsString()
  path!: string;
}
