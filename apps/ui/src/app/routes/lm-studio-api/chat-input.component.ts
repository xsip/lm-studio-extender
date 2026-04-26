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
    <div class="shrink-0 px-4 py-3 relative"
         style="background: var(--color-surface-raised); border-top: 1px solid var(--color-border-subtle); box-shadow: 0 -4px 20px rgba(0,0,0,0.06);">
      <form [formGroup]="form()" (ngSubmit)="submitted.emit()" class="flex flex-col gap-2.5">

        <!-- Textarea wrapper with glow effect on focus -->
        <div class="relative group">
          <textarea
            formControlName="input"
            rows="3"
            [placeholder]="'chatInput.placeholder' | translate"
            class="w-full bg-surface-base border border-border-default rounded-2xl px-4 py-3 text-sm text-text-primary placeholder-text-disabled resize-none focus:outline-none transition-all duration-200 leading-relaxed"
            style="box-shadow: var(--shadow-inset); min-height: 80px;"
            (keydown)="onKeydown($event)"
          ></textarea>
          <!-- Focus glow overlay -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-all duration-300"
               style="box-shadow: 0 0 0 2px var(--color-accent-glow);"></div>
        </div>

        <!-- Actions row -->
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
            <p class="text-xs text-error-text animate-slide-up">{{ 'chatInput.promptRequired' | translate }}</p>
          }

          <span class="ml-auto text-[10px] text-text-disabled hidden sm:block font-mono animate-fade-in">{{ 'chatInput.hint' | translate }}</span>
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
