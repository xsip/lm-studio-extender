import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  ChatCompletionChunkDto,
  ChatStreamOpenAiRequest,
  CreateChatMetadataDto,
} from '../../client';

export type OpenAiEvent = ChatCompletionChunkDto;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class OpenAiStreamService {
  private _events$ = new ReplaySubject<OpenAiEvent>(Infinity);
  private _messageDelta$ = new ReplaySubject<string>(Infinity);
  private _reasoningDelta$ = new ReplaySubject<string>(Infinity);
  private _chatEnd$ = new ReplaySubject<OpenAiChatEnd>(1);
  private _chatCreated$ = new ReplaySubject<string>(1);

  get events$(): Observable<OpenAiEvent> {
    return this._events$.asObservable();
  }
  get messageDelta$(): Observable<string> {
    return this._messageDelta$.asObservable();
  }
  get reasoningDelta$(): Observable<string> {
    return this._reasoningDelta$.asObservable();
  }
  get chatEnd$(): Observable<OpenAiChatEnd> {
    return this._chatEnd$.asObservable();
  }
  get newChatCreated$(): Observable<string> {
    return this._chatCreated$.asObservable();
  }

  router = inject(Router);

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async chat(
    body: ChatStreamOpenAiRequest,
    chatId?: string,
    newChatOptions?: {
      name?: string;
      useCrypto?: boolean;
      cryptoKey?: string;
      openAiEndpointPreference?: CreateChatMetadataDto.OpenAiEndpointPreferenceEnum;
    },
  ): Promise<void> {
    try {
      const token = localStorage.getItem('jwt_token');
      const params = new URLSearchParams();
      if (chatId) params.set('internalChatId', chatId);
      if (!chatId && newChatOptions) {
        if (newChatOptions.name) params.set('chatName', newChatOptions.name);
        if (newChatOptions.useCrypto != null)
          params.set('useCrypto', String(newChatOptions.useCrypto));
        if (newChatOptions.cryptoKey) params.set('cryptoKey', newChatOptions.cryptoKey);
        if (newChatOptions.openAiEndpointPreference)
          params.set('openAiEndpointPreference', newChatOptions.openAiEndpointPreference);
      }
      const queryString = params.toString();
      const url = `api/openai/completions-stream${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok || !response.body) {
        if (response.status === 401) {
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
          return;
        } else if (response.status === 403 || response.status === 500) {
          this._events$.next({
            type: 'api.info',
            message: (await response.json())?.message ?? 'Request failed',
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

  private parseSseBlock(block: string): OpenAiEvent | null {
    let dataLine: string | null = null;

    for (const line of block.split('\n')) {
      if (line.startsWith('data:')) {
        dataLine = line.slice('data:'.length).trim();
      }
    }

    if (!dataLine || dataLine === '[DONE]') return null;

    try {
      return JSON.parse(dataLine) as OpenAiEvent;
    } catch {
      console.warn('[OpenAiStreamService] Failed to parse SSE data:', dataLine);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Dispatch
  // ---------------------------------------------------------------------------

  private dispatch(event: OpenAiEvent): void {
    this._events$.next(event);


    switch (event.) {
      case 'created_chat':
        this._chatCreated$.next((event as OpenAiStreamCreatedChatEvent).result);
        this._chatCreated$.complete();
        break;

      case 'response.output_text.delta':
        this._messageDelta$.next((event as ResponseOutputTextDeltaEvent).delta);
        break;

      case 'response.reasoning_text.delta':
        this._reasoningDelta$.next((event as ResponseReasoningTextDeltaEvent).delta);
        break;

      case 'response.completed': {
        const completed = event as ResponseCompletedEvent;
        this._chatEnd$.next({
          responseId: completed.response.id,
          model: completed.response.model,
          usage: completed.response.usage,
        });
        this._chatEnd$.complete();
        break;
      }

      case 'response.failed': {
        const failed = event as ResponseFailedEvent;
        console.error('[OpenAiStreamService] Response failed:', failed.response.error);
        break;
      }

      case 'error':
        console.error(
          '[OpenAiStreamService] Stream error:',
          (event as OpenAiStreamErrorEvent).message ??
            (event as OpenAiStreamErrorEvent).error?.message,
        );
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
    this._events$ = new ReplaySubject<OpenAiEvent>(Infinity);
    this._messageDelta$ = new ReplaySubject<string>(Infinity);
    this._reasoningDelta$ = new ReplaySubject<string>(Infinity);
    this._chatEnd$ = new ReplaySubject<OpenAiChatEnd>(1);
    this._chatCreated$ = new ReplaySubject<string>(1);
  }
}
