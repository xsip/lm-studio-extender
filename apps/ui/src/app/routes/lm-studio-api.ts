import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatRequestDto, ChatMetadataService, ChatsService, ModelDto } from '../client';
import { LMStudioService } from '../client/api/lMStudio.service';
import { ChatService } from './lm-studio-api/chat.service';
import { ChatSidebarComponent } from './lm-studio-api/chat-sidebar.component';
import { ChatMessagesComponent } from './lm-studio-api/chat-messages.component';
import { ChatInputComponent } from './lm-studio-api/chat-input.component';
import { EventLogComponent, EventEntry } from './lm-studio-api/event-log.component';
import {
  ModelSelectorComponent,
  ModelReasoningCapability,
} from './lm-studio-api/model-selector.component';
import { InfoComponent } from './lm-studio-api/info.component';
import { LmStudioEvent } from '../lmstudio-stream.service';
import { IconButtonComponent } from '../shared/components/ui/icon-button.component';
import { ButtonComponent } from '../shared/components/ui/button.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-debug',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ChatSidebarComponent,
    ChatMessagesComponent,
    ChatInputComponent,
    EventLogComponent,
    ModelSelectorComponent,
    InfoComponent,
    IconButtonComponent,
    ButtonComponent,
    TranslateModule,
  ],
  providers: [ChatService],
  template: `
    <div
      class="h-screen bg-surface-base text-text-primary flex flex-col overflow-hidden transition-colors duration-200"
    >
      <!-- ── Top bar ── -->
      <div
        class="flex items-center gap-3 border-b border-border-default px-3 py-2.5 shrink-0 bg-surface-raised"
        style="box-shadow: var(--shadow-sm);"
      >
        <ui-button
          variant="secondary"
          size="xs"
          [active]="showChatsSidebar()"
          (clicked)="showChatsSidebar.set(!showChatsSidebar())"
          [title]="'toolbar.toggleChats' | translate"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <span class="hidden sm:inline">{{ 'toolbar.chats' | translate }}</span>
        </ui-button>

        <div class="flex items-center gap-1.5 ml-1">
          <div
            class="w-1.5 h-1.5 rounded-full bg-success-muted animate-pulse"
            style="box-shadow: 0 0 6px var(--color-success-muted);"
          ></div>
          <span class="text-xs text-text-muted tracking-wide font-medium hidden md:block">{{
            'login.appName' | translate
          }}</span>
        </div>

        <div class="relative ml-auto">
          <app-model-selector
            [models]="models()"
            [modelsLoading]="modelsLoading()"
            [selectedModel]="selectedModel()"
            [hasChatOpen]="chatService.hasChatOpen()"
            (modelSelected)="selectModel($event)"
          />
        </div>

        <!--<button
          type="button"
          (click)="showEventPanel.set(!showEventPanel())"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded-lg transition-colors"
          [class]="showEventPanel() ? 'border-tool-border text-tool-text bg-tool-bg' : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'"
          title="Toggle event log"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
          </svg>
          <span class="hidden sm:inline">Events</span>
          @if (events().length > 0) {
            <span class="text-text-muted">{{ events().length }}</span>
          }
        </button>!-->

        <ui-icon-button
          [active]="showInfoPanel()"
          [title]="'toolbar.userInfo' | translate"
          (clicked)="showInfoPanel.set(!showInfoPanel())"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </ui-icon-button>
      </div>

      <!-- ── Body ── -->
      <div
        class="flex flex-1 overflow-hidden relative min-h-0"
        style="background: var(--color-surface-base);"
      >
        @if (showChatsSidebar()) {
          <app-chat-sidebar
            #chatSidebar
            (newChat)="newChat()"
            client="LMSTUDIO"
            [chatList]="chatList()"
            [chatsLoading]="chatsLoading()"
            [currentChatId]="chatService.currentChatId()"
            (chatOpened)="openChat($event)"
            (commitRename)="onRename($event)"
            (chatDeleted)="deleteChat($event)"
            (openChatSettings)="onOpenChatSettings($event)"
            (saveCryptoSettings)="onSaveCryptoSettings($event)"
          />
        }

        <!-- CENTER: Chat window -->
        <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div class="flex flex-col flex-1 min-h-0 overflow-hidden max-w-3xl w-full mx-auto">
            <div #messageContainer class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              <app-chat-messages
                client="LMSTUDIO"
                [isLoadingMessages]="this.isLoadingMessages()"
                [messages]="chatService.chatMessages()"
                [streaming]="chatService.streaming()"
                [showResend]="chatService.showResend()"
                (toggleCollapsed)="chatService.toggleCollapsed($event)"
                (resend)="resend()"
              />
            </div>

            <app-chat-input
              [form]="chatService.form"
              [streaming]="chatService.streaming()"
              [reasoning]="reasoning()"
              [modelReasoningCap]="modelReasoningCap()"
              (submitted)="submit()"
              (reset)="chatService.reset()"
              (reasoningChanged)="selectReasoning($event)"
            />
          </div>
        </div>

        @if (showEventPanel()) {
          <app-event-log [events]="events()" (closed)="showEventPanel.set(false)" />
        }

        @if (showInfoPanel()) {
          <div
            class="w-72 shrink-0 border-l border-border-default bg-surface-raised flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-3 py-2 border-b border-border-default shrink-0"
            >
              <span class="text-xs font-semibold text-text-primary">{{
                'info.info' | translate
              }}</span>
              <ui-icon-button
                size="sm"
                [title]="'common.close' | translate"
                (clicked)="showInfoPanel.set(false)"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ui-icon-button>
            </div>
            <div class="flex-1 overflow-hidden">
              <app-info [uiType]="'LMSTUDIO'" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class LmStudioApi implements OnDestroy, OnInit {
  readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly chatsApi = inject(ChatsService);
  private readonly chatMetaService = inject(ChatMetadataService);
  private readonly lmStudioService = inject(LMStudioService);

  @ViewChild('messageContainer') private messageContainer?: ElementRef<HTMLElement>;
  @ViewChild('chatSidebar') private chatSidebarRef?: ChatSidebarComponent;

  readonly showEventPanel = signal(false);
  readonly showChatsSidebar = signal(true);
  readonly showInfoPanel = signal(false);
  readonly chatList = signal<any[]>([]);
  readonly chatsLoading = signal(false);
  readonly events = signal<EventEntry[]>([]);
  readonly reasoning = signal<ChatRequestDto.ReasoningEnum | undefined>(undefined);

  readonly isLoadingMessages = signal(false);

  readonly models = signal<ModelDto[]>([]);
  readonly modelsLoading = signal(false);
  readonly selectedModel = signal<ModelDto | null>(this.loadStoredModel());

  private static readonly MODEL_STORAGE_KEY = 'lmstudio_selected_model';
  private pendingModelKey: string | null = null;
  private eventCounter = 0;

  readonly modelReasoningCap = computed<ModelReasoningCapability | null>(() => {
    const cap = (this.selectedModel()?.capabilities as any)?.reasoning as
      | ModelReasoningCapability
      | undefined;
    return cap ?? null;
  });

  constructor() {
    effect(() => {
      this.chatService.chatMessages();
      this.scrollToBottom(this.messageContainer);
    });
    effect(() => {
      const cap = this.modelReasoningCap();
      if (!cap && this.reasoning()) this.reasoning.set(undefined);
      if (!this.chatService.hasChatOpen()) this.reasoning.set((cap?.default as any) ?? undefined);
    });
  }

  ngOnInit(): void {
    this.loadChatList();
    this.loadModels();

    const chatId = this.route.snapshot.paramMap.get('chatId');
    this.chatService.currentChatId.set(chatId);

    if (chatId) {
      this.loadChatHistory(chatId);
      this.loadChatMeta(chatId);
    }
  }

  ngOnDestroy(): void {
    this.chatService.destroy();
  }

  // ── Model management ──────────────────────────────────────────────────────

  private loadStoredModel(): ModelDto | null {
    try {
      const raw = localStorage.getItem(LmStudioApi.MODEL_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ModelDto) : null;
    } catch {
      return null;
    }
  }

  selectModel(model: ModelDto): void {
    this.selectedModel.set(model);
    try {
      localStorage.setItem(LmStudioApi.MODEL_STORAGE_KEY, JSON.stringify(model));
    } catch {
      /* ignore */
    }
  }

  private loadModels(): void {
    this.modelsLoading.set(true);
    this.lmStudioService.getModels().subscribe({
      next: (res) => {
        const llms = res.models.filter((m) => m.type === ModelDto.TypeEnum.Llm);
        this.models.set(llms);
        if (this.pendingModelKey) {
          const match = llms.find((m) => m.key === this.pendingModelKey);
          if (match) this.selectModel(match);
          this.pendingModelKey = null;
        } else if (!this.selectedModel() && llms.length > 0) {
          this.selectModel(llms[0]);
        }
        this.modelsLoading.set(false);
      },
      error: () => this.modelsLoading.set(false),
    });
  }

  // ── Chat list ─────────────────────────────────────────────────────────────

  loadChatList(): void {
    this.chatsLoading.set(true);
    this.chatMetaService.listChatMetadata().subscribe({
      next: (list) => {
        const sorted = [...list].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        this.chatList.set(sorted);
        this.chatsLoading.set(false);
      },
      error: () => this.chatsLoading.set(false),
    });
  }

  private loadChatMeta(chatId: string): void {
    this.chatMetaService.getChatMetadata(chatId).subscribe({
      next: (meta) => {
        if (meta.usedModel) {
          const modelList = this.models();
          if (modelList.length > 0) {
            const match = modelList.find((m) => m.key === meta.usedModel);
            if (match) this.selectModel(match);
          } else {
            this.pendingModelKey = meta.usedModel;
          }
        }
        const reasoningValue = meta.reasoningMode as ChatRequestDto.ReasoningEnum | undefined;
        const allowed = this.modelReasoningCap()?.allowed_options;
        if (reasoningValue && (!allowed || allowed.includes(reasoningValue))) {
          this.reasoning.set(reasoningValue);
        }
      },
    });
  }

  private loadChatHistory(chatId: string): void {
    this.isLoadingMessages.set(true);
    this.chatsApi.getChatEntries(chatId).subscribe((res) => {
      const messages: any[] = [];
      for (const entry of res) {
        messages.push({
          role: 'user',
          text: entry.request.input as string,
          date: new Date(entry.createdAt),
        });

        const statsStr = entry.response.stats
          ? `${entry.response.stats.input_tokens} in · ${entry.response.stats.total_output_tokens} out · ${entry.response.stats.tokens_per_second?.toFixed(1)} tok/s`
          : undefined;

        for (const output of entry.response.output) {
          if (output.type === 'reasoning') {
            messages.push({
              role: 'reasoning',
              text: (output as any).content ?? '',
              date: new Date(entry.createdAt),
              collapsed: true,
            });
          } else if (output.type === 'tool_call') {
            const tc = output as any;
            let parsedOutput: string = tc.output ?? '';
            try {
              const arr = JSON.parse(parsedOutput);
              if (Array.isArray(arr) && arr[0]?.text != null) parsedOutput = arr[0].text;
            } catch {
              /* leave as-is */
            }
            messages.push({
              role: 'tool_call',
              text: tc.tool ?? '',
              toolName: tc.tool ?? '',
              toolArguments: tc.arguments ?? {},
              toolOutput: parsedOutput,
              providerLabel:
                tc.provider_info?.server_label ?? tc.provider_info?.plugin_id ?? undefined,
              date: new Date(entry.createdAt),
              collapsed: true,
            });
          } else if (output.type === 'message') {
            messages.push({
              role: 'ai',
              text: (output as any).content ?? '',
              date: new Date(entry.createdAt),
              stats: statsStr,
            });
          }
        }
      }
      this.isLoadingMessages.set(false);
      this.chatService.chatMessages.set(messages);
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  openChat(chatId: string): void {
    if (this.chatService.streaming()) return;
    this.chatService.chatMessages.set([]);
    this.events.set([]);
    this.chatService.currentChatId.set(chatId);
    this.router.navigate(['/chat-lm-studio', chatId]);
    this.loadChatHistory(chatId);
    this.loadChatMeta(chatId);
  }

  newChat(): void {
    if (this.chatService.streaming()) return;
    this.chatService.chatMessages.set([]);
    this.events.set([]);
    this.chatService.currentChatId.set(null);
    this.router.navigate(['/chat-lm-studio']);
  }

  // ── Messaging ─────────────────────────────────────────────────────────────

  submit(): void {
    this.chatService.submit(this.selectedModel()?.key ?? '', this.reasoning(), () =>
      this.loadChatList(),
    );
  }

  resend(): void {
    this.chatService.resend(this.selectedModel()?.key ?? '', this.reasoning(), () =>
      this.loadChatList(),
    );
  }

  selectReasoning(value: ChatRequestDto.ReasoningEnum): void {
    this.reasoning.set(value);
    const chatId = this.chatService.currentChatId();
    if (chatId) {
      this.chatMetaService.updateChatMetadata(chatId, { reasoningMode: value }).subscribe();
    }
  }

  // ── Chat rename / delete ──────────────────────────────────────────────────

  onRename({ chatId, name }: { chatId: string; name: string }): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    this.chatMetaService.updateChatMetadata(chatId, { name: trimmed }).subscribe({
      next: () => {
        this.chatList.update((list) =>
          list.map((c) => (c._id === chatId ? { ...c, name: trimmed } : c)),
        );
      },
    });
  }

  deleteChat(chatId: string): void {
    this.chatMetaService.deleteChatMetadata(chatId).subscribe({
      next: () => {
        this.chatList.update((list) => list.filter((c) => c._id !== chatId));
        if (this.chatService.currentChatId() === chatId) this.newChat();
      },
    });
  }

  onOpenChatSettings(chatId: string): void {
    this.chatMetaService.getChatMetadata(chatId).subscribe({
      next: (chat) => {
        this.chatSidebarRef?.loadSettingsData(
          chat.name ?? '',
          chat.useCrypto ?? false,
          chat.cryptoKey ?? '',
          chat.useInvoke ?? false,
          chat.invokeAiModelToUse ?? undefined
        );
      },
      error: () => {
        this.chatSidebarRef?.loadSettingsData(
          '',
          false,
          '',
          false,
           undefined,
        );
      },
    });
  }

  onSaveCryptoSettings({
    chatId,
    name,
    useCrypto,
    cryptoKey,
  }: {
    chatId: string;
    name: string;
    useCrypto: boolean;
    cryptoKey: string;
  }): void {
    this.chatMetaService.updateChatMetadata(chatId, { name, useCrypto, cryptoKey }).subscribe({
      next: () => {
        this.chatList.update((list) =>
          list.map((c) => (c._id === chatId ? { ...c, name, useCrypto } : c)),
        );
      },
    });
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  private scrollToBottom(ref?: ElementRef<HTMLElement>): void {
    if (!ref?.nativeElement) return;
    const el = ref.nativeElement;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= 50) {
      setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 0);
    }
  }
}
