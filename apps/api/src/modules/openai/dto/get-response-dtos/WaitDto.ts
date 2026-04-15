import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class WaitDto {
  /**
   * Specifies the event type. For a wait action, this property is always set to
   * `wait`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a wait action, this property is always set to
  \`wait\`.`,
    type: 'string',
    enum: ['wait'],
  })
  @Equals('wait')
  type!: 'wait';
}
