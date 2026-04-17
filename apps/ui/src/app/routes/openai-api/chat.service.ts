import { computed, inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  OpenAiStreamService,
  OpenAiStreamErrorEvent,
  OpenAiStreamApiInfoEvent,
  ResponseOutputItemAddedEvent,
  ResponseOutputItemDoneEvent,
  ResponseOutputTextDeltaEvent,
  ResponseReasoningTextDeltaEvent,
  McpItemTracking,
} from '../../openai-stream.service';
import {
  ChatMetadataService,
  CreateChatMetadataDto,
  EasyInputMessageDto,
  McpCallDto,
  McpListToolsDto,
  MessageOutputDto,
  ReasoningDto,
  ReasoningOutputDto,
  ResponseInputTextDto,
  ResponseOutputItemAddedEventDto,
  ResponseOutputItemDoneEventDto,
  ResponseReasoningItemDto,
} from '../../client';
import { AppendedFile } from './chat-input.component';
import * as CryptoJS from 'crypto-js';

export interface ChatMessage {
  role: 'user' | 'ai' | 'error' | 'info' | 'tool_call' | 'reasoning' | 'mcp_list_tools';
  text: string;
  date?: Date;
  stats?: string;
  streaming?: boolean;
  toolName?: string;
  toolArguments?: object;
  toolOutput?: string;
  toolFailed?: boolean;
  providerLabel?: string;
  collapsed?: boolean;
  itemId?: string; // track by OpenAI item id
}

