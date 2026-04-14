import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuantizationDto {
  @ApiProperty({ nullable: true })
  name: string | null;

  @ApiProperty({ nullable: true })
  bits_per_weight: number | null;
}

export class LoadedInstanceConfigDto {
  @ApiProperty()
  context_length: number;

  @ApiPropertyOptional()
  eval_batch_size?: number;

  @ApiPropertyOptional()
  flash_attention?: boolean;

  @ApiPropertyOptional()
  num_experts?: number;

  @ApiPropertyOptional()
  offload_kv_cache_to_gpu?: boolean;
}

export class LoadedInstanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: LoadedInstanceConfigDto })
  config: LoadedInstanceConfigDto;
}

export class ModelCapabilitiesDto {
  @ApiProperty()
  vision: boolean;

  @ApiProperty()
  trained_for_tool_use: boolean;
}

export class ModelDto {
  @ApiProperty({ enum: ['llm', 'embedding'] })
  type: 'llm' | 'embedding';

  @ApiProperty()
  publisher: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  display_name: string;

  @ApiPropertyOptional({ nullable: true })
  architecture?: string | null;

  @ApiProperty({ type: QuantizationDto, nullable: true })
  quantization: QuantizationDto | null;

  @ApiProperty()
  size_bytes: number;

  @ApiProperty({ nullable: true })
  params_string: string | null;

  @ApiProperty({ type: [LoadedInstanceDto] })
  loaded_instances: LoadedInstanceDto[];

  @ApiProperty()
  max_context_length: number;

  @ApiProperty({ enum: ['gguf', 'mlx'], nullable: true })
  format: 'gguf' | 'mlx' | null;

  @ApiPropertyOptional({ type: ModelCapabilitiesDto })
  capabilities?: ModelCapabilitiesDto;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;
}

export class ModelsResponseDto {
  @ApiProperty({ type: [ModelDto] })
  models: ModelDto[];
}
