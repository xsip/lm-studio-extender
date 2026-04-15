import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class HybridSearchDto {
  /** The weight of the embedding in the reciprocal ranking fusion. */
  @ApiProperty({
    description: `The weight of the embedding in the reciprocal ranking fusion.`,
    type: 'number',
  })
  @IsNumber()
  embedding_weight!: number;

  /** The weight of the text in the reciprocal ranking fusion. */
  @ApiProperty({
    description: `The weight of the text in the reciprocal ranking fusion.`,
    type: 'number',
  })
  @IsNumber()
  text_weight!: number;
}
