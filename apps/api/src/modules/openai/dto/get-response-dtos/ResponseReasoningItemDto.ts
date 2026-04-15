import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SummaryDto } from './SummaryDto';
import { ContentDto } from './ContentDto';

export class ResponseReasoningItemDto {
  /** The unique identifier of the reasoning content. */
  @ApiProperty({
    description: `The unique identifier of the reasoning content.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** Reasoning summary content. */
  @ApiProperty({
    description: `Reasoning summary content.`,
    type: SummaryDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummaryDto)
  summary!: SummaryDto[];

  /** The type of the object. Always `reasoning`. */
  @ApiProperty({
    description: `The type of the object. Always \`reasoning\`.`,
    example: 'reasoning',
  })
  @Equals('reasoning')
  type!: 'reasoning';

  /** Reasoning text content. */
  @ApiProperty({
    required: false,
    description: `Reasoning text content.`,
    type: ContentDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  content?: ContentDto[];

  /**
   * The encrypted content of the reasoning item - populated when a response is
   * generated with `reasoning.encrypted_content` in the `include` parameter.
   */
  @ApiProperty({
    required: false,
    description: `The encrypted content of the reasoning item - populated when a response is
  generated with \`reasoning.encrypted_content\` in the \`include\` parameter.`,
    type: 'string',
  })
  @IsOptional()
  encrypted_content?: null | string;

  /**
   * The status of the item. One of `in_progress`, `completed`, or `incomplete`.
   * Populated when items are returned via API.
   */
  @ApiProperty({
    required: false,
    description: `The status of the item. One of \`in_progress\`, \`completed\`, or \`incomplete\`.
  Populated when items are returned via API.`,
    enum: ['in_progress', 'completed', 'incomplete'],
  })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'incomplete'])
  status?: 'in_progress' | 'completed' | 'incomplete';
}
