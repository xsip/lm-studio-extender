import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CustomDto } from './CustomDto';

export class ChatCompletionNamedToolChoiceCustomDto {
  @ApiProperty({ type: () => CustomDto })
  @ValidateNested()
  @Type(() => CustomDto)
  custom!: CustomDto;

  /** For custom tool calling, the type is always `custom`. */
  @ApiProperty({
    description: `For custom tool calling, the type is always \`custom\`.`,
    type: 'string',
    enum: ['custom'],
  })
  @Equals('custom')
  type!: 'custom';
}
