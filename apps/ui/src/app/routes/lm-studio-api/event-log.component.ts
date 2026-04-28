import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LmStudioEvent } from '../../lmstudio-stream.service';
import { StreamErrorEvent, StreamError2Event } from '../../lmstudio-stream.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';

export interface EventEntry {
  id: number;
  event: LmStudioEvent;
  timestamp: Date;
}

@Component({
  selector: 'app-event-log',
  animations: [
    trigger('panelAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('240ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('180ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('backdropAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
  imports: [CommonModule, DatePipe, TranslateModule, NgIconComponent],
  viewProviders: [provideIcons({ heroXMark })],
  template: `
    <!-- Backdrop -->
    <div
      class="absolute inset-0 z-10 bg-surface-raised/60 backdrop-blur-sm" @backdropAnim
      (click)="closed.emit()"
    ></div>
    <!-- Panel -->
    <div class="absolute right-0 top-0 bottom-0 z-20 flex flex-col w-80 border-l border-border-default bg-surface-raised shadow-2xl" @panelAnim>
      <div class="flex items-center justify-between px-3 py-2.5 border-b border-border-default shrink-0">
<span class="text-xs text-text-muted uppercase tracking-widest">{{ 'eventLog.title' | translate }}</span>
        <div class="flex items-center gap-2">
<span class="text-xs text-text-muted">{{ 'eventLog.events' | translate: { count: events().length } }}</span>
          <button
            type="button"
            (click)="closed.emit()"
            class="text-text-muted hover:text-zinc-300 transition-colors p-0.5"
          >
            <ng-icon name="heroXMark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1 min-h-0">
        @if (events().length === 0) {
          <div class="flex items-center justify-center h-full text-xs text-zinc-800 uppercase tracking-widest">
            {{ 'eventLog.noEvents' | translate }}
          </div>
        }
        @for (entry of events(); track entry.id) {
          <div
            class="flex items-start gap-2 px-2.5 py-1.5 rounded-lg text-xs border-l-2 animate-slide-up hover:brightness-105 transition-all duration-150"
            [class]="rowClass(entry.event)"
          >
            <span class="shrink-0 font-semibold w-40 truncate" [class]="typeClass(entry.event)">
              {{ entry.event.type }}
            </span>
            <span class="text-text-muted truncate flex-1">{{ summary(entry.event) }}</span>
            <span class="shrink-0 text-text-muted tabular-nums">{{ entry.timestamp | date: 'HH:mm:ss' }}</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class EventLogComponent {
  readonly events = input.required<EventEntry[]>();
  readonly closed = output<void>();

  rowClass(event: LmStudioEvent): string {
    const base = 'border-l-2 ';
    switch (true) {
      case event.type.startsWith('chat.'): return base + 'bg-surface-overlay border-border-strong';
      case event.type.startsWith('message.'): return base + 'bg-success-bg border-success-border';
      case event.type.startsWith('tool_call.'): return base + 'bg-sky-950/30 border-sky-700';
      case event.type.startsWith('prompt_processing.'): return base + 'bg-surface-base border-border-default';
      case event.type.startsWith('reasoning.'): return base + 'bg-reasoning-bg border-reasoning-border';
      case event.type.startsWith('model_load.'): return base + 'bg-amber-950/30 border-amber-700';
      case event.type === 'error': return base + 'bg-red-950/30 border-red-600';
      default: return base + 'bg-surface-base border-border-default';
    }
  }

  typeClass(event: LmStudioEvent): string {
    switch (true) {
      case event.type.startsWith('message.'): return 'text-emerald-400';
      case event.type.startsWith('tool_call.'): return 'text-sky-400';
      case event.type.startsWith('prompt_processing.'): return 'text-text-muted';
      case event.type.startsWith('reasoning.'): return 'text-violet-400';
      case event.type.startsWith('model_load.'): return 'text-amber-400';
      case event.type === 'error': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  }

  summary(event: LmStudioEvent): string {
    switch (event.type) {
      case 'chat.start': return `model: ${event.model_instance_id}`;
      case 'prompt_processing.progress': return `${(event.progress * 100).toFixed(0)}%`;
      case 'tool_call.name': return `${event.tool_name} via ${event.provider_info.plugin_id ?? event.provider_info.server_label}`;
      case 'tool_call.arguments': return JSON.stringify(event.arguments);
      case 'tool_call.success': return `${event.tool} → ${event.output.slice(0, 80)}`;
      case 'tool_call.failure': return `${event.tool} — ${event.error}`;
      case 'message.delta': return JSON.stringify(event.content);
      case 'reasoning.delta': return event.content.slice(0, 80);
      case 'model_load.progress': return `${(event.progress * 100).toFixed(0)}%`;
      case 'chat.end': return `${event.result.stats.total_output_tokens} tokens · ${event.result.stats.tokens_per_second.toFixed(1)} tok/s`;
      case 'error': return (event as StreamErrorEvent).message ?? (event as StreamError2Event).error?.message;
      default: return '';
    }
  }
}
