import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class ResponseOutputRefusalDto {
  /** The refusal explanation from the model. */
  @ApiProperty({
    description: `The refusal explanation from the model.`,
    type: 'string',
  })
  @IsString()
  refusal!: string;

  /** The type of the refusal. Always `refusal`. */
  @ApiProperty({
    description: `The type of the refusal. Always \`refusal\`.`,
    type: 'string',
    enum: ['refusal'],
  })
  @Equals('refusal')
  type!: 'refusal';
}
