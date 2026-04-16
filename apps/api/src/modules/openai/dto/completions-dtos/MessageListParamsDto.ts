import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageListParamsDto {
  @ApiProperty({
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  after?: string;

  @ApiProperty({
    required: false,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  /**
   * Sort order for messages by timestamp. Use `asc` for ascending order or `desc`
   * for descending order. Defaults to `asc`.
   */
  @ApiProperty({
    required: false,
    description: `Sort order for messages by timestamp. Use \`asc\` for ascending order or \`desc\`
  for descending order. Defaults to \`asc\`.`,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
