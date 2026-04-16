import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsBoolean, IsString } from 'class-validator';

export class ChatCompletionDeletedDto {
  /** The ID of the chat completion that was deleted. */
  @ApiProperty({
    description: `The ID of the chat completion that was deleted.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** Whether the chat completion was deleted. */
  @ApiProperty({
    description: `Whether the chat completion was deleted.`,
    type: 'boolean',
  })
  @IsBoolean()
  deleted!: boolean;

  /** The type of object being deleted. */
  @ApiProperty({
    description: `The type of object being deleted.`,
    type: 'string',
    enum: ['chat.completion.deleted'],
  })
  @Equals('chat.completion.deleted')
  object!: 'chat.completion.deleted';
}
