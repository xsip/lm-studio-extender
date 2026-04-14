import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsIn, IsOptional, IsString } from 'class-validator';

export class _Inline_6nksgqDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'function' })
  @Equals('function')
  type!: 'function';

  /** Whether this function should be deferred and discovered via tool search. */
  @ApiProperty({ required: false, description: `Whether this function should be deferred and discovered via tool search.`, enum: [false, true] })
  @IsOptional()
  @IsIn([false, true])
  defer_loading?: false | true;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: null | string;

  @ApiProperty({ required: false })
  @IsOptional()
  parameters?: unknown;

  @ApiProperty({ required: false })
  @IsOptional()
  strict?: null | false | true;
}
