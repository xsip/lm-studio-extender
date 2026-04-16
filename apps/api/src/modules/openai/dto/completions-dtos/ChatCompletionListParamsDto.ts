import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChatCompletionListParamsDto {
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
   * A list of metadata keys to filter the Chat Completions by. Example:
   * 
   * `metadata[key1]=value1&metadata[key2]=value2`
   */
  @ApiProperty({
    required: false,
    description: `A list of metadata keys to filter the Chat Completions by. Example:
  
  \`metadata[key1]=value1&metadata[key2]=value2\``,
  })
  @IsOptional()
  metadata?: null | any;

  /** The model used to generate the Chat Completions. */
  @ApiProperty({
    required: false,
    description: `The model used to generate the Chat Completions.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  model?: string;

  /**
   * Sort order for Chat Completions by timestamp. Use `asc` for ascending order or
   * `desc` for descending order. Defaults to `asc`.
   */
  @ApiProperty({
    required: false,
    description: `Sort order for Chat Completions by timestamp. Use \`asc\` for ascending order or
  \`desc\` for descending order. Defaults to \`asc\`.`,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
