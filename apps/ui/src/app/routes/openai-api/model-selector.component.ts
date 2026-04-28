import { animate, style, transition, trigger } from '@angular/animations';
import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModelOpenAiDto } from '../../client';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCpuChip, heroChevronDown } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-openai-model-selector',
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
  viewProviders: [provideIcons({ heroCpuChip, heroChevronDown })],
  template: `
    <div class="group/model-btn relative">
      <button
        type="button"
        (click)="!hasChatOpen() && dropdownOpen.set(!dropdownOpen())"
        class="flex items-center gap-2 px-3 py-1.5 text-xs border rounded-lg transition-colors md:max-w-[260px] max-w-[230px]"
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
          <ng-icon name="heroCpuChip" class="w-3 h-3 shrink-0 opacity-50" />
        }
        <span class="truncate text-[11px] tracking-wide">{{ selectedModel() ? modelLabel() : ('modelSelector.selectModel' | translate) }}</span>
        <ng-icon name="heroChevronDown"
          class="w-3 h-3 opacity-40 shrink-0 transition-transform"
          [class.rotate-180]="dropdownOpen()"
        />
      </button>

      @if (dropdownOpen()) {
        <div class="fixed inset-0 z-10" (click)="dropdownOpen.set(false)"></div>
        <div @dropdownAnim class="absolute top-full mt-2 right-0 z-20 min-w-[280px] max-w-[360px] bg-surface-raised border border-border-default rounded-lg shadow-2xl shadow-black/70 overflow-hidden py-1"
        >
          <div
            class="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-default"
          >
            {{ 'modelSelector.label' | translate }}
          </div>
          @if (models().length === 0 && !modelsLoading()) {
<div class="px-3 py-3 text-xs text-text-muted italic">{{ 'modelSelector.noModels' | translate }}</div>
          }
          @for (m of models(); track m.id) {
            <button
              type="button"
              (click)="onSelect(m)"
              class="w-full flex items-start gap-2.5 px-3 py-2.5 text-xs transition-colors text-left"
              [class]="
                selectedModel()?.id === m.id
                  ? 'bg-accent-subtle text-accent-text font-medium'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              "
            >
              <span class="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-success-muted"></span>
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="text-[11px] truncate leading-tight">{{ m.id }}</span>
                @if (m.owned_by) {
                  <span class="text-[10px] text-text-muted truncate leading-tight">{{
                    m.owned_by
                  }}</span>
                }
              </div>
              @if (selectedModel()?.id === m.id) {
                <span class="ml-auto text-accent shrink-0 mt-0.5">✓</span>
              }
            </button>
          }
        </div>
      }

      @if (hasChatOpen()) {
        <div
          class="pointer-events-none absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-30 hidden group-hover/model-btn:flex whitespace-nowrap px-2.5 py-1.5 text-[10px] text-text-secondary bg-surface-overlay border border-border-default rounded-lg shadow-lg"
        >
          {{ 'modelSelector.cannotSwitch' | translate }}
        </div>
      }
    </div>
  `,
})
export class OpenAiModelSelectorComponent {
  readonly models        = input.required<ModelOpenAiDto[]>();
  readonly modelsLoading = input.required<boolean>();
  readonly selectedModel = input.required<ModelOpenAiDto | null>();
  readonly hasChatOpen   = input.required<boolean>();

  readonly modelSelected = output<ModelOpenAiDto>();
  readonly dropdownOpen  = signal(false);

  readonly modelLabel = computed(() => this.selectedModel()?.id ?? null);

  onSelect(model: ModelOpenAiDto): void {
    this.modelSelected.emit(model);
    this.dropdownOpen.set(false);
  }
}
