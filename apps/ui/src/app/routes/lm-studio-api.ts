import { animate, style, transition, trigger } from '@angular/animations';
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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars3, heroUser, heroXMark } from '@ng-icons/heroicons/outline';

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
    NgIconComponent,
  ],
  viewProviders: [provideIcons({ heroBars3, heroUser, heroXMark })],
  animations: [
    trigger('sidebarAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '240ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '180ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateX(-100%)' }),
        ),
      ]),
    ]),
    trigger('infoPanelAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '240ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '180ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateX(100%)' }),
        ),
      ]),
    ]),
  ],
  providers: [ChatService],
  template: `
    <div
      class="h-screen bg-surface-base text-text-primary flex flex-col overflow-hidden transition-colors duration-300"
    >
      <!-- ── Top bar ── -->
      <div
        class="flex items-center gap-2 border-b border-border-default px-3 py-2 shrink-0 bg-surface-raised relative z-10 animate-slide-down"
        style="box-shadow: 0 1px 0 var(--color-border-subtle), var(--shadow-sm);"
      >
        <div
          class="w-7 h-7 rounded-2xl flex items-center justify-center"
          style="box-shadow: 0 8px 32px var(--color-accent-glow);"
        >
          <img src="logo-cropped.png" class="w-full h-full text-white" alt="logo" />
        </div>
        <!-- Sidebar toggle -->
        <ui-button
          variant="secondary"
          size="xs"
          [active]="showChatsSidebar()"
          (clicked)="showChatsSidebar.set(!showChatsSidebar())"
          [title]="'toolbar.toggleChats' | translate"
        >
          <ng-icon name="heroBars3" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ 'toolbar.chats' | translate }}</span>
        </ui-button>

        <!-- Brand / status -->
        <div class="flex items-center gap-2 ml-1">
          <div
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-overlay border border-border-subtle"
          >
            <div
              class="w-1.5 h-1.5 rounded-full bg-success-muted animate-glow-pulse shrink-0"
              style="box-shadow: 0 0 6px var(--color-success-muted);"
            ></div>
            <span
              class="text-[10px] text-text-muted tracking-wider font-medium uppercase hidden md:block"
            >
              {{ 'login.appName' | translate }}
            </span>
          </div>
        </div>

        <!-- Model selector -->
        <div class="relative ml-auto">
          <app-model-selector
            [models]="models()"
            [modelsLoading]="modelsLoading()"
            [selectedModel]="selectedModel()"
            [hasChatOpen]="chatService.hasChatOpen()"
            (modelSelected)="selectModel($event)"
          />
        </div>

        <!-- Info panel toggle -->
        <ui-icon-button
          [active]="showInfoPanel()"
          [title]="'toolbar.userInfo' | translate"
          (clicked)="showInfoPanel.set(!showInfoPanel())"
        >
          <ng-icon name="heroUser" class="w-3.5 h-3.5" />
        </ui-icon-button>
      </div>

      <!-- ── Body ── -->
      <div class="flex flex-1 overflow-hidden relative min-h-0">
        <!-- Sidebar -->
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
            @sidebarAnim
          />
        }

        <!-- CENTER: Chat window -->
        <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <!-- Subtle dot bg -->
          <div class="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none"></div>

          <div
            class="flex flex-col flex-1 min-h-0 overflow-hidden max-w-3xl w-full mx-auto relative"
          >
            <div #messageContainer class="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
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
            style="box-shadow: -4px 0 20px rgba(0,0,0,0.08);"
            @infoPanelAnim
          >
            <div
              class="flex items-center justify-between px-4 py-2.5 border-b border-border-default shrink-0"
            >
              <span class="text-xs font-semibold text-text-primary tracking-wide">{{
                'info.info' | translate
              }}</span>
              <ui-icon-button
                size="sm"
                [title]="'common.close' | translate"
                (clicked)="showInfoPanel.set(false)"
              >
                <ng-icon name="heroXMark" class="w-3.5 h-3.5" />
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
          chat.invokeAiModelToUse ?? undefined,
        );
      },
      error: () => {
        this.chatSidebarRef?.loadSettingsData('', false, '', false, undefined);
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
