import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { TimeoutDto } from './TimeoutDto';
import { ExitDto } from './ExitDto';

@ApiExtraModels(
  TimeoutDto,
  ExitDto,
)
export class OutputDto {
  /**
   * Represents either an exit outcome (with an exit code) or a timeout outcome for a
   * shell call output chunk.
   */
  @ApiProperty({
    description: `Represents either an exit outcome (with an exit code) or a timeout outcome for a
  shell call output chunk.`,
    oneOf: [
      { $ref: getSchemaPath(TimeoutDto) },
      { $ref: getSchemaPath(ExitDto) },
    ],
  })
  outcome!: TimeoutDto | ExitDto;

  /** The standard error output that was captured. */
  @ApiProperty({
    description: `The standard error output that was captured.`,
    type: 'string',
  })
  @IsString()
  stderr!: string;

  /** The standard output that was captured. */
  @ApiProperty({
    description: `The standard output that was captured.`,
    type: 'string',
  })
  @IsString()
  stdout!: string;

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
