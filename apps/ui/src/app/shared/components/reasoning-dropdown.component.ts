import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChatRequestDto } from '../../client';

export interface ReasoningOption {
  value: ChatRequestDto.ReasoningEnum;
  label: string;
  icon: string;
}

export interface ModelReasoningCapability {
  allowed_options: Array<string>;
  default: string;
}

export const ALL_REASONING_OPTIONS: ReasoningOption[] = [
  { value: 'off',    label: 'Off',    icon: '○' },
  { value: 'low',    label: 'Low',    icon: '◔' },
  { value: 'medium', label: 'Medium', icon: '◑' },
  { value: 'high',   label: 'High',   icon: '◕' },
  { value: 'on',     label: 'On',     icon: '●' },
];

/**
 * Reusable reasoning-effort dropdown.
 * Shared between LM Studio and OpenAI chat-input components.
 *
 * Renders nothing when `modelReasoningCap` has no allowed options.
 *
 * Usage:
 *   <app-reasoning-dropdown
 *     [reasoning]="reasoning()"
 *     [modelReasoningCap]="modelReasoningCap()"
 *     (reasoningChanged)="onReasoningChanged($event)"
 *   />
 */
@Component({
  selector: 'app-reasoning-dropdown',
  animations: [
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(6px)', transformOrigin: 'bottom left' }),
        animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('130ms ease-in', style({ opacity: 0, transform: 'scale(0.94) translateY(4px)', transformOrigin: 'bottom left' })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    @if (reasoningOptions().length > 0) {
      <div class="relative">
        <button
          type="button"
          (click)="dropdownOpen.set(!dropdownOpen())"
          class="flex items-center gap-1.5 px-3 py-2 text-xs border rounded-xl select-none active:scale-[0.97] transition-all duration-150"
          [class]="reasoning()
            ? 'border-reasoning-border text-reasoning-text bg-reasoning-bg hover:border-reasoning-muted/60'
            : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary bg-surface-raised'"
          style="box-shadow: var(--shadow-sm);"
          [title]="'reasoning.label' | translate"
        >
          <span class="font-mono text-[11px] shrink-0">{{ currentReasoningOption()?.icon ?? '◈' }}</span>
          @if (reasoningLabel()) {
            <span class="tracking-wide font-medium text-[10px] uppercase">{{ reasoningLabel() }}</span>
          }
          <svg class="w-3 h-3 opacity-40 transition-transform duration-200" [class.rotate-180]="dropdownOpen()" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        @if (dropdownOpen()) {
          <div class="fixed inset-0 z-10" (click)="dropdownOpen.set(false)"></div>
          <div class="absolute bottom-full mb-2 left-0 z-20 min-w-[160px] bg-surface-raised border border-border-default rounded-2xl overflow-hidden py-1" @dropdownAnim
               style="box-shadow: var(--shadow-xl);">
            <div class="px-3 py-2 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-subtle font-semibold">{{ 'reasoning.label' | translate }}</div>
            @for (opt of reasoningOptions(); track opt.value) {
              <button
                type="button"
                (click)="selectReasoning(opt.value)"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs animate-slide-up active:scale-[0.98] transition-colors duration-100"
                [class]="reasoning() === opt.value
                  ? 'bg-reasoning-bg text-reasoning-text font-medium'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'"
              >
                <span class="font-mono text-[11px] w-4 text-center shrink-0">{{ opt.icon }}</span>
                <span class="tracking-wide">{{ opt.label }}</span>
                @if (modelReasoningCap()?.default === opt.value) {
                  <span class="ml-1 text-[10px] text-text-disabled italic">{{ 'reasoning.default' | translate }}</span>
                }
                @if (reasoning() === opt.value) {
                  <svg class="ml-auto w-3 h-3 text-reasoning-text" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                }
              </button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class ReasoningDropdownComponent {
  readonly reasoning        = input.required<string | undefined>();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();

  readonly reasoningChanged = output<ChatRequestDto.ReasoningEnum>();

  readonly dropdownOpen = signal(false);

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
    return opt.label.toUpperCase();
  });

  selectReasoning(value: ChatRequestDto.ReasoningEnum): void {
    this.reasoningChanged.emit(value);
    this.dropdownOpen.set(false);
  }
}
