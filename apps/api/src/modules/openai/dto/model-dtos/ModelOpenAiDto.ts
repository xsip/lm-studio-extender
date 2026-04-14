import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ModelOpenAiDto {
  /** The model identifier, which can be referenced in the API endpoints. */
  @ApiProperty({ description: `The model identifier, which can be referenced in the API endpoints.`, type: 'string' })
  @IsString()
  id!: string;

  /** The Unix timestamp (in seconds) when the model was created. */
  @ApiProperty({ description: `The Unix timestamp (in seconds) when the model was created.`, type: 'number' })
  @IsNumber()
  created!: number;

  /** The object type, which is always "model". */
  @ApiProperty({ description: `The object type, which is always "model".`, example: 'model' })
  @Equals('model')
  object!: 'model';

  /** The organization that owns the model. */
  @ApiProperty({ description: `The organization that owns the model.`, type: 'string' })
  @IsString()
  owned_by!: string;
}
