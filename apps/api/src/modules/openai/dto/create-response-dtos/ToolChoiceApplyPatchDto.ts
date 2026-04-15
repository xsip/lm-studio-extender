import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ToolChoiceApplyPatchDto {
  /** The tool to call. Always `apply_patch`. */
  @ApiProperty({
    description: `The tool to call. Always \`apply_patch\`.`,
    type: 'string',
    enum: ['apply_patch'],
  })
  @Equals('apply_patch')
  type!: 'apply_patch';
}
