import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class TimeoutDto {
  /** The outcome type. Always `timeout`. */
  @ApiProperty({ description: `The outcome type. Always \`timeout\`.`, example: 'timeout' })
  @Equals('timeout')
  type!: 'timeout';
}
