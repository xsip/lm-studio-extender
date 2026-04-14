import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ResponseComputerToolCallOutputScreenshotDto } from './ResponseComputerToolCallOutputScreenshotDto';
import { AcknowledgedSafetyCheckDto } from './AcknowledgedSafetyCheckDto';

export class ComputerCallOutputDto {
  /** The ID of the computer tool call that produced the output. */
  @ApiProperty({ description: `The ID of the computer tool call that produced the output.`, type: 'string' })
  @IsString()
  call_id!: string;

  /** A computer screenshot image used with the computer use tool. */
  @ApiProperty({ description: `A computer screenshot image used with the computer use tool.`, type: () => ResponseComputerToolCallOutputScreenshotDto })
  @ValidateNested()
  @Type(() => ResponseComputerToolCallOutputScreenshotDto)
  output!: ResponseComputerToolCallOutputScreenshotDto;

  /** The type of the computer tool call output. Always `computer_call_output`. */
  @ApiProperty({ description: `The type of the computer tool call output. Always \`computer_call_output\`.`, example: 'computer_call_output' })
  @Equals('computer_call_output')
  type!: 'computer_call_output';

  /** The ID of the computer tool call output. */
  @ApiProperty({ required: false, description: `The ID of the computer tool call output.` })
  @IsOptional()
  id?: null | string;

  /** The safety checks reported by the API that have been acknowledged by the
developer. */
  @ApiProperty({ required: false, description: `The safety checks reported by the API that have been acknowledged by the
developer.` })
  @IsOptional()
  acknowledged_safety_checks?: null | AcknowledgedSafetyCheckDto[];

  /** The status of the message input. One of `in_progress`, `completed`, or
`incomplete`. Populated when input items are returned via API. */
  @ApiProperty({ required: false, description: `The status of the message input. One of \`in_progress\`, \`completed\`, or
\`incomplete\`. Populated when input items are returned via API.` })
  @IsOptional()
  status?: null | 'in_progress' | 'completed' | 'incomplete';
}
