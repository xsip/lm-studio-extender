import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConversationDto {
  /** The unique ID of the conversation that this response was associated with. */
  @ApiProperty({ description: `The unique ID of the conversation that this response was associated with.`, type: 'string' })
  @IsString()
  id!: string;
}
