import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ApplyPatchToolDto {
  /** The type of the tool. Always `apply_patch`. */
  @ApiProperty({
    description: `The type of the tool. Always \`apply_patch\`.`,
    type: 'string',
    enum: ['apply_patch'],
  })
  @Equals('apply_patch')
  type!: 'apply_patch';
}
