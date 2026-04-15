import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { PathDto } from './PathDto';

export class DragDto {
  /**
   * An array of coordinates representing the path of the drag action. Coordinates
   * will appear as an array of objects, eg
   * 
   * ```
   * [
   *   { x: 100, y: 200 },
   *   { x: 200, y: 300 }
   * ]
   * ```
   */
  @ApiProperty({
    description: `An array of coordinates representing the path of the drag action. Coordinates
  will appear as an array of objects, eg
  
  \`\`\`
  [
    { x: 100, y: 200 },
    { x: 200, y: 300 }
  ]
  \`\`\``,
    type: PathDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PathDto)
  path!: PathDto[];

  /**
   * Specifies the event type. For a drag action, this property is always set to
   * `drag`.
   */
  @ApiProperty({
    description: `Specifies the event type. For a drag action, this property is always set to
  \`drag\`.`,
    example: 'drag',
  })
  @Equals('drag')
  type!: 'drag';

  /** The keys being held while dragging the mouse. */
  @ApiProperty({
    required: false,
    description: `The keys being held while dragging the mouse.`,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  keys?: null | string[];
}
