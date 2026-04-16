import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AudioDto {
  /** Unique identifier for a previous audio response from the model. */
  @ApiProperty({
    description: `Unique identifier for a previous audio response from the model.`,
    type: 'string',
  })
  @IsString()
  id!: string;
}
