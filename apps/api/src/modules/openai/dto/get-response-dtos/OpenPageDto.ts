import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsOptional } from 'class-validator';

export class OpenPageDto {
  /** The action type. */
  @ApiProperty({
    description: `The action type.`,
    type: 'string',
    enum: ['open_page'],
  })
  @Equals('open_page')
  type!: 'open_page';

  /** The URL opened by the model. */
  @ApiProperty({
    required: false,
    description: `The URL opened by the model.`,
    type: 'string',
  })
  @IsOptional()
  url?: null | string;
}
