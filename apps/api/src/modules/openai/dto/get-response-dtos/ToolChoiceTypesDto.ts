import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ToolChoiceTypesDto {
  /** The type of hosted tool the model should to use. Learn more about
[built-in tools](https://platform.openai.com/docs/guides/tools).

Allowed values are:

- `file_search`
- `web_search_preview`
- `computer`
- `computer_use_preview`
- `computer_use`
- `code_interpreter`
- `mcp`
- `image_generation` */
  @ApiProperty({ description: `The type of hosted tool the model should to use. Learn more about
[built-in tools](https://platform.openai.com/docs/guides/tools).

Allowed values are:

- \`file_search\`
- \`web_search_preview\`
- \`computer\`
- \`computer_use_preview\`
- \`computer_use\`
- \`code_interpreter\`
- \`mcp\`
- \`image_generation\``, enum: ['file_search', 'computer', 'computer_use_preview', 'mcp', 'code_interpreter', 'image_generation', 'web_search_preview', 'web_search_preview_2025_03_11', 'computer_use'] })
  @IsIn(['file_search', 'computer', 'computer_use_preview', 'mcp', 'code_interpreter', 'image_generation', 'web_search_preview', 'web_search_preview_2025_03_11', 'computer_use'])
  type!: 'file_search' | 'computer' | 'computer_use_preview' | 'mcp' | 'code_interpreter' | 'image_generation' | 'web_search_preview' | 'web_search_preview_2025_03_11' | 'computer_use';
}
