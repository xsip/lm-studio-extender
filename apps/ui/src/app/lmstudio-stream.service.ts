import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ChatRequestDto, ChatResponseDto } from './client';
import { Router } from '@angular/router'; // adjust import path // adjust import path

// ---------------------------------------------------------------------------
// Event payload interfaces (based on real SSE output)
// ---------------------------------------------------------------------------

export interface ChatStartEvent {
  type: 'chat.start';
  model_instance_id: string;
}

export interface ModelLoadStartEvent {
  type: 'model_load.start';
}

export interface ModelLoadProgressEvent {
  type: 'model_load.progress';
  progress: number;
}

export interface ModelLoadEndEvent {
  type: 'model_load.end';
}

export interface PromptProcessingStartEvent {
  type: 'prompt_processing.start';
}

export interface PromptProcessingProgressEvent {
  type: 'prompt_processing.progress';
  progress: number;
}

export interface PromptProcessingEndEvent {
  type: 'prompt_processing.end';
}

export interface ReasoningStartEvent {
  type: 'reasoning.start';
}

export interface ReasoningDeltaEvent {
  type: 'reasoning.delta';
  content: string;
}

export interface ReasoningEndEvent {
  type: 'reasoning.end';
}

export interface ToolCallStartEvent {
  type: 'tool_call.start';
}

export interface ToolCallNameEvent {
  type: 'tool_call.name';
  tool_name: string;
  provider_info: ProviderInfo;
}

export interface ToolCallArgumentsEvent {
  type: 'tool_call.arguments';
  tool: string;
  arguments: Record<string, unknown>;
  provider_info: ProviderInfo;
}

export interface ToolCallSuccessEvent {
  type: 'tool_call.success';
  tool: string;
  arguments: Record<string, unknown>;
  output: string;
  provider_info: ProviderInfo;
}

export interface ToolCallFailureEvent {
  type: 'tool_call.failure';
  tool: string;
  error: string;
  provider_info: ProviderInfo;
}

export interface MessageStartEvent {
  type: 'message.start';
}

export interface MessageDeltaEvent {
  type: 'message.delta';
  content: string; // NOTE: field is "content", not "delta"
}

export interface ChatCreatedEvent {
  type: 'created_chat';
  result: string;
}

export interface MessageEndEvent {
  type: 'message.end';
}

export interface StreamErrorEvent {
  type: 'error';
  message: string;
}
export interface StreamError2Event {
  type: 'error';
  error:  {
    message: string;
    type: string;
    param: string;
  }
}
export interface StreamApiInfoEvent {
  type: 'api.info';
  message: string;
}

export interface ChatEndResult {
  model_instance_id: string;
  output: unknown[];
  stats: {
    input_tokens: number;
    total_output_tokens: number;
    reasoning_output_tokens: number;
    tokens_per_second: number;
    time_to_first_token_seconds: number;
    model_load_time_seconds?: number;
  };
  response_id?: string;
}

export interface ChatEndEvent {
  type: 'chat.end';
  result: ChatResponseDto; // NOTE: payload is nested under "result"
}

export interface ProviderInfo {
  type: 'plugin' | 'ephemeral_mcp';
  plugin_id?: string;
  server_label?: string;
}

