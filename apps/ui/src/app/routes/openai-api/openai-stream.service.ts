import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  ChatMetadataDto,
  ChatStreamOpenAiRequest,
  CreateChatMetadataDto,
  ResponseAudioDeltaEventDto,
  ResponseAudioDoneEventDto,
  ResponseAudioTranscriptDeltaEventDto,
  ResponseAudioTranscriptDoneEventDto,
  ResponseCodeInterpreterCallCodeDeltaEventDto,
  ResponseCodeInterpreterCallCodeDoneEventDto,
  ResponseCodeInterpreterCallCompletedEventDto,
  ResponseCodeInterpreterCallInProgressEventDto,
  ResponseCodeInterpreterCallInterpretingEventDto,
  ResponseCompletedEventDto,
  ResponseContentPartAddedEventDto,
  ResponseContentPartDoneEventDto,
  ResponseCreatedEventDto,
  ResponseCustomToolCallInputDeltaEventDto,
  ResponseCustomToolCallInputDoneEventDto,
  ResponseErrorEventDto,
  ResponseFailedEventDto,
  ResponseFileSearchCallCompletedEventDto,
  ResponseFileSearchCallInProgressEventDto,
  ResponseFileSearchCallSearchingEventDto,
  ResponseFunctionCallArgumentsDeltaEventDto,
  ResponseFunctionCallArgumentsDoneEventDto,
  ResponseImageGenCallCompletedEventDto,
  ResponseImageGenCallGeneratingEventDto,
  ResponseImageGenCallInProgressEventDto,
  ResponseImageGenCallPartialImageEventDto,
  ResponseIncompleteEventDto,
  ResponseInProgressEventDto,
  ResponseMcpCallArgumentsDeltaEventDto,
  ResponseMcpCallArgumentsDoneEventDto,
  ResponseMcpCallCompletedEventDto,
  ResponseMcpCallFailedEventDto,
  ResponseMcpCallInProgressEventDto,
  ResponseMcpListToolsCompletedEventDto,
  ResponseMcpListToolsFailedEventDto,
  ResponseMcpListToolsInProgressEventDto,
  ResponseOutputItemAddedEventDto,
  ResponseOutputItemDoneEventDto,
  ResponseOutputTextAnnotationAddedEventDto,
  ResponseQueuedEventDto,
  ResponseReasoningSummaryPartAddedEventDto,
  ResponseReasoningSummaryPartDoneEventDto,
  ResponseReasoningSummaryTextDeltaEventDto,
  ResponseReasoningSummaryTextDoneEventDto,
  ResponseReasoningTextDeltaEventDto,
  ResponseReasoningTextDoneEventDto,
  ResponseRefusalDeltaEventDto,
  ResponseRefusalDoneEventDto,
  ResponseTextDeltaEventDto,
  ResponseTextDoneEventDto,
  ResponseWebSearchCallCompletedEventDto,
  ResponseWebSearchCallInProgressEventDto,
  ResponseWebSearchCallSearchingEventDto,
} from '../../client';
import InvokeAiModelToUseEnum = ChatMetadataDto.InvokeAiModelToUseEnum;

// ---------------------------------------------------------------------------
// OpenAI Responses API SSE event interfaces
// ---------------------------------------------------------------------------

export interface ResponseCreatedEvent {
  type: 'response.created';
  response: { id: string; model: string; status: string };
}

export interface ResponseInProgressEvent {
  type: 'response.in_progress';
  response: { id: string; model: string; status: string };
}

export interface ResponseOutputItemAddedEvent {
  type: 'response.output_item.added';
  output_index: number;
  item: { id: string; type: string; status?: string };
}

export interface ResponseOutputItemDoneEvent {
  type: 'response.output_item.done';
  output_index: number;
  item: { id: string; type: string; status?: string; content?: any[]; summary?: any[] };
}

export interface ResponseContentPartAddedEvent {
  type: 'response.content_part.added';
  item_id: string;
  output_index: number;
  content_index: number;
  part: { type: string; text: string };
}

export interface ResponseContentPartDoneEvent {
  type: 'response.content_part.done';
  item_id: string;
  output_index: number;
  content_index: number;
  part: { type: string; text: string };
}

export interface ResponseOutputTextDeltaEvent {
  type: 'response.output_text.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ResponseOutputTextDoneEvent {
  type: 'response.output_text.done';
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
}

export interface ResponseReasoningTextDeltaEvent {
  type: 'response.reasoning_text.delta';
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface ResponseReasoningTextDoneEvent {
  type: 'response.reasoning_text.done';
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
}

export interface ResponseMcpListToolsEvent {
  type: 'response.mcp_list_tools.in_progress' | 'response.mcp_list_tools.completed';
  output_index: number;
  item_id: string;
}

export interface ResponseMcpCallInProgressEvent {
  type: 'response.mcp_call.in_progress';
  output_index: number;
  item_id: string;
}

export interface ResponseMcpCallDoneEvent {
  type: 'response.mcp_call.completed' | 'response.mcp_call.failed';
  output_index: number;
  item_id: string;
}

export interface ResponseCompletedEvent {
  type: 'response.completed';
  response: {
    id: string;
    model: string;
    status: string;
    usage?: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
      output_tokens_details?: { reasoning_tokens: number };
    };
    output: Array<{
      id: string;
      type: string;
      content?: Array<{ type: string; text: string }>;
      summary?: Array<{ type: string; text: string }>;
    }>;
  };
}

export interface ResponseFailedEvent {
  type: 'response.failed';
  response: { id: string; status: string; error?: { message: string; code: string } };
}

export interface OpenAiStreamCreatedChatEvent {
  type: 'created_chat';
  result: string;
}

