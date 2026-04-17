import {
  IsArray, IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EphemeralMcpIntegrationDto } from '../../lm-studio/dto/chat.dto';
import { OpenAiEndpointPreference } from '../chat-metadata.schema';

export class CreateChatMetadataDto {
  @ApiProperty({ description: 'Human-readable name for this chat session' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'LLM model identifier used in this session' })
  @IsString()
  usedModel: string;

  @ApiProperty({ enum: ['OPENAI', 'LMSTUDIO'] })
  @IsIn(['OPENAI', 'LMSTUDIO'])
  client: 'OPENAI' | 'LMSTUDIO';

  @ApiProperty({
    description: 'Reasoning mode (e.g. off / low / medium / high / on)',
  })
  @IsString()
  reasoningMode: string;

  @ApiPropertyOptional({
    description: 'MCP integrations to associate with this session',
    type: [EphemeralMcpIntegrationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EphemeralMcpIntegrationDto)
  tools?: EphemeralMcpIntegrationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  useCrypto?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cryptoKey?: string;

  @ApiPropertyOptional({
    enum: OpenAiEndpointPreference,
  })
  @IsOptional()
  openAiEndpointPreference?: OpenAiEndpointPreference;
}
