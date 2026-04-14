import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PendingSafetyCheckDto } from './PendingSafetyCheckDto';
import { ClickDto } from './ClickDto';
import { DoubleClickDto } from './DoubleClickDto';
import { DragDto } from './DragDto';
import { KeypressDto } from './KeypressDto';
import { MoveDto } from './MoveDto';
import { ScreenshotDto } from './ScreenshotDto';
import { ScrollDto } from './ScrollDto';
import { TypeDto } from './TypeDto';
import { WaitDto } from './WaitDto';
import { ArrayDto } from './ArrayDto';

export class ResponseComputerToolCallDto {
  /** The unique ID of the computer call. */
  @ApiProperty({ description: `The unique ID of the computer call.`, type: 'string' })
  @IsString()
  id!: string;

  /** An identifier used when responding to the tool call with output. */
  @ApiProperty({ description: `An identifier used when responding to the tool call with output.`, type: 'string' })
  @IsString()
  call_id!: string;

  /** The pending safety checks for the computer call. */
  @ApiProperty({ description: `The pending safety checks for the computer call.`, type: () => [PendingSafetyCheckDto], isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PendingSafetyCheckDto)
  pending_safety_checks!: PendingSafetyCheckDto[];

  /** The status of the item. One of `in_progress`, `completed`, or `incomplete`.
Populated when items are returned via API. */
  @ApiProperty({ description: `The status of the item. One of \`in_progress\`, \`completed\`, or \`incomplete\`.
Populated when items are returned via API.`, enum: ['in_progress', 'completed', 'incomplete'] })
  @IsIn(['in_progress', 'completed', 'incomplete'])
  status!: 'in_progress' | 'completed' | 'incomplete';

  /** The type of the computer call. Always `computer_call`. */
  @ApiProperty({ description: `The type of the computer call. Always \`computer_call\`.`, example: 'computer_call' })
  @Equals('computer_call')
  type!: 'computer_call';

  /** A click action. */
  @ApiProperty({ required: false, description: `A click action.` })
  @IsOptional()
  action?: ClickDto | DoubleClickDto | DragDto | KeypressDto | MoveDto | ScreenshotDto | ScrollDto | TypeDto | WaitDto;

  /** Flattened batched actions for `computer_use`. Each action includes an `type`
discriminator and action-specific fields. */
  @ApiProperty({ required: false, description: `Flattened batched actions for \`computer_use\`. Each action includes an \`type\`
discriminator and action-specific fields.`, type: () => ArrayDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArrayDto)
  actions?: ArrayDto;
}
