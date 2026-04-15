import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatRequestDto, ReasoningDto } from '../../client';
import { ModelReasoningCapability } from './model-selector.component';

export interface ReasoningOption {
  value: ChatRequestDto.ReasoningEnum;
  label: string;
  icon: string;
}

export const ALL_REASONING_OPTIONS: ReasoningOption[] = [
  { value: 'off', label: 'Off', icon: '○' },
  { value: 'low', label: 'Low', icon: '◔' },
  { value: 'medium', label: 'Medium', icon: '◑' },
  { value: 'high', label: 'High', icon: '◕' },
  { value: 'on', label: 'On', icon: '●' },
];

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="shrink-0 border-t border-border-default px-4 py-3 bg-surface-raised">
      <form [formGroup]="form()" (ngSubmit)="submitted.emit()" class="flex flex-col gap-2">
        <textarea
          formControlName="input"
          rows="3"
          placeholder="Enter your prompt..."
          class="w-full bg-surface-base border border-border-default rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          (keydown)="onKeydown($event)"
        ></textarea>

        <div class="flex items-center gap-2">
          <button
            type="submit"
            [disabled]="form().invalid || streaming()"
            class="px-5 py-1.5 text-xs font-semibold bg-accent hover:bg-accent-hover disabled:bg-surface-sunken disabled:text-text-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {{ streaming() ? 'Streaming...' : 'Send' }}
          </button>

          @if (reasoningOptions().length > 0) {
            <div class="relative">
              <button
                type="button"
                (click)="reasoningDropdownOpen.set(!reasoningDropdownOpen())"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors select-none"
                [class]="
                  reasoning()
                    ? 'border-reasoning-border text-reasoning-text bg-reasoning-bg hover:border-reasoning-muted'
                    : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
                "
                title="Reasoning effort"
              >
                <span class="font-mono text-[11px] shrink-0">{{ currentReasoningOption()?.icon ?? '◈' }}</span>
                <span class="tracking-widest uppercase">{{ reasoningLabel() }}</span>
                <svg
                  class="w-3 h-3 opacity-50 transition-transform"
                  [class.rotate-180]="reasoningDropdownOpen()"
                  fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (reasoningDropdownOpen()) {
                <div class="fixed inset-0 z-10" (click)="reasoningDropdownOpen.set(false)"></div>
                <div class="absolute bottom-full mb-1.5 left-0 z-20 min-w-[150px] bg-surface-raised border border-border-default rounded-lg shadow-2xl shadow-black/60 overflow-hidden py-1">
                  <div class="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-default">Reasoning</div>
                  @for (opt of reasoningOptions(); track opt.value) {
                    <button
                      type="button"
                      (click)="selectReasoning(opt.value)"
                      class="w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors"
                      [class]="
                        reasoning() === opt.value
                          ? 'bg-reasoning-bg text-reasoning-text font-medium'
                          : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
                      "
                    >
                      <span class="font-mono text-[11px] w-3 text-center shrink-0">{{ opt.icon }}</span>
                      <span class="tracking-wide">{{ opt.label }}</span>
                      @if (modelReasoningCap()?.default === opt.value) {
                        <span class="ml-1 text-[10px] text-text-muted italic">default</span>
                      }
                      @if (reasoning() === opt.value) {
                        <span class="ml-auto text-reasoning-text">✓</span>
                      }
                    </button>
                  }
                </div>
              }
            </div>
          }

          @if (streaming()) {
            <button
              type="button"
              (click)="reset.emit()"
              class="px-4 py-1.5 text-xs tracking-widest uppercase border border-border-default hover:border-red-500 hover:text-red-400 text-text-muted rounded-lg transition-colors"
            >
              Reset
            </button>
          }

          @if (form().get('input')?.invalid && form().get('input')?.touched) {
            <p class="text-xs text-red-400">Prompt is required.</p>
          }

          <span class="ml-auto text-[10px] text-text-muted hidden sm:block">Enter to send · Shift+Enter for newline</span>
        </div>
      </form>
    </div>
  `,
})
export class ChatInputComponent {
  readonly form = input.required<FormGroup>();
  readonly streaming = input.required<boolean>();
  readonly reasoning = input.required<ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum |  undefined>();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();

  readonly submitted = output<void>();
  readonly reset = output<void>();
  readonly reasoningChanged = output<ChatRequestDto.ReasoningEnum>();

  readonly reasoningDropdownOpen = signal(false);

  readonly reasoningOptions = computed<ReasoningOption[]>(() => {
    const allowed = this.modelReasoningCap()?.allowed_options;
    if (!allowed?.length) return [];
    return ALL_REASONING_OPTIONS.filter((o) => allowed.includes(o.value));
  });

  readonly currentReasoningOption = computed(() => {
    const current = this.reasoning();
    return this.reasoningOptions().find((o) => o.value === current) ?? null;
  });

  readonly reasoningLabel = computed(() => {
    const opt = this.currentReasoningOption();
    if (!opt) return null;
    return `Reasoning: ${opt.label.toUpperCase()}`;
  });

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitted.emit();
    }
  }

  selectReasoning(value: ChatRequestDto.ReasoningEnum): void {
    this.reasoningChanged.emit(value);
    this.reasoningDropdownOpen.set(false);
  }
}
