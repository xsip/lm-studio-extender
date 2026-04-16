import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DDto {
  /** The custom voice ID, e.g. `voice_1234`. */
  @ApiProperty({
    description: `The custom voice ID, e.g. \`voice_1234\`.`,
    type: 'string',
  })
  @IsString()
  id!: string;
}
