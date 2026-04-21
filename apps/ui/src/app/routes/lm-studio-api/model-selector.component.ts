import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModelDto } from '../../client';
import { SpinnerComponent } from '../../shared/components/spinner.component';

export type { ModelReasoningCapability } from '../../shared/components/reasoning-dropdown.component';

@Component({
  selector: 'app-model-selector',
  imports: [CommonModule, TranslateModule, SpinnerComponent],
  template: `
    <div class="group/model-btn relative">
      <button
        type="button"
        (click)="!hasChatOpen() && dropdownOpen.set(!dropdownOpen())"
        class="flex items-center gap-2 px-3 py-1.5 text-xs border rounded-lg transition-colors max-w-[260px] shadow-depth-sm"
        [class]="
          hasChatOpen()
            ? 'border-border-default text-text-secondary cursor-not-allowed opacity-75'
            : selectedModel()
              ? 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
              : 'border-amber-700/60 text-amber-400 hover:border-amber-500'
        "
      >
        @if (modelsLoading()) {
          <app-spinner />
        } @else {
          <svg class="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.414 2.798H4.213c-1.444 0-2.414-1.798-1.414-2.798L4.6 15.3" />
          </svg>
        }
        <span class="truncate  text-[11px] tracking-wide">{{ selectedModel() ? modelLabel() : ('modelSelector.selectModel' | translate) }}</span>
        @if (selectedModel()?.capabilities?.trained_for_tool_use) {
          <svg class="w-3 h-3 shrink-0 text-amber-400 opacity-80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" [attr.title]="'modelSelector.toolUse' | translate">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.292-8.914a2.25 2.25 0 00-3.182 0l-1.83 1.83a2.25 2.25 0 000 3.182l.182.182m5.292-8.914l1.83-1.83a2.25 2.25 0 013.182 0l.182.182a2.25 2.25 0 010 3.182l-1.83 1.83" />
          </svg>
        }
        <svg
          class="w-3 h-3 opacity-40 shrink-0 transition-transform"
          [class.rotate-180]="dropdownOpen()"
          fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      @if (dropdownOpen()) {
        <div class="fixed inset-0 z-10" (click)="dropdownOpen.set(false)"></div>
        <div class="absolute top-full mt-1.5 right-0 z-20 min-w-[280px] max-w-[360px] bg-surface-raised border border-border-default rounded-lg shadow-2xl shadow-black/70 overflow-hidden py-1">
          <div class="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-default">{{ 'modelSelector.label' | translate }}</div>
          @if (models().length === 0 && !modelsLoading()) {
            <div class="px-3 py-3 text-xs text-text-muted italic">{{ 'modelSelector.noModels' | translate }}</div>
          }
          @for (m of models(); track m.key) {
            <button
              type="button"
              (click)="onSelect(m)"
              class="w-full flex items-start gap-2.5 px-3 py-2.5 text-xs transition-colors text-left"
              [class]="
                selectedModel()?.key === m.key
                  ? 'bg-accent-subtle text-accent-text font-medium'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              "
            >
              <span
                class="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full mt-1"
                [class]="m.loaded_instances.length > 0 ? 'bg-success-muted' : 'bg-text-muted'"
              ></span>
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class=" text-[11px] truncate leading-tight">{{ m.key }}</span>
                @if (m.display_name && m.display_name !== m.key) {
                  <span class="text-[10px] text-text-muted truncate leading-tight">{{ m.display_name }}</span>
                }
                <span class="text-[10px] text-text-muted leading-tight">
                  {{ m.params_string ?? '' }}{{ m.params_string && m.quantization ? ' · ' : '' }}{{ m.quantization?.name ?? '' }}
                </span>
              </div>
              @if (selectedModel()?.key === m.key) {
                <span class="ml-auto text-accent shrink-0 mt-0.5">✓</span>
              }
            </button>
          }
        </div>
      }

      @if (hasChatOpen()) {
        <div class="pointer-events-none absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-30 hidden group-hover/model-btn:flex whitespace-nowrap px-2.5 py-1.5 text-[10px] text-text-secondary bg-surface-overlay border border-border-default rounded-lg shadow-lg">
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
