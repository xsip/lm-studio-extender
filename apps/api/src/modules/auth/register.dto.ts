import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from './roles.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'admin', description: 'Unique username' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @ApiProperty({ example: 'hunter2', description: 'Password (min 8 chars)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'SUPER_SECRET_REGISTER_KEY',
    description: 'Server-side registration secret from env REGISTER_SECRET',
  })
  @IsString()
  registerSecret: string;

}
