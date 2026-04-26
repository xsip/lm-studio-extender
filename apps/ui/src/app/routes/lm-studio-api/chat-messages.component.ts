import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChatMessage } from './chat.service';
import { AuthImagesDirective, MarkdownPipe, StripMarkdownPipe } from './markdown.pipe';
import ClientEnum = CreateChatMetadataDto.ClientEnum;
import { CreateChatMetadataDto } from '../../client';
import { SpinnerComponent } from '../../shared';
@Component({
  selector: 'app-chat-messages',
  animations: [
    trigger('msgAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.97)' }),
        animate(
          '280ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
        ),
      ]),
    ]),
    trigger('userMsgAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(16px) scale(0.96)' }),
        animate(
          '260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'translateX(0) scale(1)' }),
        ),
      ]),
    ]),
    trigger('toolExpandAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.7)', transformOrigin: 'top' }),
        animate(
          '220ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scaleY(1)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '160ms ease-in',
          style({ opacity: 0, transform: 'scaleY(0.7)', transformOrigin: 'top' }),
        ),
      ]),
    ]),
    trigger('emptyStateAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92)' }),
        animate(
          '400ms 100ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1)' }),
        ),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    DatePipe,
    TranslateModule,
    MarkdownPipe,
    AuthImagesDirective,
    StripMarkdownPipe,
    SpinnerComponent,
  ],
  template: `
    @if (messages().length === 0 && !streaming()) {
      @if (client() === 'OPENAI') {
        <div
          class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6"
          @emptyStateAnim
        >
          <ng-content></ng-content>
        </div>
      } @else {
        <div
          class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6"
          @emptyStateAnim
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 animate-float"
            style="background: linear-gradient(135deg, var(--color-accent-subtle), var(--color-surface-overlay)); border: 1px solid var(--color-border-default);"
          >
            <svg
              class="w-7 h-7 text-accent opacity-60"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <p class="text-sm text-text-muted">{{ 'messages.noMessages' | translate }}</p>
          <p class="text-xs text-text-disabled max-w-xs">
            Start a conversation by typing a message below
          </p>
        </div>
      }
    }

    @if (isLoadingMessages()) {
      <div
        class="flex items-center justify-center h-full gap-3 text-xs text-text-muted animate-fade-in"
        style="animation-duration: 0.4s;"
      >
        <app-spinner size="md" />
        <span class="tracking-wide">Loading conversation…</span>
      </div>
    }

    @for (msg of messages(); track $index) {
      @if (msg.role === 'user') {
        @if (msg.image) {
          <div class="flex flex-col items-end gap-1" @userMsgAnim>
            <div
              class="max-w-[75%] rounded-2xl rounded-br-sm overflow-hidden"
              style="background: var(--color-accent-subtle); border: 1px solid var(--color-accent-glow); box-shadow: var(--shadow-sm);"
            >
              <img [src]="msg.image" class="rounded-xl m-2 w-[98%]" alt="Attached image" />
            </div>
            @if (msg.date) {
              <span class="text-[10px] text-text-disabled mr-1">{{
                msg.date | date: 'HH:mm'
              }}</span>
            }
          </div>
        } @else if (msg.text) {
          <div class="flex flex-col items-end gap-1" @userMsgAnim>
            <div
              class="max-w-[75%] break-words text-text-primary rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style="background: var(--color-accent-subtle); border: 1px solid var(--color-accent-glow); box-shadow: var(--shadow-sm);"
            >
              {{ msg.text }}
            </div>
            @if (msg.date) {
              <span class="text-[10px] text-text-disabled mr-1">{{
                msg.date | date: 'HH:mm'
              }}</span>
            }
          </div>
        }
      } @else if (msg.role === 'error') {
        <div class="flex flex-col items-start gap-1" @msgAnim>
          <div
            class="max-w-[80%] text-error-text rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed flex items-start gap-2"
            style="background: var(--color-error-bg); border: 1px solid var(--color-error-border); box-shadow: var(--shadow-sm);"
          >
            <svg
              class="w-3.5 h-3.5 shrink-0 mt-0.5 text-error-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <span>{{ msg.text }}</span>
          </div>
          @if (msg.date) {
            <span class="text-[10px] text-text-disabled ml-1">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else if (msg.role === 'info') {
        <div class="flex flex-col items-start gap-1 animate-slide-up">
          <div
            class="mt-1 max-w-[80%] bg-info-bg border border-info-border text-info-text rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed flex items-start gap-2"
          >
            <svg
              class="w-3.5 h-3.5 shrink-0 mt-0.5 text-info-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span>{{ msg.text }}</span>
          </div>
          <div class="flex items-center gap-2 ml-1">
            @if (msg.date) {
              <span class="text-[10px] text-text-disabled">{{ msg.date | date: 'HH:mm' }}</span>
            }
            @if ($last && showResend()) {
              <button
                type="button"
                (click)="resend.emit()"
                class="px-3 py-1 text-xs font-medium border border-accent/40 hover:border-accent hover:text-accent text-accent/70 rounded-lg active:scale-95 hover:-translate-y-0.5"
              >
                {{ 'messages.resend' | translate }}
              </button>
            }
          </div>
        </div>
      } @else if (msg.role === 'tool_call') {
        <div class="flex flex-col items-start gap-1 max-w-[85%]" @msgAnim>
          <button
            type="button"
            (click)="toggleCollapsed.emit($index)"
            class="flex items-center gap-2 w-full px-3 py-2 rounded-xl rounded-bl-sm text-xs transition-all duration-200 group"
            [class]="
              msg.toolFailed
                ? 'bg-error-bg border border-error-border text-error-text'
                : msg.streaming
                  ? 'bg-tool-bg border border-tool-border/50 text-tool-text'
                  : 'bg-tool-bg border border-tool-border/40 text-tool-text hover:border-tool-border'
            "
          >
            @if (msg.streaming) {
              <span
                class="shrink-0 w-3 h-3 rounded-full border-2 border-secondary-accent border-t-transparent animate-spin"
              ></span>
            } @else if (msg.toolFailed) {
              <svg
                class="w-3 h-3 text-error-muted shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg
                class="w-3 h-3 text-tool-muted shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654m5.292-8.914a2.25 2.25 0 00-3.182 0l-1.83 1.83a2.25 2.25 0 000 3.182l.182.182"
                />
              </svg>
            }
            <span class="font-semibold truncate">{{ msg.toolName ?? '…' }}</span>
            @if (msg.providerLabel) {
              <span class="text-tool-muted/60 shrink-0 text-[10px]"
                >via {{ msg.providerLabel }}</span
              >
            }
            <svg
              class="ml-auto w-3 h-3 opacity-40 shrink-0 transition-transform"
              [class.rotate-180]="!msg.collapsed"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          @if (!msg.collapsed) {
            <div
              class="w-full border border-tool-border/30 rounded-xl rounded-tl-sm bg-surface-raised overflow-hidden text-xs"
              @toolExpandAnim
            >
              @if (msg.toolArguments) {
                <div class="px-3 py-2 border-b border-tool-border/20">
                  <span
                    class="text-tool-muted/70 uppercase tracking-widest text-[10px] font-semibold"
                    >{{ 'messages.toolArguments' | translate }}</span
                  >
                  <pre
                    class="mt-1.5 text-tool-text whitespace-pre-wrap break-all leading-relaxed font-mono text-[11px]"
                    >{{ msg.toolArguments | json }}</pre
                  >
                </div>
              }
              @if (msg.toolOutput != null) {
                <div class="px-3 py-2">
                  <span
                    class="uppercase tracking-widest text-[10px] font-semibold"
                    [class]="msg.toolFailed ? 'text-error-muted' : 'text-success-muted'"
                  >
                    {{
                      (msg.toolFailed ? 'messages.toolError' : 'messages.toolOutput') | translate
                    }}
                  </span>
                  <pre
                    authImages
                    class="mt-1.5 whitespace-pre-wrap break-all leading-relaxed text-[11px]"
                    [class]="msg.toolFailed ? 'text-error-text' : 'text-success-text'"
                    [innerHTML]="msg.toolOutput | markdown"
                  ></pre>
                </div>
              } @else if (msg.streaming) {
                <div class="px-3 py-2 text-tool-muted/60 italic flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-tool-muted animate-pulse"></span>
                  {{ 'messages.toolWaiting' | translate }}
                </div>
              }
            </div>
          }
          @if (msg.date) {
            <span class="text-[10px] text-text-disabled ml-1">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else if (msg.role === 'prompt_processing') {
        <div class="flex flex-col items-start gap-1 max-w-[85%] mb-1" @msgAnim>
          <div
            class="flex items-center gap-2.5 px-3 py-2 rounded-xl rounded-bl-sm text-xs border"
            [class]="
              msg.streaming
                ? 'bg-warn-bg border-warn-border text-warn-text'
                : 'bg-warn-bg border-warn-border/30 text-warn-muted'
            "
          >
            @if (msg.streaming) {
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
              <svg class="shrink-0 w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
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
            <span class="font-semibold">{{
              (msg.streaming ? 'messages.processingPrompt' : 'messages.promptProcessed') | translate
            }}</span>
            @if (msg.streaming && (msg.progress ?? 0) > 0) {
              <span class="text-warn-muted/80 tabular-nums font-mono text-[10px]"
                >{{ (msg.progress! * 100).toFixed(0) }}%</span
              >
            }
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
        <div class="flex flex-col items-start gap-1 max-w-[85%]" @msgAnim>
          <button
            type="button"
            (click)="toggleCollapsed.emit($index)"
            class="flex items-center gap-2 w-full px-3 py-2 rounded-xl rounded-bl-sm text-xs transition-all duration-200 group"
            [class]="
              msg.streaming
                ? 'bg-reasoning-bg border border-reasoning-border/50 text-reasoning-text'
                : 'bg-reasoning-bg border border-reasoning-border text-reasoning-text hover:border-reasoning-muted/50'
            "
          >
            @if (msg.streaming) {
              <span
                class="shrink-0 w-3 h-3 rounded-full border-2 border-reasoning-muted border-t-transparent animate-spin"
              ></span>
            } @else {
              <svg
                class="w-3 h-3 text-reasoning-muted shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            }
            <span class="font-semibold">{{ 'messages.reasoning' | translate }}</span>
            @if (msg.collapsed) {
              <span class="text-reasoning-muted/50 truncate flex-1 text-left text-[11px]"
                >{{ msg.text | stripMarkdown | slice: 0 : 60 }}…</span
              >
            }
            <svg
              class="ml-auto w-3 h-3 opacity-40 shrink-0 transition-transform"
              [class.rotate-180]="!msg.collapsed"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          @if (!msg.collapsed) {
            <div
              class="w-full rounded-xl rounded-tl-sm px-4 py-3 text-xs text-reasoning-text leading-relaxed break-words"
              @toolExpandAnim
              style="background: var(--color-reasoning-bg); border: 1px solid var(--color-reasoning-border);"
            >
              @if (msg.streaming) {
                <div
                  authImages
                  class="markdown-body markdown-body--violet"
                  [innerHTML]="msg.text | markdown"
                ></div>
                <span
                  class="inline-block w-1.5 h-3 bg-reasoning-muted animate-typing-blink ml-0.5 align-middle rounded-sm"
                ></span>
              } @else {
                <div
                  authImages
                  class="markdown-body markdown-body--violet"
                  [innerHTML]="msg.text | markdown"
                ></div>
              }
            </div>
          }
          @if (msg.date) {
            <span class="text-[10px] text-text-disabled ml-1">{{ msg.date | date: 'HH:mm' }}</span>
          }
        </div>
      } @else {
        <!-- AI message -->
        <div class="flex flex-col items-start gap-1.5" @msgAnim>
          <!-- Avatar -->
          <div class="flex items-start gap-2.5">
            <div
              class="w-6 h-6 rounded-lg shrink-0 mt-0.5 flex items-center justify-center animate-scale-in"
              style="background: linear-gradient(135deg, var(--color-accent), var(--color-secondary-accent)); box-shadow: 0 2px 8px var(--color-accent-glow);"
            >
              <svg
                class="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <div
              class="max-w-[80%] text-text-primary rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
              style="background: var(--color-surface-raised); border: 1px solid var(--color-border-default); box-shadow: var(--shadow-md);"
            >
              @if (msg.streaming) {
                <div
                  class="markdown-body break-words"
                  authImages
                  [innerHTML]="msg.text | markdown"
                ></div>
                <span
                  class="inline-block w-2 h-4 bg-accent animate-typing-blink ml-0.5 align-middle rounded-sm"
                ></span>
              } @else {
                <div
                  class="markdown-body break-words"
                  authImages
                  [innerHTML]="msg.text | markdown"
                ></div>
              }
            </div>
          </div>
          @if (msg.stats) {
            <span class="text-[10px] text-text-disabled font-mono ml-8">{{ msg.stats }}</span>
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
