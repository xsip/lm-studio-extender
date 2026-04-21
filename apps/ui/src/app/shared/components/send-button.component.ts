import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable submit / send button for chat input forms.
 *
 * Usage:
 *   <app-send-button [disabled]="form.invalid || streaming()" [streaming]="streaming()" />
 *
 * The component is a presentational button — attach (click) or use inside a
 * form with type="submit".
 */
@Component({
  selector: 'app-send-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="submit"
      [disabled]="disabled()"
      class="px-5 py-1.5 text-xs font-semibold bg-accent hover:bg-accent-hover disabled:bg-surface-sunken disabled:text-text-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
    >
      {{ streaming() ? 'Streaming...' : 'Send' }}
    </button>
  `,
})
export class SendButtonComponent {
  readonly disabled  = input<boolean>(false);
  readonly streaming = input<boolean>(false);
}
