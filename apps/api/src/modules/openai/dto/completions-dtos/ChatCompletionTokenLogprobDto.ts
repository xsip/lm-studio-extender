import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { TopLogprobDto } from './TopLogprobDto';

export class ChatCompletionTokenLogprobDto {
  /** The token. */
  @ApiProperty({
    description: `The token.`,
    type: 'string',
  })
  @IsString()
  token!: string;

  /**
   * A list of integers representing the UTF-8 bytes representation of the token.
   * Useful in instances where characters are represented by multiple tokens and
   * their byte representations must be combined to generate the correct text
   * representation. Can be `null` if there is no bytes representation for the token.
   */
  @ApiProperty({
    description: `A list of integers representing the UTF-8 bytes representation of the token.
  Useful in instances where characters are represented by multiple tokens and
  their byte representations must be combined to generate the correct text
  representation. Can be \`null\` if there is no bytes representation for the token.`,
    type: 'number',
    isArray: true,
  })
  bytes!: null | number[];

  /**
   * The log probability of this token, if it is within the top 20 most likely
   * tokens. Otherwise, the value `-9999.0` is used to signify that the token is very
   * unlikely.
   */
  @ApiProperty({
    description: `The log probability of this token, if it is within the top 20 most likely
  tokens. Otherwise, the value \`-9999.0\` is used to signify that the token is very
  unlikely.`,
    type: 'number',
  })
  @IsNumber()
  logprob!: number;

  /**
   * List of the most likely tokens and their log probability, at this token
   * position. In rare cases, there may be fewer than the number of requested
   * `top_logprobs` returned.
   */
  @ApiProperty({
    description: `List of the most likely tokens and their log probability, at this token
  position. In rare cases, there may be fewer than the number of requested
  \`top_logprobs\` returned.`,
    type: TopLogprobDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopLogprobDto)
  top_logprobs!: TopLogprobDto[];
}
