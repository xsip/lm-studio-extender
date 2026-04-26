import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Unified button component for the UI kit.
 *
 * Variants:
 *   primary   — solid accent fill (Send, Save …)
 *   secondary — border-only ghost  (Cancel, Refresh …)
 *   danger    — red border/text    (Delete …)
 *   ghost     — no border, text-only
 *
 * Sizes:
 *   xs  — text-[10px], compact (toolbar chips)
 *   sm  — text-xs (most buttons)
 *   md  — text-sm
 *
 * Usage:
 *   <ui-button variant="primary" [disabled]="…" (clicked)="…">Save</ui-button>
 *   <ui-button variant="secondary" size="xs" [active]="panel()">Chats</ui-button>
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      (click)="clicked.emit()"
      class="inline-flex relative items-center justify-center gap-1.5 font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed active:scale-[0.97] select-none"
      [class]="classes()"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant  = input<'primary' | 'secondary' | 'danger' | 'ghost'>('secondary');
  readonly size     = input<'xs' | 'sm' | 'md'>('sm');
  readonly disabled = input<boolean>(false);
  readonly active   = input<boolean>(false);
  readonly type     = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<void>();

  classes(): string {
    const size = this.size();
    const variant = this.variant();
    const active = this.active();
    const disabled = this.disabled();

    const sizes: Record<string, string> = {
      xs: 'px-2.5 py-1 text-[10px]',
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
    };

    const shadowStyle = 'shadow-depth-sm';
    const variants: Record<string, string> = {
      primary:   `bg-accent hover:bg-accent-hover active:bg-accent border-transparent text-white disabled:bg-surface-sunken disabled:text-text-muted rounded-xl transition-all duration-150 ${shadowStyle}`,
      secondary: active && !this.disabled()
        ? 'border-accent text-accent bg-accent-subtle hover:bg-accent/15 rounded-xl'
        : `border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary disabled:opacity-50 rounded-xl ${shadowStyle}`,
      danger: `border-error-border text-error-text hover:border-error-muted hover:bg-error-bg disabled:opacity-50 rounded-xl ${shadowStyle}`,
      ghost:  'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-overlay disabled:opacity-50 rounded-lg',
    };

    return `${sizes[size]} ${variants[variant]}`;
  }
}
