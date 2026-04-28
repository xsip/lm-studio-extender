import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModelDto } from '../../client';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCpuChip, heroWrenchScrewdriver, heroChevronDown, heroCheck } from '@ng-icons/heroicons/outline';

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
  imports: [CommonModule, TranslateModule, SpinnerComponent, NgIconComponent],
  viewProviders: [provideIcons({ heroCpuChip, heroWrenchScrewdriver, heroChevronDown, heroCheck })],
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
          <ng-icon name="heroCpuChip" class="w-3.5 h-3.5 shrink-0 opacity-50" />
        }
        <span class="truncate text-[11px] tracking-wide font-medium">{{ selectedModel() ? modelLabel() : ('modelSelector.selectModel' | translate) }}</span>
        @if (selectedModel()?.capabilities?.trained_for_tool_use) {
          <ng-icon name="heroWrenchScrewdriver" class="w-3 h-3 shrink-0 text-tertiary-accent opacity-80" [attr.title]="'modelSelector.toolUse' | translate" />
        }
        <ng-icon name="heroChevronDown"
          class="w-3 h-3 opacity-40 shrink-0 transition-transform duration-200"
          [class.rotate-180]="dropdownOpen()"
        />
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
                <ng-icon name="heroCheck" class="w-3.5 h-3.5 text-accent shrink-0 mt-0.5 animate-scale-in" />
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
