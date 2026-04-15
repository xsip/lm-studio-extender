import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ComputerToolDto {
  /** The type of the computer tool. Always `computer`. */
  @ApiProperty({
    description: `The type of the computer tool. Always \`computer\`.`,
    type: 'string',
    enum: ['computer'],
  })
  @Equals('computer')
  type!: 'computer';
}
