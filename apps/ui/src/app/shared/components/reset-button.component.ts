import { Component, output } from '@angular/core';

/**
 * Reusable "Reset" button shown while a stream is in progress.
 *
 * Usage:
 *   @if (streaming()) {
 *     <app-reset-button (clicked)="onReset()" />
 *   }
 */
@Component({
  selector: 'app-reset-button',
  standalone: true,
  template: `
    <button
      type="button"
      (click)="clicked.emit()"
      class="px-4 py-1.5 text-xs tracking-widest uppercase border border-border-default hover:border-red-500 hover:text-red-400 text-text-muted rounded-lg transition-colors"
    >
      Reset
    </button>
  `,
})
export class ResetButtonComponent {
  readonly clicked = output<void>();
}
