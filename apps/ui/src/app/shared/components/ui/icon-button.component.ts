import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Square icon-only button used in toolbars, panel toggles, close buttons.
 *
 * Usage:
 *   <ui-icon-button title="Close" (clicked)="close()">
 *     <svg …></svg>
 *   </ui-icon-button>
 *
 *   <ui-icon-button [active]="panelOpen()" title="Info" (clicked)="toggle()">
 *     <svg …></svg>
 *   </ui-icon-button>
 */
@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [title]="title()"
      (click)="clicked.emit()"
      class="inline-flex items-center justify-center border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-90 select-none transition-all duration-150"
      [class]="_classes()"
    >
      <ng-content />
    </button>
  `,
})
export class IconButtonComponent {
  readonly size = input<'sm' | 'md'>('md');
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly title = input<string>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly classes = input<string>('');
  readonly clicked = output<void>();

  _classes(): string {
    const s = this.size() === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
    return (
      (this.active()
        ? `${s} border-accent text-accent bg-accent-subtle shadow-depth-sm rounded-xl`
        : `${s} border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary shadow-depth-sm rounded-xl`) +
      this.classes()
    );
  }
}
