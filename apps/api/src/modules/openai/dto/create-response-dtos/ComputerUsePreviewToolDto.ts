import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsNumber } from 'class-validator';

export class ComputerUsePreviewToolDto {
  /** The height of the computer display. */
  @ApiProperty({
    description: `The height of the computer display.`,
    type: 'number',
  })
  @IsNumber()
  display_height!: number;

  /** The width of the computer display. */
  @ApiProperty({
    description: `The width of the computer display.`,
    type: 'number',
  })
  @IsNumber()
  display_width!: number;

  /** The type of computer environment to control. */
  @ApiProperty({
    description: `The type of computer environment to control.`,
    enum: ['windows', 'mac', 'linux', 'ubuntu', 'browser'],
  })
  @IsIn(['windows', 'mac', 'linux', 'ubuntu', 'browser'])
  environment!: 'windows' | 'mac' | 'linux' | 'ubuntu' | 'browser';

  /** The type of the computer use tool. Always `computer_use_preview`. */
  @ApiProperty({
    description: `The type of the computer use tool. Always \`computer_use_preview\`.`,
    type: 'string',
    enum: ['computer_use_preview'],
  })
  @Equals('computer_use_preview')
  type!: 'computer_use_preview';
}
