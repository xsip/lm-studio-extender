import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNumber, IsString } from 'class-validator';

export class ResponseOutputTextAnnotationAddedEventDto {
  /** The annotation object being added. (See annotation schema for details.) */
  @ApiProperty({ description: `The annotation object being added. (See annotation schema for details.)` })
  annotation!: unknown;

  /** The index of the annotation within the content part. */
  @ApiProperty({ description: `The index of the annotation within the content part.`, type: 'number' })
  @IsNumber()
  annotation_index!: number;

  /** The index of the content part within the output item. */
  @ApiProperty({ description: `The index of the content part within the output item.`, type: 'number' })
  @IsNumber()
  content_index!: number;

  /** The unique identifier of the item to which the annotation is being added. */
  @ApiProperty({ description: `The unique identifier of the item to which the annotation is being added.`, type: 'string' })
  @IsString()
  item_id!: string;

  /** The index of the output item in the response's output array. */
  @ApiProperty({ description: `The index of the output item in the response's output array.`, type: 'number' })
  @IsNumber()
  output_index!: number;

  /** The sequence number of this event. */
  @ApiProperty({ description: `The sequence number of this event.`, type: 'number' })
  @IsNumber()
  sequence_number!: number;

  /** The type of the event. Always 'response.output_text.annotation.added'. */
  @ApiProperty({ description: `The type of the event. Always 'response.output_text.annotation.added'.`, example: 'response.output_text.annotation.added' })
  @Equals('response.output_text.annotation.added')
  type!: 'response.output_text.annotation.added';
}
