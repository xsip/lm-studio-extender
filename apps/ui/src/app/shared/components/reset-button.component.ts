import { Component, output } from '@angular/core';
import { ButtonComponent } from './ui/button.component';

/**
 * Stream reset button. Thin wrapper over ButtonComponent.
 * Kept for backwards compatibility with existing imports.
 */
@Component({
  selector: 'app-reset-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <ui-button variant="danger" (clicked)="clicked.emit()">Reset</ui-button>
  `,
})
export class ResetButtonComponent {
  readonly clicked = output<void>();
}
