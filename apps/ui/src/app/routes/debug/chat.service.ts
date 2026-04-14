import { computed, inject, Injectable, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  LmStudioStreamService,
  StreamError2Event,
  StreamErrorEvent,
  PromptProcessingProgressEvent,
} from '../../lmstudio-stream.service';
import { ChatRequestDto, ChatMetadataService } from '../../client';

export interface ChatMessage {
  role: 'user' | 'ai' | 'error' | 'info' | 'tool_call' | 'reasoning' | 'prompt_processing';
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
  progress?: number; // 0–1, used by prompt_processing
}

@Injectable()
export class ChatService {
  private readonly streamService = inject(LmStudioStreamService);
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

  readonly showResend = computed(() => {
    const msgs = this.chatMessages();
    const last = msgs[msgs.length - 1];
    if (!last || last.role !== 'info') return false;
    const hasChatEnd = this.streamService.events$.pipe !== undefined;
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

  submit(
    selectedModelKey: string,
    reasoning: ChatRequestDto.ReasoningEnum | undefined,
    onChatListRefresh: () => void,
  ): void {
    if (this.form.invalid || this.streaming()) return;

    const input = this.form.getRawValue().input!.trim();
    this.lastUserInput.set(input);
    this.form.reset();
    this.streaming.set(true);

    this.chatMessages.update((msgs) => [...msgs, { role: 'user', text: input, date: new Date() }]);

    this.streamService.reset();
    this.sub?.unsubscribe();

    this.sub = this.streamService.events$.subscribe({
      next: (event) => {
        switch (event.type) {
          case 'prompt_processing.start':
            this.chatMessages.update((msgs) => [
              ...msgs,
              { role: 'prompt_processing', text: '', streaming: true, progress: 0, date: new Date() },
            ]);
            break;

          case 'prompt_processing.progress':
            this.patchLast(
              (m) => m.role === 'prompt_processing' && !!m.streaming,
              { progress: (event as PromptProcessingProgressEvent).progress },
            );
            break;

          case 'prompt_processing.end':
            this.patchLast(
              (m) => m.role === 'prompt_processing' && !!m.streaming,
              { streaming: false, progress: 1 },
            );
            break;

          case 'reasoning.start':
            this.chatMessages.update((msgs) => [
              ...msgs,
              { role: 'reasoning', text: '', streaming: true, collapsed: false, date: new Date() },
            ]);
            break;

          case 'reasoning.delta':
            this.chatMessages.update((msgs) => {
              const idx = this.lastIndexWhere(msgs, (m) => m.role === 'reasoning' && !!m.streaming);
              if (idx === -1) return msgs;
              const copy = [...msgs];
              copy[idx] = { ...copy[idx], text: copy[idx].text + event.content };
              return copy;
            });
            break;

          case 'reasoning.end':
            this.patchLast((m) => m.role === 'reasoning' && !!m.streaming, {
              streaming: false,
              collapsed: true,
            });
            break;

          case 'tool_call.start':
            this.chatMessages.update((msgs) => [
              ...msgs,
              { role: 'tool_call', text: '', streaming: true, collapsed: false, date: new Date() },
            ]);
            break;

          case 'tool_call.name':
            this.patchLast((m) => m.role === 'tool_call' && !!m.streaming, {
              toolName: event.tool_name,
              providerLabel: event.provider_info.server_label ?? event.provider_info.plugin_id,
            });
            break;

          case 'tool_call.arguments':
            this.patchLast((m) => m.role === 'tool_call' && !!m.streaming, {
              toolArguments: event.arguments,
            });
            break;

          case 'tool_call.success': {
            let parsedOutput: string = event.output ?? '';
            try {
              const arr = JSON.parse(parsedOutput);
              if (Array.isArray(arr) && arr[0]?.text != null) parsedOutput = arr[0].text;
            } catch { /* leave as-is */ }
            this.patchLast((m) => m.role === 'tool_call' && !!m.streaming, {
              toolOutput: parsedOutput,
              streaming: false,
              collapsed: true,
            });
            break;
          }

          case 'tool_call.failure':
            this.patchLast((m) => m.role === 'tool_call' && !!m.streaming, {
              toolOutput: event.error,
              toolFailed: true,
              streaming: false,
              collapsed: true,
            });
            break;

          case 'message.start':
            this.chatMessages.update((msgs) => [
              ...msgs,
              { role: 'ai', text: '', streaming: true },
            ]);
            break;

          case 'error':
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [
                ...filtered,
                {
                  role: 'error' as const,
                  text:
                    (event as StreamErrorEvent).message ??
                    (event as StreamError2Event).error?.message,
                  date: new Date(),
                },
              ];
            });
            this.streaming.set(false);
            break;

          case 'api.info':
            this.chatMessages.update((msgs) => {
              const filtered = msgs[msgs.length - 1]?.streaming ? msgs.slice(0, -1) : msgs;
              return [...filtered, { role: 'info' as const, text: event.message, date: new Date() }];
            });
            break;
        }
      },
      complete: () => this.streaming.set(false),
      error: () => this.streaming.set(false),
    });

    this.streamService.messageDelta$.subscribe((chunk) => {
      this.chatMessages.update((msgs) => {
        const copy = [...msgs];
        const idx = this.lastIndexWhere(copy, (m) => m.role === 'ai' && !!m.streaming);
        if (idx !== -1) copy[idx] = { ...copy[idx], text: copy[idx].text + chunk };
        return copy;
      });
    });

    this.streamService.chatEnd$.subscribe((result) => {
      const stats = `${result.stats.input_tokens} in · ${result.stats.total_output_tokens} out · ${result.stats.tokens_per_second.toFixed(1)} tok/s`;
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
        this.location.replaceState(`/chat/${result}`);
      }
    });

    this.streamService.chat(
      { model: selectedModelKey, input, store: true, reasoning },
      this.currentChatId() ?? undefined,
    );
  }

  resend(
    selectedModelKey: string,
    reasoning: ChatRequestDto.ReasoningEnum | undefined,
    onChatListRefresh: () => void,
  ): void {
    const input = this.lastUserInput();
    if (!input || this.streaming()) return;
    this.form.setValue({ input });
    this.submit(selectedModelKey, reasoning, onChatListRefresh);
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
}
