import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CustomToolInputFormatDto } from './CustomToolInputFormatDto';

export class CustomToolDto {
  /** The name of the custom tool, used to identify it in tool calls. */
  @ApiProperty({ description: `The name of the custom tool, used to identify it in tool calls.`, type: 'string' })
  @IsString()
  name!: string;

  /** The type of the custom tool. Always `custom`. */
  @ApiProperty({ description: `The type of the custom tool. Always \`custom\`.`, example: 'custom' })
  @Equals('custom')
  type!: 'custom';

  /** Whether this tool should be deferred and discovered via tool search. */
  @ApiProperty({ required: false, description: `Whether this tool should be deferred and discovered via tool search.`, enum: [false, true] })
  @IsOptional()
  @IsIn([false, true])
  defer_loading?: false | true;

  /** Optional description of the custom tool, used to provide more context. */
  @ApiProperty({ required: false, description: `Optional description of the custom tool, used to provide more context.`, type: 'string' })
  @IsOptional()
  @IsString()
  description?: string;

  /** The input format for the custom tool. Default is unconstrained text. */
  @ApiProperty({ required: false, description: `The input format for the custom tool. Default is unconstrained text.`, type: () => CustomToolInputFormatDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomToolInputFormatDto)
  format?: CustomToolInputFormatDto;
}
