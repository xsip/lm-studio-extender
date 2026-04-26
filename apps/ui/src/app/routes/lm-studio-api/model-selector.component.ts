import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModelDto } from '../../client';
import { SpinnerComponent } from '../../shared/components/spinner.component';

export type { ModelReasoningCapability } from '../../shared/components/reasoning-dropdown.component';

@Component({
  selector: 'app-model-selector',
  animations: [
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.94) translateY(-6px)', transformOrigin: 'top right' }),
        animate('220ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-4px)', transformOrigin: 'top right' })),
      ]),
    ]),
  ],
  imports: [CommonModule, TranslateModule, SpinnerComponent],
  template: `
    <div class="group/model-btn relative">
      <button
        type="button"
        (click)="!hasChatOpen() && dropdownOpen.set(!dropdownOpen())"
        class="flex items-center gap-2 px-3 py-1.5 text-xs border rounded-xl max-w-[260px] active:scale-[0.97] select-none transition-all duration-150"
        [class]="hasChatOpen()
          ? 'border-border-default text-text-disabled cursor-not-allowed opacity-60'
          : selectedModel()
            ? 'border-border-default text-text-secondary hover:border-accent/50 hover:text-text-primary bg-surface-raised'
            : 'border-warn-border text-warn-text bg-warn-bg'"
        style="box-shadow: var(--shadow-sm);"
      >
        @if (modelsLoading()) {
          <app-spinner />
        } @else {
          <svg class="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.213c-1.444 0-2.414-1.798-1.414-2.798L4.6 15.3"/>
          </svg>
        }
        <span class="truncate text-[11px] tracking-wide font-medium">{{ selectedModel() ? modelLabel() : ('modelSelector.selectModel' | translate) }}</span>
        @if (selectedModel()?.capabilities?.trained_for_tool_use) {
          <svg class="w-3 h-3 shrink-0 text-tertiary-accent opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" [attr.title]="'modelSelector.toolUse' | translate">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.292-8.914a2.25 2.25 0 00-3.182 0l-1.83 1.83a2.25 2.25 0 000 3.182l.182.182"/>
          </svg>
        }
        <svg
          class="w-3 h-3 opacity-40 shrink-0 transition-transform duration-200"
          [class.rotate-180]="dropdownOpen()"
          fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      @if (dropdownOpen()) {
        <div class="fixed inset-0 z-10" (click)="dropdownOpen.set(false)"></div>
        <div class="absolute top-full mt-2 right-0 z-20 min-w-[280px] max-w-[360px] bg-surface-raised border border-border-default rounded-2xl overflow-hidden py-1" @dropdownAnim
             style="box-shadow: var(--shadow-xl);">
          <div class="px-3 py-2 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-subtle font-semibold">{{ 'modelSelector.label' | translate }}</div>
          @if (models().length === 0 && !modelsLoading()) {
            <div class="px-4 py-4 text-xs text-text-muted italic text-center">{{ 'modelSelector.noModels' | translate }}</div>
          }
          @for (m of models(); track m.key) {
            <button
              type="button"
              (click)="onSelect(m)"
              class="w-full flex items-start gap-2.5 px-3 py-2.5 text-xs text-left animate-slide-up hover:pl-4 transition-all duration-150"
              [class]="selectedModel()?.key === m.key
                ? 'bg-accent-subtle text-accent-text'
                : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'"
            >
              <span
                class="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                [class]="m.loaded_instances.length > 0 ? 'bg-success-muted' : 'bg-text-disabled'"
                [style]="m.loaded_instances.length > 0 ? 'box-shadow: 0 0 6px var(--color-success-muted);' : ''"
              ></span>
              <div class="flex flex-col gap-0.5 min-w-0 flex-1">
                <span class="text-[11px] truncate leading-tight font-medium">{{ m.key }}</span>
                @if (m.display_name && m.display_name !== m.key) {
                  <span class="text-[10px] text-text-muted truncate leading-tight">{{ m.display_name }}</span>
                }
                <span class="text-[10px] text-text-muted leading-tight">
                  {{ m.params_string ?? '' }}{{ m.params_string && m.quantization ? ' · ' : '' }}{{ m.quantization?.name ?? '' }}
                </span>
              </div>
              @if (selectedModel()?.key === m.key) {
                <svg class="w-3.5 h-3.5 text-accent shrink-0 mt-0.5 animate-scale-in" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              }
            </button>
          }
        </div>
      }

      @if (hasChatOpen()) {
        <div class="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 hidden group-hover/model-btn:flex whitespace-nowrap px-2.5 py-1.5 text-[10px] text-text-secondary bg-surface-overlay border border-border-default rounded-xl shadow-lg">
          {{ 'modelSelector.cannotSwitch' | translate }}
        </div>
      }
    </div>
  `,
})
export class ModelSelectorComponent {
  readonly models        = input.required<ModelDto[]>();
  readonly modelsLoading = input.required<boolean>();
  readonly selectedModel = input.required<ModelDto | null>();
  readonly hasChatOpen   = input.required<boolean>();

  readonly modelSelected = output<ModelDto>();

  readonly dropdownOpen = signal(false);

  readonly modelLabel = computed(
    () => this.selectedModel()?.display_name ?? this.selectedModel()?.key ?? null,
  );

  onSelect(model: ModelDto): void {
    this.modelSelected.emit(model);
    this.dropdownOpen.set(false);
  }
}
