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
  return `<img data-auth-src="${href}"${altAttr}${titleAttr} src="" class="rounded-md max-w-full cursor-pointer transition-all ease-in-out duration-500 hover:scale-105" />`;
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

// ── ImageLightbox ─────────────────────────────────────────────────────────────
// A self-contained, singleton lightbox that lives on <body>.
// AuthImagesDirective calls ImageLightbox.open(fullSrcUrl) to display an image.
export class ImageLightbox {
  private static overlay: HTMLElement | null = null;
  private static blobUrl: string | null = null;

  static open(fullUrl: string, http: HttpClient): void {
    // Build the overlay lazily
    if (!this.overlay) {
      this.overlay = this.buildOverlay();
      document.body.appendChild(this.overlay);
    }

    const overlay = this.overlay;
    const img = overlay.querySelector<HTMLImageElement>('.lightbox-img')!;
    const spinner = overlay.querySelector<HTMLElement>('.lightbox-spinner')!;
    const errorMsg = overlay.querySelector<HTMLElement>('.lightbox-error')!;

    // Reset state
    img.src = '';
    img.style.opacity = '0';
    spinner.style.display = 'flex';
    errorMsg.style.display = 'none';
    overlay.style.display = 'flex';

    // Revoke previous blob to free memory
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }

    // Strip thumbnail param and fetch full image
    const url = new URL(fullUrl, window.location.origin);
    url.searchParams.delete('thumbnail');

    const token = localStorage.getItem('jwt_token') ?? '';

    http
      .get(url.toString(), {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (blob) => {
          const blobUrl = URL.createObjectURL(blob);
          this.blobUrl = blobUrl;
          img.src = blobUrl;
          img.onload = () => {
            spinner.style.display = 'none';
            img.style.opacity = '1';
          };
        },
        error: () => {
          spinner.style.display = 'none';
          errorMsg.style.display = 'flex';
        },
      });
  }

  static close(): void {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }
  }

  private static buildOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'auth-image-lightbox-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 24px;
      box-sizing: border-box;
      animation: lightbox-fade-in 0.2s ease;
    `;

    // Inject keyframe animation once
    if (!document.getElementById('lightbox-styles')) {
      const style = document.createElement('style');
      style.id = 'lightbox-styles';
      style.textContent = `
        @keyframes lightbox-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightbox-scale-in {
          from { transform: scale(0.93); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .auth-image-lightbox-overlay .lightbox-img {
          transition: opacity 0.2s ease;
          animation: lightbox-scale-in 0.25s ease;
        }
        .auth-image-lightbox-overlay .lightbox-close:hover {
          background: rgba(255,255,255,0.2) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.12);
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;
      z-index: 1;
    `;
    closeBtn.addEventListener('click', () => ImageLightbox.close());

    // Spinner
    const spinner = document.createElement('div');
    spinner.className = 'lightbox-spinner';
    spinner.style.cssText = `
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.7);
      font-size: 14px;
      gap: 10px;
    `;
    spinner.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style="animation: spin 0.8s linear infinite;">
        <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
        <path d="M14 3 A11 11 0 0 1 25 14" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      </svg>
      <span>Loading full image…</span>
    `;

    // Error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'lightbox-error';
    errorMsg.style.cssText = `
      display: none;
      align-items: center;
      gap: 8px;
      color: rgba(255, 120, 120, 0.9);
      font-size: 14px;
    `;
    errorMsg.innerHTML = `<span>⚠</span><span>Failed to load full image.</span>`;

    // Image element
    const img = document.createElement('img');
    img.className = 'lightbox-img';
    img.style.cssText = `
      max-width: 100%;
      max-height: calc(100vh - 48px);
      border-radius: 8px;
      object-fit: contain;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      opacity: 0;
      display: block;
    `;

    // Click on backdrop closes
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) ImageLightbox.close();
    });

    // Escape key closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') ImageLightbox.close();
    });

    overlay.appendChild(closeBtn);
    overlay.appendChild(spinner);
    overlay.appendChild(errorMsg);
    overlay.appendChild(img);

    return overlay;
  }
}

// ── AuthImagesDirective ───────────────────────────────────────────────────────
// Apply to any element that contains markdown-rendered HTML.
// It watches for new <img data-auth-src="..."> elements (including during
// streaming) and fetches them with the Authorization header, swapping in a
// blob URL so the browser can display them.
// Clicking a loaded image opens ImageLightbox with the full (non-thumbnail) URL.
@Directive({ selector: '[authImages]', standalone: true })
export class AuthImagesDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly http = inject(HttpClient);
  private observer: MutationObserver | null = null;
  private readonly blobUrls: string[] = [];
  private readonly clickListeners = new Map<HTMLImageElement, () => void>();

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
    // Remove click listeners
    this.clickListeners.forEach((listener, img) => {
      img.removeEventListener('click', listener);
    });
    this.clickListeners.clear();
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

          // Add click-to-expand listener (only once per image)
          if (!this.clickListeners.has(img)) {
            const listener = () => ImageLightbox.open(src, this.http);
            img.addEventListener('click', listener);
            this.clickListeners.set(img, listener);
          }
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
