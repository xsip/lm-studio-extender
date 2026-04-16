import { ApiProperty } from '@nestjs/swagger';

import { ChatCompletionTokenLogprobDto } from './ChatCompletionTokenLogprobDto';

export class LogprobsDto {
  /** A list of message content tokens with log probability information. */
  @ApiProperty({
    description: `A list of message content tokens with log probability information.`,
    type: ChatCompletionTokenLogprobDto,
    isArray: true,
  })
  content!: null | ChatCompletionTokenLogprobDto[];

  /** A list of message refusal tokens with log probability information. */
  @ApiProperty({
    description: `A list of message refusal tokens with log probability information.`,
    type: ChatCompletionTokenLogprobDto,
    isArray: true,
  })
  refusal!: null | ChatCompletionTokenLogprobDto[];
}