export interface OpenAiStreamApiInfoEvent {
  type: 'api.info';
  message: string;
}

export interface CustomReportMcpProgressEvent {
  type: 'report_mcp_progress';
  progressToken: string;
  progress: string;
  total: string;
  message?: string
}

export interface OpenAiStreamErrorEvent {
  type: 'error';
  message?: string;
  error?: { message: string; type: string; param: string };
}

// Intermediate tracking for tool calls
export interface McpItemTracking {
  itemId: string;
  serverLabel?: string;
  toolName?: string;
  input?: Record<string, unknown>;
  outputIndex: number;
}
/*
export type OpenAiEvent =
  | ResponseCreatedEvent
  | ResponseInProgressEvent
  | ResponseOutputItemAddedEvent
  | ResponseOutputItemDoneEvent
  | ResponseContentPartAddedEvent
  | ResponseContentPartDoneEvent
  | ResponseOutputTextDeltaEvent
  | ResponseOutputTextDoneEvent
  | ResponseReasoningTextDeltaEvent
  | ResponseReasoningTextDoneEvent
  | ResponseMcpListToolsEvent
  | ResponseMcpCallInProgressEvent
  | ResponseMcpCallDoneEvent
  | ResponseCompletedEvent
  | ResponseFailedEvent
  | OpenAiStreamCreatedChatEvent
  | OpenAiStreamApiInfoEvent
  | OpenAiStreamErrorEvent;
 */
export type OpenAiEvent =
  | ResponseAudioDeltaEventDto
  | ResponseAudioDoneEventDto
  | ResponseAudioTranscriptDeltaEventDto
  | ResponseAudioTranscriptDoneEventDto
  | ResponseCodeInterpreterCallCodeDeltaEventDto
  | ResponseCodeInterpreterCallCodeDoneEventDto
  | ResponseCodeInterpreterCallCompletedEventDto
  | ResponseCodeInterpreterCallInProgressEventDto
  | ResponseCodeInterpreterCallInterpretingEventDto
  | ResponseCompletedEventDto
  | ResponseContentPartAddedEventDto
  | ResponseContentPartDoneEventDto
  | ResponseCreatedEventDto
  | ResponseErrorEventDto
  | ResponseFileSearchCallCompletedEventDto
  | ResponseFileSearchCallInProgressEventDto
  | ResponseFileSearchCallSearchingEventDto
  | ResponseFunctionCallArgumentsDeltaEventDto
  | ResponseFunctionCallArgumentsDoneEventDto
  | ResponseInProgressEventDto
  | ResponseFailedEventDto
  | ResponseIncompleteEventDto
  | ResponseOutputItemAddedEventDto
  | ResponseOutputItemDoneEventDto
  | ResponseReasoningSummaryPartAddedEventDto
  | ResponseReasoningSummaryPartDoneEventDto
  | ResponseReasoningSummaryTextDeltaEventDto
  | ResponseReasoningSummaryTextDoneEventDto
  | ResponseReasoningTextDeltaEventDto
  | ResponseReasoningTextDoneEventDto
  | ResponseRefusalDeltaEventDto
  | ResponseRefusalDoneEventDto
  | ResponseTextDeltaEventDto
  | ResponseTextDoneEventDto
  | ResponseWebSearchCallCompletedEventDto
  | ResponseWebSearchCallInProgressEventDto
  | ResponseWebSearchCallSearchingEventDto
  | ResponseImageGenCallCompletedEventDto
  | ResponseImageGenCallGeneratingEventDto
  | ResponseImageGenCallInProgressEventDto
  | ResponseImageGenCallPartialImageEventDto
  | ResponseMcpCallArgumentsDeltaEventDto
  | ResponseMcpCallArgumentsDoneEventDto
  | ResponseMcpCallCompletedEventDto
  | ResponseMcpCallFailedEventDto
  | ResponseMcpCallInProgressEventDto
  | ResponseMcpListToolsCompletedEventDto
  | ResponseMcpListToolsFailedEventDto
  | ResponseMcpListToolsInProgressEventDto
  | ResponseOutputTextAnnotationAddedEventDto
  | ResponseQueuedEventDto
  | ResponseCustomToolCallInputDeltaEventDto
  | ResponseCustomToolCallInputDoneEventDto
  // custom
  | OpenAiStreamCreatedChatEvent
  | OpenAiStreamApiInfoEvent
  | CustomReportMcpProgressEvent;

export interface OpenAiChatEnd {
  responseId: string;
  model: string;
  usage?: ResponseCompletedEvent['response']['usage'];
}

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
      useInvoke?: boolean;
      invokeAiModelToUse?: InvokeAiModelToUseEnum;
    },
  ): Promise<void> {
    try {
      const token = localStorage.getItem('jwt_token');
      const params = new URLSearchParams();
      if (chatId) params.set('internalChatId', chatId);
      if (!chatId && newChatOptions) {

        if (newChatOptions.useInvoke && newChatOptions.invokeAiModelToUse) {
          params.set('useInvoke', String(newChatOptions.useInvoke));
          params.set('invokeModel', newChatOptions.invokeAiModelToUse);

        }
        if (newChatOptions.name) params.set('chatName', newChatOptions.name);
        if (newChatOptions.useCrypto != null)
          params.set('useCrypto', String(newChatOptions.useCrypto));
        if (newChatOptions.cryptoKey) params.set('cryptoKey', newChatOptions.cryptoKey);
        if (newChatOptions.openAiEndpointPreference)
          params.set('openAiEndpointPreference', newChatOptions.openAiEndpointPreference);
      }
      const queryString = params.toString();
      const url = `api/openai/chat-stream${queryString ? `?${queryString}` : ''}`;

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

    switch (event.type) {
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
