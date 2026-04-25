import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChatMessage } from './chat.service';
import { MarkdownPipe, StripMarkdownPipe } from './markdown.pipe';
import ClientEnum = CreateChatMetadataDto.ClientEnum;
import { CreateChatMetadataDto } from '../../client';
import { SpinnerComponent } from '../../shared';
@Component({
  selector: 'app-chat-messages',
  imports: [
    CommonModule,
    DatePipe,
    TranslateModule,
    MarkdownPipe,
    StripMarkdownPipe,
    SpinnerComponent,
  ],
  template: `
    @if (messages().length === 0 && !streaming()) {
      @if (client() === 'OPENAI') {
        <div class="flex-1 flex items-center justify-center text-xs text-text-muted tracking-wide">
          <ng-content></ng-content>
        </div>
      } @else {
        <div class="flex-1 flex items-center justify-center text-xs text-text-muted tracking-wide">
          {{ 'messages.noMessages' | translate }}
        </div>
      }
    }

    @if (isLoadingMessages()) {
      <div class=" flex items-center justify-center h-full text-xs text-text-muted tracking-wide">
        <app-spinner size="xl" />
      </div>
    }
    @for (msg of messages(); track $index) {
      @if (msg.role === 'user') {
        @if (msg.image) {
          <div class="flex flex-col items-end gap-1">
            <div
              class="max-w-[75%] break-words text-text-primary rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style="background: var(--color-accent-subtle); border: 1px solid var(--color-accent-glow); box-shadow: var(--shadow-sm);"
            >
              <img [src]="msg.image" class="rounded-md" alt="Attached image" />
            </div>
            @if (msg.date) {
              <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
            }
          </div>
        } @else if (msg.text) {
          <div class="flex flex-col items-end gap-1 mt-1">
            <div
              class="max-w-[75%] break-words text-text-primary rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style="background: var(--color-accent-subtle); border: 1px solid var(--color-accent-glow); box-shadow: var(--shadow-sm);"
            >
              {{ msg.text }}
            </div>
            @if (msg.date) {
              <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
            }
          </div>
        }
      } @else if (msg.role === 'error') {
        <div class="flex flex-col items-start gap-1">
          <div
            class="max-w-[80%] text-error-text rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap flex items-start gap-2"
            style="background: var(--color-error-bg); border: 1px solid var(--color-error-border); box-shadow: var(--shadow-sm);"
          >
            <span class="shrink-0 mt-0.5 text-error-muted">&#9888;</span>
            <span>{{ msg.text }}</span>
          </div>
          @if (msg.date) {
            <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else if (msg.role === 'info') {
        <div class="flex flex-col items-start gap-1">
          <div
            class="mt-2 max-w-[80%] bg-info-bg border border-info-border text-info-text rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap flex items-start gap-2"
          >
            <span class="shrink-0 mt-0.5 text-info-muted">&#9888;</span>
            <span>{{ msg.text }}</span>
          </div>
          <div class="flex items-center gap-2">
            @if (msg.date) {
              <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
            }
            @if ($last && showResend()) {
              <button
                type="button"
                (click)="resend.emit()"
                class="px-3 py-1 text-xs font-medium border border-accent/40 hover:border-accent hover:text-accent text-accent/70 rounded-lg transition-colors"
              >
                {{ 'messages.resend' | translate }}
              </button>
            }
          </div>
        </div>
      } @else if (msg.role === 'tool_call') {
        <div class="flex flex-col items-start gap-1 max-w-[85%]">
          <button
            type="button"
            (click)="toggleCollapsed.emit($index)"
            class="flex items-center gap-2 w-full px-3 py-2 rounded-xl rounded-bl-sm text-xs transition-colors group"
            [class]="
              msg.toolFailed
                ? 'bg-error-bg border border-error-border text-error-text hover:bg-error-bg'
                : msg.streaming
                  ? 'bg-secondary-accent-subtle border border-secondary-accent/30 text-secondary-accent-text hover:bg-secondary-accent-subtle'
                  : 'bg-secondary-accent-subtle border border-secondary-accent/25 text-secondary-accent-text hover:bg-secondary-accent-subtle'
            "
          >
            @if (msg.streaming) {
              <span
                class="shrink-0 w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
              ></span>
            } @else if (msg.toolFailed) {
              <span class="text-error-muted shrink-0">✕</span>
            } @else {
              <span class="text-tool-muted shrink-0">⚙</span>
            }
            <span class="font-semibold truncate">{{ msg.toolName ?? '…' }}</span>
            @if (msg.providerLabel) {
              <span class="text-text-muted shrink-0 text-[10px]"
                >{{ 'messages.via' | translate }} {{ msg.providerLabel }}</span
              >
            }
            <span class="ml-auto opacity-50 group-hover:opacity-80 transition-opacity shrink-0">
              {{ msg.collapsed ? '▶' : '▼' }}
            </span>
          </button>
          @if (!msg.collapsed) {
            <div
              class="w-full border border-tool-border rounded-xl rounded-tl-sm bg-surface-raised overflow-hidden text-xs"
            >
              @if (msg.toolArguments) {
                <div class="px-3 py-2 border-b border-tool-border/30">
                  <span
                    class="text-tool-muted uppercase tracking-widest text-[10px] font-semibold"
                    >{{ 'messages.toolArguments' | translate }}</span
                  >
                  <pre
                    class="mt-1 text-tool-text whitespace-pre-wrap break-all leading-relaxed font-mono"
                    >{{ msg.toolArguments | json }}</pre
                  >
                </div>
              }
              @if (msg.toolOutput != null) {
                <div class="px-3 py-2">
                  <span
                    class="uppercase tracking-widest text-[10px]"
                    [class]="msg.toolFailed ? 'text-red-700' : 'text-emerald-700'"
                  >
                    {{
                      (msg.toolFailed ? 'messages.toolError' : 'messages.toolOutput') | translate
                    }}
                  </span>
                  <pre
                    class="mt-1 whitespace-pre-wrap break-all leading-relaxed"
                    [class]="msg.toolFailed ? 'text-red-600' : 'text-emerald-600'"
                    [innerHTML]="msg.toolOutput | markdown"
                  ></pre>
                </div>
              } @else if (msg.streaming) {
                <div class="px-3 py-2 text-tool-muted italic">
                  {{ 'messages.toolWaiting' | translate }}
                </div>
              }
            </div>
          }
          @if (msg.date) {
            <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else if (msg.role === 'prompt_processing') {
        <div class="flex flex-col items-start gap-1 max-w-[85%] mb-1 ">
          <div
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl rounded-bl-sm text-xs border"
            [class]="
              msg.streaming
                ? 'bg-warn-bg border-warn-border text-warn-text'
                : 'bg-warn-bg border-warn-border/40 text-warn-muted'
            "
          >
            @if (msg.streaming) {
              <!-- animated tokeniser icon: three stacked bars -->
              <svg
                class="shrink-0 w-3.5 h-3.5"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="9" width="14" height="2" rx="1" fill="currentColor" opacity="0.4" />
                <rect x="0" y="5.5" width="14" height="2" rx="1" fill="currentColor" opacity="0.7">
                  <animate
                    attributeName="width"
                    values="14;8;14"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </rect>
                <rect x="0" y="2" width="14" height="2" rx="1" fill="currentColor">
                  <animate
                    attributeName="width"
                    values="14;5;14"
                    dur="1.6s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            } @else {
              <svg
                class="shrink-0 w-3.5 h-3.5 text-amber-600"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="9" width="14" height="2" rx="1" fill="currentColor" opacity="0.4" />
                <rect
                  x="0"
                  y="5.5"
                  width="14"
                  height="2"
                  rx="1"
                  fill="currentColor"
                  opacity="0.7"
                />
                <rect x="0" y="2" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            }
            <span class="font-semibold">
              {{
                (msg.streaming ? 'messages.processingPrompt' : 'messages.promptProcessed')
                  | translate
              }}
            </span>
            @if (msg.streaming && (msg.progress ?? 0) > 0) {
              <span class="text-amber-500/80 tabular-nums"
                >{{ (msg.progress! * 100).toFixed(0) }}%</span
              >
            }
            <!-- progress bar -->
            @if (msg.streaming) {
              <div class="flex-1 min-w-[60px] h-1 rounded-full bg-warn-border/30 overflow-hidden">
                <div
                  class="h-full rounded-full bg-warn-text transition-all duration-300"
                  [style.width.%]="(msg.progress ?? 0) * 100"
                ></div>
              </div>
            }
          </div>
        </div>
      } @else if (msg.role === 'reasoning') {
        <div class="flex flex-col items-start gap-1 max-w-[85%]">
          <button
            type="button"
            (click)="toggleCollapsed.emit($index)"
            class="flex items-center gap-2 w-full px-3 py-2 bg-reasoning-bg border rounded-xl rounded-bl-sm text-xs text-reasoning-text hover:bg-reasoning-bg transition-colors group"
            [class]="msg.streaming ? 'border-reasoning-border/60' : 'border-reasoning-border'"
          >
            @if (msg.streaming) {
              <span
                class="shrink-0 w-3 h-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin"
              ></span>
            } @else {
              <span class="text-reasoning-muted shrink-0">◈</span>
            }
            <span class="font-semibold">{{ 'messages.reasoning' | translate }}</span>
            @if (msg.collapsed) {
              <span class="text-reasoning-muted/60 truncate flex-1 text-left"
                >{{ msg.text | stripMarkdown | slice: 0 : 60 }}…</span
              >
            }
            <span
              class="ml-auto text-reasoning-muted/60 group-hover:text-reasoning-muted transition-colors shrink-0"
            >
              {{ msg.collapsed ? '▶' : '▼' }}
            </span>
          </button>
          @if (!msg.collapsed) {
            <div
              class="w-full rounded-xl rounded-tl-sm px-3 py-2 text-xs text-reasoning-text leading-relaxed break-words"
              style="background: var(--color-reasoning-bg); border: 1px solid var(--color-reasoning-border); box-shadow: var(--shadow-sm);"
            >
              @if (msg.streaming) {
                <div
                  class="markdown-body markdown-body--violet"
                  [innerHTML]="msg.text | markdown"
                ></div>
                <span class="whitespace-pre-wrap break-words"
                  ><span
                    class="inline-block w-1.5 h-3 bg-reasoning-muted animate-pulse ml-0.5 align-middle rounded-sm"
                  ></span
                ></span>
              } @else {
                <div
                  class="markdown-body markdown-body--violet"
                  [innerHTML]="msg.text | markdown"
                ></div>
              }
            </div>
          }
          @if (msg.date) {
            <span class="text-xs text-text-muted">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else {
        <!-- ai message -->
        <div class="flex flex-col items-start gap-1">
          <div
            class="max-w-[80%] text-text-primary rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed"
            style="background: var(--color-surface-raised); border: 1px solid var(--color-border-default); box-shadow: var(--shadow-md);"
          >
            @if (msg.streaming) {
              <div class="markdown-body" [innerHTML]="msg.text | markdown"></div>
              <span class="whitespace-pre-wrap break-words"
                ><span
                  class="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5 align-middle rounded-sm"
                ></span
              ></span>
            } @else {
              <div class="markdown-body" [innerHTML]="msg.text | markdown"></div>
            }
          </div>
          @if (msg.stats) {
            <span class="text-xs text-text-muted font-mono">{{ msg.stats }}</span>
          }
        </div>
      }
    }
  `,
})
export class ChatMessagesComponent implements OnInit {
  readonly messages = input.required<ChatMessage[]>();
  readonly streaming = input.required<boolean>();
  readonly showResend = input.required<boolean>();
  readonly isLoadingMessages = input.required<boolean>();
  readonly client = input.required<ClientEnum>();
  readonly toggleCollapsed = output<number>();
  readonly resend = output<void>();
  ngOnInit() {
    setTimeout(() => {
      console.log(this.messages());
    }, 2000);
  }
}
