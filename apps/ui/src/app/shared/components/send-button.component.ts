import { Component, input, output } from '@angular/core';
import { ButtonComponent } from './ui/button.component';

/**
 * Chat send button. Thin wrapper over ButtonComponent.
 * Kept for backwards compatibility with existing imports.
 */
@Component({
  selector: 'app-send-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <ui-button
      type="submit"
      variant="primary"
      [disabled]="disabled()"
    >
      {{ streaming() ? 'Streaming...' : 'Send' }}
    </ui-button>
  `,
})
export class SendButtonComponent {
  readonly disabled  = input<boolean>(false);
  readonly streaming = input<boolean>(false);
}
