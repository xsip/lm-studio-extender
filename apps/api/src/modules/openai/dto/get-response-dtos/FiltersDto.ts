import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FiltersDto {
  /**
   * Allowed domains for the search. If not provided, all domains are allowed.
   * Subdomains of the provided domains are allowed as well.
   * 
   * Example: `["pubmed.ncbi.nlm.nih.gov"]`
   */
  @ApiProperty({
    required: false,
    description: `Allowed domains for the search. If not provided, all domains are allowed.
  Subdomains of the provided domains are allowed as well.
  
  Example: \`["pubmed.ncbi.nlm.nih.gov"]\``,
    type: 'string',
    isArray: true,
  })
  @IsOptional()
  allowed_domains?: null | string[];
}
