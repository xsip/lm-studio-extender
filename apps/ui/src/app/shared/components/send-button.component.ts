import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './ui/button.component';

@Component({
  selector: 'app-send-button',
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
  template: `
    <button
      type="submit"
      [disabled]="disabled()"
      class="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed group active:scale-[0.96] select-none"
      style="background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover)); box-shadow: 0 2px 12px var(--color-accent-glow);"
    >
      <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style="background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.10) 50%, transparent 70%);"></span>
      @if (streaming()) {
        <span class="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0"></span>
        <span>{{ 'sendButton.streaming' | translate }}</span>
      } @else {
        <svg class="w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5 animate-scale-in" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
        </svg>
        <span>{{ 'sendButton.send' | translate }}</span>
      }
    </button>
  `,
})
export class SendButtonComponent {
  readonly disabled  = input<boolean>(false);
  readonly streaming = input<boolean>(false);
}
