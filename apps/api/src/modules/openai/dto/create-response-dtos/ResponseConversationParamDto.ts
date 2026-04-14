import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseConversationParamDto {
  /** The unique ID of the conversation. */
  @ApiProperty({ description: `The unique ID of the conversation.`, type: 'string' })
  @IsString()
  id!: string;
}
