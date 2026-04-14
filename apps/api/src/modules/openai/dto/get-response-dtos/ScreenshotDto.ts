import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ScreenshotDto {
  /** Specifies the event type. For a screenshot action, this property is always set
to `screenshot`. */
  @ApiProperty({ description: `Specifies the event type. For a screenshot action, this property is always set
to \`screenshot\`.`, example: 'screenshot' })
  @Equals('screenshot')
  type!: 'screenshot';
}
