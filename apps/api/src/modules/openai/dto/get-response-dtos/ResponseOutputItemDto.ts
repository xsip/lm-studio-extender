import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ResponseOutputItemDto {
  /** The unique ID of the output message. */
  @ApiProperty({ description: `The unique ID of the output message.`, type: 'string' })
  @IsString()
  id!: string;

  /** The type of the output message. Always `message`. */
  @ApiProperty({ description: `The type of the output message. Always \`message\`.`, example: 'message' })
  @Equals('message')
  type!: 'message';
}
