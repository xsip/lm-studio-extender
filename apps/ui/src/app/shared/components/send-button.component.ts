import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-send-button',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  template: `
    <ui-button
      type="submit"
      variant="primary"
      [disabled]="disabled()"
    >
      {{ (streaming() ? 'sendButton.streaming' : 'sendButton.send') | translate }}
    </ui-button>
  `,
})
export class SendButtonComponent {
  readonly disabled  = input<boolean>(false);
  readonly streaming = input<boolean>(false);
}
