import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsString } from 'class-validator';

export class FindDto {
  /** The pattern or text to search for within the page. */
  @ApiProperty({
    description: `The pattern or text to search for within the page.`,
    type: 'string',
  })
  @IsString()
  pattern!: string;

  /** The action type. */
  @ApiProperty({
    description: `The action type.`,
    type: 'string',
    enum: ['find_in_page'],
  })
  @Equals('find_in_page')
  type!: 'find_in_page';

  /** The URL of the page searched for the pattern. */
  @ApiProperty({
    description: `The URL of the page searched for the pattern.`,
    type: 'string',
  })
  @IsString()
  url!: string;
}
