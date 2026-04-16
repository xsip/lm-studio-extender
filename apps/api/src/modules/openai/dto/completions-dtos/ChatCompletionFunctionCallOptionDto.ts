import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatCompletionFunctionCallOptionDto {
  /** The name of the function to call. */
  @ApiProperty({
    description: `The name of the function to call.`,
    type: 'string',
  })
  @IsString()
  name!: string;
}
