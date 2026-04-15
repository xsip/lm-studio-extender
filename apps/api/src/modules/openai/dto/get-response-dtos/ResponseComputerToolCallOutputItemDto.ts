import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseComputerToolCallOutputScreenshotDto } from './ResponseComputerToolCallOutputScreenshotDto';
import { AcknowledgedSafetyCheckDto } from './AcknowledgedSafetyCheckDto';

export class ResponseComputerToolCallOutputItemDto {
  /** The unique ID of the computer call tool output. */
  @ApiProperty({
    description: `The unique ID of the computer call tool output.`,
    type: 'string',
  })
  @IsString()
  id!: string;

  /** The ID of the computer tool call that produced the output. */
  @ApiProperty({
    description: `The ID of the computer tool call that produced the output.`,
    type: 'string',
  })
  @IsString()
  call_id!: string;

  /** A computer screenshot image used with the computer use tool. */
  @ApiProperty({
    description: `A computer screenshot image used with the computer use tool.`,
    type: () => ResponseComputerToolCallOutputScreenshotDto,
  })
  @ValidateNested()
  @Type(() => ResponseComputerToolCallOutputScreenshotDto)
  output!: ResponseComputerToolCallOutputScreenshotDto;

  /**
   * The status of the message input. One of `in_progress`, `completed`, or
   * `incomplete`. Populated when input items are returned via API.
   */
  @ApiProperty({
    description: `The status of the message input. One of \`in_progress\`, \`completed\`, or
  \`incomplete\`. Populated when input items are returned via API.`,
    enum: ['in_progress', 'completed', 'incomplete', 'failed'],
  })
  @IsIn(['in_progress', 'completed', 'incomplete', 'failed'])
  status!: 'in_progress' | 'completed' | 'incomplete' | 'failed';

  /** The type of the computer tool call output. Always `computer_call_output`. */
  @ApiProperty({
    description: `The type of the computer tool call output. Always \`computer_call_output\`.`,
    example: 'computer_call_output',
  })
  @Equals('computer_call_output')
  type!: 'computer_call_output';

  /**
   * The safety checks reported by the API that have been acknowledged by the
   * developer.
   */
  @ApiProperty({
    required: false,
    description: `The safety checks reported by the API that have been acknowledged by the
  developer.`,
    type: AcknowledgedSafetyCheckDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcknowledgedSafetyCheckDto)
  acknowledged_safety_checks?: AcknowledgedSafetyCheckDto[];

  /** The identifier of the actor that created the item. */
  @ApiProperty({
    required: false,
    description: `The identifier of the actor that created the item.`,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  created_by?: string;
}
