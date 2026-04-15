import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StreamOptionsDto {
  /**
   * When true, stream obfuscation will be enabled. Stream obfuscation adds random
   * characters to an `obfuscation` field on streaming delta events to normalize
   * payload sizes as a mitigation to certain side-channel attacks. These obfuscation
   * fields are included by default, but add a small amount of overhead to the data
   * stream. You can set `include_obfuscation` to false to optimize for bandwidth if
   * you trust the network links between your application and the OpenAI API.
   */
  @ApiProperty({
    required: false,
    description: `When true, stream obfuscation will be enabled. Stream obfuscation adds random
  characters to an \`obfuscation\` field on streaming delta events to normalize
  payload sizes as a mitigation to certain side-channel attacks. These obfuscation
  fields are included by default, but add a small amount of overhead to the data
  stream. You can set \`include_obfuscation\` to false to optimize for bandwidth if
  you trust the network links between your application and the OpenAI API.`,
  })
  @IsOptional()
  include_obfuscation?: false | true;
}
