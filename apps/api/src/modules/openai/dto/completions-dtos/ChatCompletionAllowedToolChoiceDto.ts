import { ApiProperty } from '@nestjs/swagger';
import { Equals, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ChatCompletionAllowedToolsDto } from './ChatCompletionAllowedToolsDto';

export class ChatCompletionAllowedToolChoiceDto {
  /** Constrains the tools available to the model to a pre-defined set. */
  @ApiProperty({
    description: `Constrains the tools available to the model to a pre-defined set.`,
    type: () => ChatCompletionAllowedToolsDto,
  })
  @ValidateNested()
  @Type(() => ChatCompletionAllowedToolsDto)
  allowed_tools!: ChatCompletionAllowedToolsDto;

  /** Allowed tool configuration type. Always `allowed_tools`. */
  @ApiProperty({
    description: `Allowed tool configuration type. Always \`allowed_tools\`.`,
    type: 'string',
    enum: ['allowed_tools'],
  })
  @Equals('allowed_tools')
  type!: 'allowed_tools';
}
