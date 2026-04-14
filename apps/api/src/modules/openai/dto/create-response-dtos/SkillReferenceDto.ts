import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString } from 'class-validator';

export class SkillReferenceDto {
  /** The ID of the referenced skill. */
  @ApiProperty({ description: `The ID of the referenced skill.`, type: 'string' })
  @IsString()
  skill_id!: string;

  /** References a skill created with the /v1/skills endpoint. */
  @ApiProperty({ description: `References a skill created with the /v1/skills endpoint.`, example: 'skill_reference' })
  @Equals('skill_reference')
  type!: 'skill_reference';

  /** Optional skill version. Use a positive integer or 'latest'. Omit for default. */
  @ApiProperty({ required: false, description: `Optional skill version. Use a positive integer or 'latest'. Omit for default.`, type: 'string' })
  @IsOptional()
  @IsString()
  version?: string;
}
