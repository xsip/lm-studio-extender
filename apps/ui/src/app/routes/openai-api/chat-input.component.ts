import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatRequestDto, ReasoningDto } from '../../client';
import { ModelReasoningCapability } from '../../shared/components/reasoning-dropdown.component';
import { SendButtonComponent } from '../../shared/components/send-button.component';
import { ResetButtonComponent } from '../../shared/components/reset-button.component';
import { ReasoningDropdownComponent } from '../../shared/components/reasoning-dropdown.component';
import { AppendedFile, fileSizeLabel, mergeFiles, readFilesAsDataUrls } from '../../shared/utils/file.utils';
import { TranslateModule } from '@ngx-translate/core';

// Re-export AppendedFile so existing consumers importing from this file keep working.
export type { AppendedFile };

@Component({
  selector: 'app-openai-chat-input',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, SendButtonComponent, ResetButtonComponent, ReasoningDropdownComponent],
  template: `
    <div class="shrink-0 border-t border-border-default px-4 py-3 bg-surface-raised">
      <form [formGroup]="form()" (ngSubmit)="submitted.emit()" class="flex flex-col gap-2">
        <textarea
          formControlName="input"
          rows="3"
          [placeholder]="'chatInput.placeholder' | translate"
          class="w-full bg-surface-base border border-border-default rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          (keydown)="onKeydown($event)"
        ></textarea>

        <!-- ── Action row ── -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Send -->
          <app-send-button [disabled]="form().invalid || streaming()" [streaming]="streaming()" />

          <!-- Reasoning dropdown -->
          <app-reasoning-dropdown
            [reasoning]="reasoning()"
            [modelReasoningCap]="modelReasoningCap()"
            (reasoningChanged)="reasoningChanged.emit($event)"
          />

          <!-- Upload file button -->
          <button
            type="button"
            (click)="fileInput.click()"
            [disabled]="streaming()"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors select-none disabled:opacity-40 disabled:cursor-not-allowed"
            [class]="
              appendedFiles().length > 0
                ? 'border-accent text-accent bg-accent/10 hover:bg-accent/20'
                : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
            "
            [title]="'chatInput.attach' | translate"
          >
            <svg
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <span>
              @if (appendedFiles().length > 0) {
                {{ appendedFiles().length }} file{{ appendedFiles().length === 1 ? '' : 's' }}
              } @else {
                {{ 'chatInput.attach' | translate }}
              }
            </span>
          </button>

          <!-- Hidden file input -->
          <input
            #fileInput
            type="file"
            multiple
            class="hidden"
            (change)="onFilesSelected($event)"
          />

          <!-- Reset stream -->
          @if (streaming()) {
            <app-reset-button (clicked)="reset.emit()" />
          }

          @if (form().get('input')?.invalid && form().get('input')?.touched) {
<p class="text-xs text-red-400">{{ 'chatInput.promptRequired' | translate }}</p>
          }

          <span class="ml-auto text-[10px] text-text-muted hidden sm:block"
>{{ 'chatInput.hint' | translate }}</span
          >
        </div>

        <!-- ── Attached files list ── -->
        @if (appendedFiles().length > 0) {
          <div class="flex flex-col gap-1 pt-1">
<div class="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">
              {{ 'chatInput.attachedFiles' | translate }}
            </div>
            @for (file of appendedFiles(); track file.filename; let i = $index) {
              <div
                class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-base border border-border-default text-xs group"
              >
                <!-- File type icon -->
                <svg
                  class="w-3.5 h-3.5 shrink-0 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span class="truncate text-text-primary flex-1 max-w-xs">{{ file.filename }}</span>
                <span class="text-text-muted shrink-0 text-[10px]">{{ fileSizeLabel(file.image_url) }}</span>
                <button
                  type="button"
                  (click)="removeFile(i)"
                  class="ml-1 shrink-0 flex items-center justify-center w-4 h-4 rounded text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                  [title]="'common.remove' | translate"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            }
          </div>
        }
      </form>
    </div>
  `,
})
export class OpenAiChatInputComponent {
  @ViewChild('fileInput') private fileInputRef!: ElementRef<HTMLInputElement>;

  readonly form             = input.required<FormGroup>();
  readonly streaming        = input.required<boolean>();
  readonly reasoning        = input.required<ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum | undefined>();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();

  readonly submitted           = output<void>();
  readonly reset               = output<void>();
  readonly reasoningChanged     = output<ChatRequestDto.ReasoningEnum>();
  /** Emits the current file list every time it changes (add / remove / clear). */
  readonly appendedFilesChanged = output<AppendedFile[]>();

  readonly appendedFiles = signal<AppendedFile[]>([]);

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitted.emit();
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    readFilesAsDataUrls(files).then((newFiles) => {
      this.appendedFiles.update((existing) => {
        const merged = mergeFiles(existing, newFiles);
        this.appendedFilesChanged.emit(merged);
        return merged;
      });
      // Reset the native input so the same file can be re-added after removal
      input.value = '';
    });
  }

  removeFile(index: number): void {
    this.appendedFiles.update((files) => {
      const updated = files.filter((_, i) => i !== index);
      this.appendedFilesChanged.emit(updated);
      return updated;
    });
  }

  /** Call this from the parent after a message is sent to clear the list. */
  clearFiles(): void {
    this.appendedFiles.set([]);
    this.appendedFilesChanged.emit([]);
  }

  /** Delegates to shared utility — kept as method so templates can call it. */
  fileSizeLabel(dataUrl: string): string {
    return fileSizeLabel(dataUrl);
  }
}
