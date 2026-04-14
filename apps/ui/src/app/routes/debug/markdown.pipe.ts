import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, type TokenizerExtension, type RendererExtension } from 'marked';
import katex from 'katex';

// ── KaTeX extensions for marked ─────────────────────────────────────────────
// Must be registered before any parse call.

/** Block math: $$...$$ on its own line(s). */
const blockMathExtension: TokenizerExtension & RendererExtension = {
  name: 'blockMath',
  level: 'block',
  start(src: string) { return src.indexOf('$$'); },
  tokenizer(src: string) {
    const match = src.match(/^\$\$([\s\S]+?)\$\$/);
    if (match) {
      return { type: 'blockMath', raw: match[0], text: match[1].trim() };
    }
    return undefined;
  },
  renderer(token: any) {
    try {
      return `<div class="math-block">${katex.renderToString(token.text, { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="math-block math-error">${token.text}</div>`;
    }
  },
};

/** Inline math: $...$ not preceded/followed by another $. */
const inlineMathExtension: TokenizerExtension & RendererExtension = {
  name: 'inlineMath',
  level: 'inline',
  start(src: string) { return src.indexOf('$'); },
  tokenizer(src: string) {
    // Match $...$ but not $$
    const match = src.match(/^\$(?!\$)((?:[^$\\]|\\[\s\S])+?)\$/);
    if (match) {
      return { type: 'inlineMath', raw: match[0], text: match[1].trim() };
    }
    return undefined;
  },
  renderer(token: any) {
    try {
      return katex.renderToString(token.text, { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="math-error">${token.text}</span>`;
    }
  },
};

// ── Link renderer: open in new tab ──────────────────────────────────────────
const renderer = new marked.Renderer();
renderer.link = ({ href, title, text }) => {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.use({
  extensions: [blockMathExtension, inlineMathExtension],
  renderer,
});

// ── MarkdownPipe ─────────────────────────────────────────────────────────────
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    const html = marked.parse(value, { async: false }) as string;
    // KaTeX output contains inline styles and SVG which Angular's sanitizer
    // would strip. The content here is LLM output, not user-supplied HTML,
    // so bypassing is safe. marked itself never introduces script tags.
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

// ── StripMarkdownPipe ────────────────────────────────────────────────────────
@Pipe({ name: 'stripMarkdown', standalone: true })
export class StripMarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .replace(/\$\$[\s\S]*?\$\$/g, '')            // block math
      .replace(/\$(?!\$)((?:[^$\\]|\\[\s\S])+?)\$/g, '') // inline math
      .replace(/```[\s\S]*?```/g, '')               // fenced code blocks
      .replace(/`[^`]*`/g, '')                      // inline code
      .replace(/^#{1,6}\s+/gm, '')                  // headings
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')      // links → label
      .replace(/^[-*+]\s+/gm, '')                   // unordered list markers
      .replace(/^\d+\.\s+/gm, '')                   // ordered list markers
      .replace(/^>\s+/gm, '')                        // blockquotes
      .replace(/\n{2,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  }
}
