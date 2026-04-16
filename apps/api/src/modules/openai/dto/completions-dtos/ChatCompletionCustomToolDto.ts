import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CustomDto } from './CustomDto';

export class ChatCompletionCustomToolDto {
  /** Properties of the custom tool. */
  @ApiProperty({
    description: `Properties of the custom tool.`,
    type: () => CustomDto,
  })
  @ValidateNested()
  @Type(() => CustomDto)
  custom!: CustomDto;

  /** The type of the custom tool. Always `custom`. */
  @ApiProperty({
    description: `The type of the custom tool. Always \`custom\`.`,
    type: 'string',
    enum: ['custom'],
  })
  @Equals('custom')
  type!: 'custom';
}