@Injectable()
export class ChatService {
  private readonly streamService = inject(OpenAiStreamService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly chatMetaService = inject(ChatMetadataService);
  readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    input: ['', [Validators.required, Validators.minLength(1)]],
  });

  readonly streaming = signal(false);
  readonly chatMessages = signal<ChatMessage[]>([]);
  readonly currentChatId = signal<string | null>(null);

  private readonly lastUserInput = signal<string>('');
  private sub?: Subscription;

  // Tracks in-flight MCP tool call items (keyed by item id)
  private mcpTracking = new Map<string, McpItemTracking>();

  readonly showResend = computed(() => {
    const msgs = this.chatMessages();
    const last = msgs[msgs.length - 1];
    if (!last || last.role !== 'info') return false;
    return !!this.lastUserInput();
  });

  readonly hasChatOpen = computed(() => this.currentChatId() !== null);

  toggleCollapsed(index: number): void {
    this.chatMessages.update((msgs) => {
      const copy = [...msgs];
      copy[index] = { ...copy[index], collapsed: !copy[index].collapsed };
      return copy;
    });
  }

  lastIndexWhere(msgs: ChatMessage[], pred: (m: ChatMessage) => boolean): number {
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (pred(msgs[i])) return i;
    }
    return -1;
  }

  patchLast(pred: (m: ChatMessage) => boolean, patch: Partial<ChatMessage>): void {
    this.chatMessages.update((msgs) => {
      const idx = this.lastIndexWhere(msgs, pred);
      if (idx === -1) return msgs;
      const copy = [...msgs];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  patchByItemId(itemId: string, patch: Partial<ChatMessage>): void {
    this.chatMessages.update((msgs) => {
      const idx = this.lastIndexWhere(msgs, (m) => m.itemId === itemId);
      if (idx === -1) return msgs;
      const copy = [...msgs];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  submit(
    selectedModelId: string,
    reasoning: ReasoningDto.EffortEnum | undefined,
    appendedFiles: AppendedFile[] | undefined,
    encryptionKey: string | undefined,
    onChatListRefresh: () => void,
    newChatOptions?: {
      name?: string;
      useCrypto?: boolean;
      cryptoKey?: string;
      openAiEndpointPreference?: CreateChatMetadataDto.OpenAiEndpointPreferenceEnum;
    },
  ): void {
    if (this.form.invalid || this.streaming()) return;
    let input = this.form.getRawValue().input!.trim();

    this.lastUserInput.set(input);
    this.form.reset();
    this.streaming.set(true);
    this.mcpTracking.clear();

    this.chatMessages.update((msgs) => [...msgs, { role: 'user', text: input, date: new Date() }]);

    this.streamService.reset();
    this.sub?.unsubscribe();

    this.sub = this.streamService.events$.subscribe({
      next: (event) => {
        switch (event.type) {
          // ── A new output item starts ──────────────────────────────────────
          case ResponseOutputItemAddedEventDto.TypeEnum.ResponseOutputItemAdded: {
            const e = event as ResponseOutputItemAddedEvent;
            const item = e.item as any;

            if (item.type === ReasoningOutputDto.TypeEnum.Reasoning) {
              this.chatMessages.update((msgs) => [
                ...msgs,
                {
                  role: 'reasoning',
                  text: '',
                  streaming: true,
                  collapsed: false,
                  date: new Date(),
                  itemId: item.id,
                },
              ]);
            } else if (item.type === MessageOutputDto.TypeEnum.Message) {
              this.chatMessages.update((msgs) => [
                ...msgs,
                { role: 'ai', text: '', streaming: true, itemId: item.id },
              ]);
            } else if (item.type === McpListToolsDto.TypeEnum.McpListTools) {
              // Track but don't show in chat
            } else if (item.type === McpCallDto.TypeEnum.McpCall) {
              const serverLabel = item.server_label ?? item.name ?? undefined;
              this.mcpTracking.set(item.id, {
                itemId: item.id,
                serverLabel,
                toolName: item.name ?? undefined,
                outputIndex: e.output_index,
              });
              this.chatMessages.update((msgs) => [
                ...msgs,
                {
                  role: 'tool_call',
                  text: '',
                  streaming: true,
                  collapsed: false,
                  date: new Date(),
                  itemId: item.id,
                  toolName: item.name ?? '…',
                  providerLabel: serverLabel,
                },
              ]);
            }
            break;
          }

          // ── An output item is fully done ─────────────────────────────────
          case ResponseOutputItemDoneEventDto.TypeEnum.ResponseOutputItemDone: {
            const e = event as ResponseOutputItemDoneEventDto;
            const item = e.item;

            if (item.type === ResponseReasoningItemDto.TypeEnum.Reasoning && item.id) {
              this.patchByItemId(item.id, { streaming: false, collapsed: true });
            } else if (item.type === 'message') {
              // stats will be applied by response.completed
              this.patchByItemId(item.id, { streaming: false });
            } else if (item.type === McpCallDto.TypeEnum.McpCall) {
              const tracking = this.mcpTracking.get(item.id);
              if (item.status === 'completed' && 'output' in item) {
                // Extract output from item.output if present
                let outputText: string = item.output ?? '';
                try {
                  const parsed = JSON.parse(outputText);
                  if (Array.isArray(parsed) && parsed[0]?.text != null) outputText = parsed[0].text;
                  else if (typeof parsed === 'object' && parsed !== null)
                    outputText = JSON.stringify(parsed, null, 2);
                } catch {
                  /* leave as-is */
                }
                this.patchByItemId(item.id, {
                  toolOutput: outputText || undefined,
                  toolName: tracking?.toolName ?? item.name ?? '…',
                  toolArguments: item.arguments ? this.safeParseJson(item.arguments) : undefined,
                  providerLabel: tracking?.serverLabel ?? item.server_label,
                  streaming: false,
                  collapsed: true,
                });
              } else if (item.status === 'failed' || item.status === 'incomplete') {
                this.patchByItemId(item.id, {
                  toolOutput: item.error ?? 'Tool call failed',
                  toolFailed: true,
                  streaming: false,
                  collapsed: true,
                });
              }
              this.mcpTracking.delete(item.id);
            }
            break;
          }

          // ── MCP tool call in progress — extract tool name / args ──────────
          case 'response.mcp_call.in_progress': {
            const e = event as any;
            // item details come through in in_progress for some servers
            if (e.item) {
              const item = e.item;
              const tracking = this.mcpTracking.get(e.item_id ?? item.id);
              if (tracking) {
                tracking.toolName = item.name ?? tracking.toolName;
                tracking.serverLabel = item.server_label ?? tracking.serverLabel;
              }
              this.patchByItemId(e.item_id ?? item.id, {
                toolName: item.name ?? undefined,
                providerLabel: item.server_label ?? undefined,
              });
            }
            break;
          }

          // ── Reasoning text delta ──────────────────────────────────────────
          case 'response.reasoning_text.delta': {
            const e = event as ResponseReasoningTextDeltaEvent;
            this.chatMessages.update((msgs) => {
              const idx = this.lastIndexWhere(msgs, (m) => m.itemId === e.item_id);
              if (idx === -1) return msgs;
              const copy = [...msgs];
              copy[idx] = { ...copy[idx], text: copy[idx].text + e.delta };
              return copy;
            });
            break;
          }

          // ── Text output delta (handled via messageDelta$ for efficiency) ──
          // response.output_text.delta is dispatched through messageDelta$

          // ── Stream errors ─────────────────────────────────────────────────
          case 'error': {
            const e = event as OpenAiStreamErrorEvent;
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [
                ...filtered,
                {
                  role: 'error' as const,
                  text: e.message ?? e.error?.message ?? 'Unknown error',
                  date: new Date(),
                },
              ];
            });
            this.streaming.set(false);
            break;
          }

          case 'api.info': {
            const e = event as OpenAiStreamApiInfoEvent;
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [...filtered, { role: 'info' as const, text: e.message, date: new Date() }];
            });
            break;
          }

          case 'response.failed': {
            const e = event as any;
            const msg = e.response?.error?.message ?? 'Response failed';
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [...filtered, { role: 'error' as const, text: msg, date: new Date() }];
            });
            this.streaming.set(false);
            break;
          }
        }
      },
      complete: () => this.streaming.set(false),
      error: () => this.streaming.set(false),
    });

    // Text deltas arrive through the dedicated subject
    this.streamService.messageDelta$.subscribe((chunk) => {
      this.chatMessages.update((msgs) => {
        const copy = [...msgs];
        const idx = this.lastIndexWhere(copy, (m) => m.role === 'ai' && !!m.streaming);
        if (idx !== -1) copy[idx] = { ...copy[idx], text: copy[idx].text + chunk };
        return copy;
      });
    });

    this.streamService.chatEnd$.subscribe((result) => {
      const u = result.usage;
      const stats = u
        ? `${u.input_tokens} in · ${u.output_tokens} out${u.output_tokens_details?.reasoning_tokens ? ` · ${u.output_tokens_details.reasoning_tokens} reasoning` : ''}`
        : undefined;
      this.chatMessages.update((msgs) =>
        msgs.map((m) => {
          if (m.role === 'ai' && m.streaming) return { ...m, streaming: false, stats };
          if ((m.role === 'tool_call' || m.role === 'reasoning') && m.streaming) {
            return { ...m, streaming: false, collapsed: true };
          }
          return m;
        }),
      );
      onChatListRefresh();
    });

    this.streamService.newChatCreated$.subscribe((result) => {
      if (this.currentChatId() !== result) {
        this.currentChatId.set(result);
        this.location.replaceState(`/chat-openai/${result}`);
      }
    });

    this.streamService.chat(
      {
        model: selectedModelId,
        input: [
          {
            role: 'user',
            content: [
              ...(appendedFiles ?? []),
              /*{
                type: 'input_file',
                filename: 'base64emoji.png',
                file_data:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
              },*/
              {
                type: 'input_text',
                text: input,
              },
            ],
          },
        ],
        reasoning: reasoning
          ? {
              effort: reasoning,
              summary: 'detailed',
              generate_summary: 'detailed',
            }
          : undefined,
        store: true,
      },
      this.currentChatId() ?? undefined,
      this.currentChatId() ? undefined : newChatOptions,
    );
  }

  resend(
    selectedModelId: string,
    reasoning: ReasoningDto.EffortEnum | undefined,
    appendedFiles: AppendedFile[] | undefined,
    encryptionKey: string | undefined,
    onChatListRefresh: () => void,
  ): void {
    const input = this.lastUserInput();
    if (!input || this.streaming()) return;
    this.form.setValue({ input });
    this.submit(selectedModelId, reasoning, appendedFiles, encryptionKey, onChatListRefresh);
  }

  reset(): void {
    this.sub?.unsubscribe();
    this.streamService.reset();
    this.streaming.set(false);
    this.chatMessages.update((msgs) => msgs.filter((m) => !m.streaming));
  }

  destroy(): void {
    this.sub?.unsubscribe();
  }

  private safeParseJson(value: unknown): object | undefined {
    if (typeof value === 'object' && value !== null) return value as object;
    if (typeof value !== 'string') return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
}
