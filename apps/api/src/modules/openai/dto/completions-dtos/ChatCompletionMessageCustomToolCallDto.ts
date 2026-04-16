import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CustomDto } from './CustomDto';

export class ChatCompletionMessageCustomToolCallDto {
  /** The ID of the tool call. */
  @ApiProperty({
    description: `The ID of the tool call.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The custom tool that the model called. */
  @ApiProperty({
    description: `The custom tool that the model called.`,
    type: () => CustomDto,
  })
  @ValidateNested()
  @Type(() => CustomDto)
  custom!: CustomDto;

  /** The type of the tool. Always `custom`. */
  @ApiProperty({
    description: `The type of the tool. Always \`custom\`.`,
    type: 'string',
    enum: ['custom'],
  })
  @Equals('custom')
  type!: 'custom';
}
