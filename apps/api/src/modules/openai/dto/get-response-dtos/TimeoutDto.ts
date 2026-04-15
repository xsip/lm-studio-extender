import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class TimeoutDto {
  /** The outcome type. Always `timeout`. */
  @ApiProperty({
    description: `The outcome type. Always \`timeout\`.`,
    type: 'string',
    enum: ['timeout'],
  })
  @Equals('timeout')
  type!: 'timeout';
}
