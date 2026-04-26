import {
  inject,
  Pipe,
  PipeTransform,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { marked, type TokenizerExtension, type RendererExtension } from 'marked';
import katex from 'katex';

// ── KaTeX extensions for marked ─────────────────────────────────────────────

/** Block math: $$...$$ on its own line(s). */
const blockMathExtension: TokenizerExtension & RendererExtension = {
  name: 'blockMath',
  level: 'block',
  start(src: string) {
    return src.indexOf('$$');
  },
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
  start(src: string) {
    return src.indexOf('$');
  },
  tokenizer(src: string) {
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

// ── Image renderer: defer auth images via data-auth-src ──────────────────────
// Instead of setting src directly (which would 401), we store the real URL in
// data-auth-src and leave src empty. AuthImagesDirective picks these up and
// replaces src with an authenticated blob URL.
renderer.image = ({ href, title, text }) => {
  if (!href) return '';
  const titleAttr = title ? ` title="${title}"` : '';
  const altAttr = text ? ` alt="${text}"` : '';
  return `<img data-auth-src="${href}"${altAttr}${titleAttr} src="" class="rounded-md max-w-full" />`;
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
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

// ── AuthImagesDirective ───────────────────────────────────────────────────────
// Apply to any element that contains markdown-rendered HTML.
// It watches for new <img data-auth-src="..."> elements (including during
// streaming) and fetches them with the Authorization header, swapping in a
// blob URL so the browser can display them.
@Directive({ selector: '[authImages]', standalone: true })
export class AuthImagesDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly http = inject(HttpClient);
  private observer: MutationObserver | null = null;
  private readonly blobUrls: string[] = [];

  ngOnInit() {
    // Process any images already in the DOM
    this.processImages(this.el.nativeElement);

    // Watch for new images added during streaming
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.processImages(node);
          }
        });
        // Also handle attribute changes in case src gets reset
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLImageElement &&
          (mutation.target as HTMLImageElement).dataset['authSrc']
        ) {
          this.loadImage(mutation.target as HTMLImageElement);
        }
      }
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    // Revoke blob URLs to free memory
    this.blobUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  private processImages(root: HTMLElement) {
    const imgs = root.querySelectorAll<HTMLImageElement>('img[data-auth-src]');
    imgs.forEach((img) => this.loadImage(img));
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset['authSrc'];
    // Skip if already loaded (blob URL set) or no src
    if (!src || img.src.startsWith('blob:')) return;

    // Get token however your app stores it
    const token = localStorage.getItem('jwt_token') ?? '';

    this.http
      .get(src, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (blob) => {
          const blobUrl = URL.createObjectURL(blob);
          this.blobUrls.push(blobUrl);
          img.src = blobUrl;
        },
        error: () => {
          img.alt = `Failed to load image: ${src}`;
        },
      });
  }
}

// ── StripMarkdownPipe ────────────────────────────────────────────────────────
@Pipe({ name: 'stripMarkdown', standalone: true })
export class StripMarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .replace(/\$(?!\$)((?:[^$\\]|\\[\s\S])+?)\$/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  }
}