export type LmStudioEvent =
  | ChatStartEvent
  | ModelLoadStartEvent
  | ModelLoadProgressEvent
  | ModelLoadEndEvent
  | PromptProcessingStartEvent
  | PromptProcessingProgressEvent
  | PromptProcessingEndEvent
  | ReasoningStartEvent
  | ReasoningDeltaEvent
  | ReasoningEndEvent
  | ToolCallStartEvent
  | ToolCallNameEvent
  | ToolCallArgumentsEvent
  | ToolCallSuccessEvent
  | ToolCallFailureEvent
  | MessageStartEvent
  | MessageDeltaEvent
  | ChatCreatedEvent
  | MessageEndEvent
  | StreamErrorEvent
  | StreamError2Event
  | StreamApiInfoEvent
  | ChatEndEvent;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class LmStudioStreamService {
  private _events$ = new ReplaySubject<LmStudioEvent>(Infinity);
  private _messageDelta$ = new ReplaySubject<string>(Infinity);
  private _reasoningDelta$ = new ReplaySubject<string>(Infinity);
  private _chatEnd$ = new ReplaySubject<ChatResponseDto>(1);
  private _chatCreated$ = new ReplaySubject<string>(1);

  get events$(): Observable<LmStudioEvent> {
    return this._events$.asObservable();
  }
  get messageDelta$(): Observable<string> {
    return this._messageDelta$.asObservable();
  }
  get reasoningDelta$(): Observable<string> {
    return this._reasoningDelta$.asObservable();
  }
  /** Emits exactly once when chat.end arrives, with the full ChatResponseDto result. */
  get chatEnd$(): Observable<ChatResponseDto> {
    return this._chatEnd$.asObservable();
  }

    get newChatCreated$(): Observable<string> {
    return this._chatCreated$.asObservable();
  }

  router = inject(Router);

  constructor() {}

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async chat(dto: ChatRequestDto, chatId?: string): Promise<void> {
    // reset() is now called EXTERNALLY before subscribing
    try {
      const token = localStorage.getItem('jwt_token');

      const response = await fetch(
        `api/lmstudio/chat-stream${chatId ? `?internalChatId=${chatId}` : ''}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(dto),
        },
      );

      if (!response.ok || !response.body) {
        if (response.status === 401) {
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
          return;
        } else if (response.status === 403) {
          this._events$.next({
            type: 'api.info',
            message: (await response.json())?.message,
          });
          this._events$.complete();
        } else if (response.status === 500) {
          this._events$.next({
            type: 'api.info',
            message: (await response.json())?.message,
          });
          this._events$.complete();
        }

        return;
      }

      await this.consumeStream(response.body);

      this._events$.complete();
      this._messageDelta$.complete();
      this._reasoningDelta$.complete();
    } catch (err) {
      this._events$.error(err);
    }
  }
  // ---------------------------------------------------------------------------
  // Stream consumption
  // ---------------------------------------------------------------------------

  private async consumeStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split(/\n\n/);
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const event = this.parseSseBlock(part);
        if (event) this.dispatch(event);
      }
    }

    if (buffer.trim()) {
      const event = this.parseSseBlock(buffer);
      if (event) this.dispatch(event);
    }
  }

  // ---------------------------------------------------------------------------
  // SSE parsing
  // ---------------------------------------------------------------------------

  private parseSseBlock(block: string): LmStudioEvent | null {
    let eventType: string | null = null;
    let dataLine: string | null = null;

    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        eventType = line.slice('event:'.length).trim();
      } else if (line.startsWith('data:')) {
        dataLine = line.slice('data:'.length).trim();
      }
    }

    if (!eventType || !dataLine) return null;

    try {
      // Data already contains the "type" field matching the event name
      return JSON.parse(dataLine) as LmStudioEvent;
    } catch {
      console.warn('[LmStudioStreamService] Failed to parse SSE data:', dataLine);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Dispatch
  // ---------------------------------------------------------------------------

  private dispatch(event: LmStudioEvent): void {
    this._events$.next(event);

    switch (event.type) {
      case 'created_chat':
        this._chatCreated$.next(event.result);
        this._chatCreated$.complete();
        break;
      case 'message.delta':
        this._messageDelta$.next(event.content);
        break;
      case 'reasoning.delta':
        this._reasoningDelta$.next(event.content);
        break;
      case 'chat.end':
        this._chatEnd$.next(event.result);
        this._chatEnd$.complete();
        break;
      case 'error':
        console.error('[LmStudioStreamService] Stream error event:', (event as StreamErrorEvent).message ?? (event as StreamError2Event).error?.message);
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  reset(): void {
    this._events$.complete();
    this._chatCreated$.complete();
    this._messageDelta$.complete();
    this._reasoningDelta$.complete();
    this._events$ = new ReplaySubject<LmStudioEvent>(Infinity);
    this._messageDelta$ = new ReplaySubject<string>(Infinity);
    this._reasoningDelta$ = new ReplaySubject<string>(Infinity);
    this._chatEnd$ = new ReplaySubject<ChatResponseDto>(1);
    this._chatCreated$ = new ReplaySubject<string>(1);
  }

  // ---------------------------------------------------------------------------
}
