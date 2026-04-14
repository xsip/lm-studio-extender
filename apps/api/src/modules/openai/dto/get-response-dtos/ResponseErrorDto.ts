import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class ResponseErrorDto {
  /** The error code for the response. */
  @ApiProperty({ description: `The error code for the response.`, enum: ['server_error', 'rate_limit_exceeded', 'invalid_prompt', 'vector_store_timeout', 'invalid_image', 'invalid_image_format', 'invalid_base64_image', 'invalid_image_url', 'image_too_large', 'image_too_small', 'image_parse_error', 'image_content_policy_violation', 'invalid_image_mode', 'image_file_too_large', 'unsupported_image_media_type', 'empty_image_file', 'failed_to_download_image', 'image_file_not_found'] })
  @IsIn(['server_error', 'rate_limit_exceeded', 'invalid_prompt', 'vector_store_timeout', 'invalid_image', 'invalid_image_format', 'invalid_base64_image', 'invalid_image_url', 'image_too_large', 'image_too_small', 'image_parse_error', 'image_content_policy_violation', 'invalid_image_mode', 'image_file_too_large', 'unsupported_image_media_type', 'empty_image_file', 'failed_to_download_image', 'image_file_not_found'])
  code!: 'server_error' | 'rate_limit_exceeded' | 'invalid_prompt' | 'vector_store_timeout' | 'invalid_image' | 'invalid_image_format' | 'invalid_base64_image' | 'invalid_image_url' | 'image_too_large' | 'image_too_small' | 'image_parse_error' | 'image_content_policy_violation' | 'invalid_image_mode' | 'image_file_too_large' | 'unsupported_image_media_type' | 'empty_image_file' | 'failed_to_download_image' | 'image_file_not_found';

  /** A human-readable description of the error. */
  @ApiProperty({ description: `A human-readable description of the error.`, type: 'string' })
  @IsString()
  message!: string;
}
