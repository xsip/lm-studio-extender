import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray } from 'class-validator';

export class KeypressDto {
  /**
   * The combination of keys the model is requesting to be pressed. This is an array
   * of strings, each representing a key.
   */
  @ApiProperty({
    description: `The combination of keys the model is requesting to be pressed. This is an array
  of strings, each representing a key.`,
    type: 'string',
    isArray: true,
  })
  @IsArray()
  keys!: string[];

  /**
   * Specifies the event type. For a keypress action, this property is always set to
   * `keypress`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a keypress action, this property is always set to
  \`keypress\`.`,
    type: 'string',
    enum: ['keypress'],
  })
  @Equals('keypress')
  type!: 'keypress';
}
