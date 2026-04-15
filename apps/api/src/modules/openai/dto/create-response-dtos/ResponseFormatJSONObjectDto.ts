import { ApiProperty } from '@nestjs/swagger';
import { Equals } from 'class-validator';

export class ResponseFormatJSONObjectDto {
  /** The type of response format being defined. Always `json_object`. */
  @ApiProperty({
    description: `The type of response format being defined. Always \`json_object\`.`,
    example: 'json_object',
  })
  @Equals('json_object')
  type!: 'json_object';
}
