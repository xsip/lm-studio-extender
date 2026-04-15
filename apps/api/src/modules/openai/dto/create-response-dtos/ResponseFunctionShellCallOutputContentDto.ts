import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { TimeoutDto } from './TimeoutDto';
import { ExitDto } from './ExitDto';

@ApiExtraModels(
  TimeoutDto,
  ExitDto,
)
export class ResponseFunctionShellCallOutputContentDto {
  /** The exit or timeout outcome associated with this shell call. */
  @ApiProperty({
    description: `The exit or timeout outcome associated with this shell call.`,
    oneOf: [
      { $ref: getSchemaPath(TimeoutDto) },
      { $ref: getSchemaPath(ExitDto) },
    ],
  })
  outcome!: TimeoutDto | ExitDto;

  /** Captured stderr output for the shell call. */
  @ApiProperty({
    description: `Captured stderr output for the shell call.`,
    type: 'string',
  })
  @IsString()
  stderr!: string;

  /** Captured stdout output for the shell call. */
  @ApiProperty({
    description: `Captured stdout output for the shell call.`,
    type: 'string',
  })
  @IsString()
  stdout!: string;
}
