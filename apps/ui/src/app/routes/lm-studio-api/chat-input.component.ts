import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChatRequestDto, ReasoningDto } from '../../client';
import { SendButtonComponent } from '../../shared/components/send-button.component';
import { ResetButtonComponent } from '../../shared/components/reset-button.component';
import {
  ReasoningDropdownComponent,
  ModelReasoningCapability,
  ALL_REASONING_OPTIONS,
  ReasoningOption,
} from '../../shared/components/reasoning-dropdown.component';

export { ALL_REASONING_OPTIONS } from '../../shared/components/reasoning-dropdown.component';
export type { ReasoningOption, ModelReasoningCapability } from '../../shared/components/reasoning-dropdown.component';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SendButtonComponent, ResetButtonComponent, ReasoningDropdownComponent],
  template: `
    <div class="shrink-0 border-t border-border-default px-4 py-4 bg-surface-raised" style="box-shadow: 0 -4px 16px rgba(0,0,0,0.06);">
      <form [formGroup]="form()" (ngSubmit)="submitted.emit()" class="flex flex-col gap-2">
        <textarea
          formControlName="input"
          rows="3"
          [placeholder]="'chatInput.placeholder' | translate"
          class="w-full bg-surface-base border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent transition-colors" style="box-shadow: var(--shadow-inset); min-height: 80px;"
          (keydown)="onKeydown($event)"
        ></textarea>

        <div class="flex items-center gap-2">
          <app-send-button [disabled]="form().invalid || streaming()" [streaming]="streaming()" />

          <app-reasoning-dropdown
            [reasoning]="reasoning()"
            [modelReasoningCap]="modelReasoningCap()"
            (reasoningChanged)="reasoningChanged.emit($event)"
          />

          @if (streaming()) {
            <app-reset-button (clicked)="reset.emit()" />
          }

          @if (form().get('input')?.invalid && form().get('input')?.touched) {
            <p class="text-xs text-red-400">{{ 'chatInput.promptRequired' | translate }}</p>
          }

          <span class="ml-auto text-[10px] text-text-muted hidden sm:block">{{ 'chatInput.hint' | translate }}</span>
        </div>
      </form>
    </div>
  `,
})
export class ChatInputComponent {
  readonly form             = input.required<FormGroup>();
  readonly streaming        = input.required<boolean>();
  readonly reasoning        = input.required<ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum | undefined>();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();

  readonly submitted       = output<void>();
  readonly reset           = output<void>();
  readonly reasoningChanged = output<ChatRequestDto.ReasoningEnum>();

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitted.emit();
    }
  }
}
