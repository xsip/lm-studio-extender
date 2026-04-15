import { Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatRequestDto, ReasoningDto } from '../../client';
import { ModelReasoningCapability } from '../lm-studio-api/model-selector.component';
import { ALL_REASONING_OPTIONS, ReasoningOption } from '../lm-studio-api/chat-input.component';

export interface AppendedFile {
  type: 'input_file';
  filename: string;
  file_data: string; // data:<mime>;base64,<data>
}

@Component({
  selector: 'app-openai-chat-input',
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

        <!-- ── Action row ── -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Send -->
          <button
            type="submit"
            [disabled]="form().invalid || streaming()"
            class="px-5 py-1.5 text-xs font-semibold bg-accent hover:bg-accent-hover disabled:bg-surface-sunken disabled:text-text-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {{ streaming() ? 'Streaming...' : 'Send' }}
          </button>

          <!-- Reasoning dropdown -->
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
                <span class="font-mono text-[11px] shrink-0">{{
                  currentReasoningOption()?.icon ?? '◈'
                }}</span>
                <span class="tracking-widest uppercase">{{ reasoningLabel() }}</span>
                <svg
                  class="w-3 h-3 opacity-50 transition-transform"
                  [class.rotate-180]="reasoningDropdownOpen()"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (reasoningDropdownOpen()) {
                <div class="fixed inset-0 z-10" (click)="reasoningDropdownOpen.set(false)"></div>
                <div
                  class="absolute bottom-full mb-1.5 left-0 z-20 min-w-[150px] bg-surface-raised border border-border-default rounded-lg shadow-2xl shadow-black/60 overflow-hidden py-1"
                >
                  <div
                    class="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-default"
                  >
                    Reasoning
                  </div>
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
                      <span class="font-mono text-[11px] w-3 text-center shrink-0">{{
                        opt.icon
                      }}</span>
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
            title="Attach files"
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
                Attach
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

          <span class="ml-auto text-[10px] text-text-muted hidden sm:block"
            >Enter to send · Shift+Enter for newline</span
          >
        </div>

        <!-- ── Attached files list ── -->
        @if (appendedFiles().length > 0) {
          <div class="flex flex-col gap-1 pt-1">
            <div class="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">
              Attached files
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
                <span class="text-text-muted shrink-0 text-[10px]">{{
                  fileSizeLabel(file.file_data)
                }}</span>
                <button
                  type="button"
                  (click)="removeFile(i)"
                  class="ml-1 shrink-0 flex items-center justify-center w-4 h-4 rounded text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove"
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

  readonly form = input.required<FormGroup>();
  readonly streaming = input.required<boolean>();
  readonly reasoning = input.required<
    ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum | undefined
  >();
  readonly modelReasoningCap = input.required<ModelReasoningCapability | null>();

  readonly submitted = output<void>();
  readonly reset = output<void>();
  readonly reasoningChanged = output<ChatRequestDto.ReasoningEnum>();
  /** Emits the current file list every time it changes (add / remove / clear). */
  readonly appendedFilesChanged = output<AppendedFile[]>();

  readonly reasoningDropdownOpen = signal(false);
  readonly appendedFiles = signal<AppendedFile[]>([]);

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

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const readers: Promise<AppendedFile>[] = Array.from(files).map(
      (file) =>
        new Promise<AppendedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              type: 'input_file',
              filename: file.name,
              file_data: reader.result as string,
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((newFiles) => {
      this.appendedFiles.update((existing) => {
        // Deduplicate by filename — last write wins
        const map = new Map(existing.map((f) => [f.filename, f]));
        newFiles.forEach((f) => map.set(f.filename, f));
        const merged = Array.from(map.values());
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

  fileSizeLabel(dataUrl: string): string {
    // base64 payload starts after the comma
    const base64 = dataUrl.split(',')[1] ?? '';
    const bytes = Math.round((base64.length * 3) / 4);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
