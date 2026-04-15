import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class TypeDto {
  /** The text to type. */
  @ApiProperty({
    description: `The text to type.`,
    type: 'string',
  })
  @IsString()
  text!: string;

  /**
   * Specifies the event type. For a type action, this property is always set to
   * `type`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a type action, this property is always set to
  \`type\`.`,
    example: 'type',
  })
  @Equals('type')
  type!: 'type';
}
