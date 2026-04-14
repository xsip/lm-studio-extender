import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ReasoningDto {
  /** Constrains effort on reasoning for
[reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
supported values are `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`.
Reducing reasoning effort can result in faster responses and fewer tokens used
on reasoning in a response.

- `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported
  reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool
  calls are supported for all reasoning values in gpt-5.1.
- All models before `gpt-5.1` default to `medium` reasoning effort, and do not
  support `none`.
- The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort.
- `xhigh` is supported for all models after `gpt-5.1-codex-max`. */
  @ApiProperty({ required: false, description: `Constrains effort on reasoning for
[reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
supported values are \`none\`, \`minimal\`, \`low\`, \`medium\`, \`high\`, and \`xhigh\`.
Reducing reasoning effort can result in faster responses and fewer tokens used
on reasoning in a response.

- \`gpt-5.1\` defaults to \`none\`, which does not perform reasoning. The supported
  reasoning values for \`gpt-5.1\` are \`none\`, \`low\`, \`medium\`, and \`high\`. Tool
  calls are supported for all reasoning values in gpt-5.1.
- All models before \`gpt-5.1\` default to \`medium\` reasoning effort, and do not
  support \`none\`.
- The \`gpt-5-pro\` model defaults to (and only supports) \`high\` reasoning effort.
- \`xhigh\` is supported for all models after \`gpt-5.1-codex-max\`.` })
  @IsOptional()
  effort?: null | 'low' | 'high' | 'none' | 'minimal' | 'medium' | 'xhigh';

  @ApiProperty({ required: false })
  @IsOptional()
  generate_summary?: null | 'auto' | 'concise' | 'detailed';

  /** A summary of the reasoning performed by the model. This can be useful for
debugging and understanding the model's reasoning process. One of `auto`,
`concise`, or `detailed`.

`concise` is supported for `computer-use-preview` models and all reasoning
models after `gpt-5`. */
  @ApiProperty({ required: false, description: `A summary of the reasoning performed by the model. This can be useful for
debugging and understanding the model's reasoning process. One of \`auto\`,
\`concise\`, or \`detailed\`.

\`concise\` is supported for \`computer-use-preview\` models and all reasoning
models after \`gpt-5\`.` })
  @IsOptional()
  summary?: null | 'auto' | 'concise' | 'detailed';
}
