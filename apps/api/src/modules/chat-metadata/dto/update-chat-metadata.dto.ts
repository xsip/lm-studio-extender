import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EphemeralMcpIntegrationDto } from '../../lm-studio/dto/chat.dto';

export class UpdateChatMetadataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usedModel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reasoningMode?: string;

  @ApiPropertyOptional({ type: [EphemeralMcpIntegrationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EphemeralMcpIntegrationDto)
  tools?: EphemeralMcpIntegrationDto[];

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  lastMessageSentAt: Date;
}
