import { Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-reset-button',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  template: `
    <ui-button variant="danger" (clicked)="clicked.emit()">{{ 'resetButton.reset' | translate }}</ui-button>
  `,
})
export class ResetButtonComponent {
  readonly clicked = output<void>();
}
