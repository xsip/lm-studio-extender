import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TopLogprobDto {
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
}
