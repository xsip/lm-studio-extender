import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ChatCompletionFunctionMessageParamDto {
  /** The contents of the function message. */
  @ApiProperty({
    description: `The contents of the function message.`,
    type: 'string',
  })
  content!: null | string;

  /** The name of the function to call. */
  @ApiProperty({
    description: `The name of the function to call.`,
    type: 'string',
  })
  @IsString()
  name!: string;

  /** The role of the messages author, in this case `function`. */
  @ApiProperty({
    description: `The role of the messages author, in this case \`function\`.`,
    type: 'string',
    enum: ['function'],
  })
  @Equals('function')
  role!: 'function';
}
