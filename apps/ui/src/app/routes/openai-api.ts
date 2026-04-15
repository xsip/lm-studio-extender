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
import {
  ChatMetadataService, ChatRequestDto,
  ChatsService,
  ContentDto,
  EasyInputMessageDtoContentInner,
  MessageDtoContentInner,
  ReasoningDto,
  ResponseInputFileDto,
  ResponseInputImageDto,
  ResponseInputTextDto,
  ResponseOutputMessageDtoContentInner,
  ResponseOutputRefusalDto,
  ResponseOutputTextDto,
} from '../client';
import { OpenAIService } from '../client/api/openAI.service';
import { ModelOpenAiDto } from '../client/model/modelOpenAiDto';
import { ChatService } from './openai-api/chat.service';
import { OpenAiModelSelectorComponent } from './openai-api/model-selector.component';

// Re-use the shared sub-components from lm-studio-api — they are generic enough
import { ChatSidebarComponent } from './lm-studio-api/chat-sidebar.component';
import { ChatMessagesComponent } from './lm-studio-api/chat-messages.component';
import { ChatInputComponent } from './lm-studio-api/chat-input.component';
import { InfoComponent } from './lm-studio-api/info.component';
import { ModelReasoningCapability } from './lm-studio-api/model-selector.component';

@Component({
  selector: 'app-openai-api',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ChatSidebarComponent,
    ChatMessagesComponent,
    ChatInputComponent,
    OpenAiModelSelectorComponent,
    InfoComponent,
  ],
  providers: [ChatService],
  template: `
    <div
      class="h-screen bg-surface-base text-text-primary flex flex-col overflow-hidden transition-colors duration-200"
    >
      <!-- ── Top bar ── -->
      <div
        class="flex items-center gap-3 border-b border-border-default px-3 py-2.5 shrink-0 bg-surface-raised"
      >
        <button
          type="button"
          (click)="showChatsSidebar.set(!showChatsSidebar())"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border-default rounded-lg text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
          title="Toggle chat history"
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
          <span class="hidden sm:inline">Chats</span>
        </button>

        <div class="w-1.5 h-1.5 rounded-full bg-success-muted animate-pulse ml-1"></div>
        <span class="text-xs text-text-muted tracking-wide font-medium">OpenAI Extender</span>

        <!-- Provider tabs -->
        <div class="flex items-center gap-1 ml-1">
          <a
            routerLink="/chat-lm-studio"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >LM Studio</a
          >
          <a
            routerLink="/chat-openai"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-accent text-accent bg-accent/10 transition-colors"
            >OpenAI</a
          >
        </div>

        <div class="relative ml-auto">
          <app-openai-model-selector
            [models]="models()"
            [modelsLoading]="modelsLoading()"
            [selectedModel]="selectedModel()"
            [hasChatOpen]="chatService.hasChatOpen()"
            (modelSelected)="selectModel($event)"
          />
        </div>

        <button
          type="button"
          (click)="newChat()"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border-default rounded-lg text-text-secondary hover:border-accent hover:text-accent transition-colors"
          title="New chat"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span class="hidden sm:inline">New</span>
        </button>

        <!-- User / Info panel toggle -->
        <button
          type="button"
          (click)="showInfoPanel.set(!showInfoPanel())"
          class="flex items-center justify-center w-8 h-8 rounded-lg border transition-colors"
          [class]="
            showInfoPanel()
              ? 'border-accent text-accent bg-accent/10'
              : 'border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
          "
          title="User info"
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
        </button>
      </div>

      <!-- ── Body ── -->
      <div class="flex flex-1 overflow-hidden relative min-h-0 bg-surface-base">
        @if (showChatsSidebar()) {
          <app-chat-sidebar
            client="OPENAI"
            [chatList]="chatList()"
            [chatsLoading]="chatsLoading()"
            [currentChatId]="chatService.currentChatId()"
            (chatOpened)="openChat($event)"
            (commitRename)="onRename($event)"
            (chatDeleted)="deleteChat($event)"
          />
        }

        <!-- CENTER: Chat window -->
        <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div class="flex flex-col flex-1 min-h-0 overflow-hidden max-w-3xl w-full mx-auto">
            <div #messageContainer class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              <app-chat-messages
                [messages]="$any(chatService.chatMessages())"
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

        @if (showInfoPanel()) {
          <div
            class="w-72 shrink-0 border-l border-border-default bg-surface-raised flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-3 py-2 border-b border-border-default shrink-0"
            >
              <span class="text-xs font-semibold text-text-primary">Info</span>
              <button
                type="button"
                (click)="showInfoPanel.set(false)"
                class="flex items-center justify-center w-6 h-6 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
                title="Close"
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
              </button>
            </div>
            <div class="flex-1 overflow-hidden">
              <app-info />
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class OpenAiApi implements OnDestroy, OnInit {
  readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly chatsApi = inject(ChatsService);
  private readonly chatMetaService = inject(ChatMetadataService);
  private readonly openAiService = inject(OpenAIService);
  readonly reasoning = signal<ReasoningDto.EffortEnum | undefined>(undefined);
  readonly modelReasoningCap = computed<ModelReasoningCapability | null>(() => {
    return {
      allowed_options: Object.values(ReasoningDto.EffortEnum).map((v) => v),
      default: Object.values(ReasoningDto.EffortEnum)[0][0],
    };
  });
  @ViewChild('messageContainer') private messageContainer?: ElementRef<HTMLElement>;

  readonly showChatsSidebar = signal(true);
  readonly showInfoPanel = signal(false);
  readonly chatList = signal<any[]>([]);
  readonly chatsLoading = signal(false);

  readonly models = signal<ModelOpenAiDto[]>([]);
  readonly modelsLoading = signal(false);
  readonly selectedModel = signal<ModelOpenAiDto | null>(this.loadStoredModel());

  private static readonly MODEL_STORAGE_KEY = 'openai-model';

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

  selectReasoning(value: ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum): void {
    this.reasoning.set(value as ReasoningDto.EffortEnum);
    const chatId = this.chatService.currentChatId();
    if (chatId) {
      this.chatMetaService.updateChatMetadata(chatId, { reasoningMode: value }).subscribe();
    }
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

  private loadChatMeta(chatId: string): void {
    this.chatMetaService.getChatMetadata(chatId).subscribe({
      next: (meta) => {
        const reasoningValue = meta.reasoningMode as ReasoningDto.EffortEnum | undefined;
        if (reasoningValue) {
          this.reasoning.set(reasoningValue);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.chatService.destroy();
  }

  // ── Model management ──────────────────────────────────────────────────────

  private loadStoredModel(): ModelOpenAiDto | null {
    try {
      const raw = localStorage.getItem(OpenAiApi.MODEL_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ModelOpenAiDto) : null;
    } catch {
      return null;
    }
  }

  selectModel(model: ModelOpenAiDto): void {
    this.selectedModel.set(model);
    try {
      localStorage.setItem(OpenAiApi.MODEL_STORAGE_KEY, JSON.stringify(model));
    } catch {
      /* ignore */
    }
  }

  private loadModels(): void {
    this.modelsLoading.set(true);
    this.openAiService.getModelsOpenAi().subscribe({
      next: (models) => {
        this.models.set(models);
        if (!this.selectedModel() && models.length > 0) {
          this.selectModel(models[0]);
        } else if (this.selectedModel()) {
          // Re-validate stored selection still exists
          const match = models.find((m) => m.id === this.selectedModel()!.id);
          if (match) this.selectModel(match);
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

  private fromContentToText(
    content:
      | string
      | Array<EasyInputMessageDtoContentInner>
      | Array<MessageDtoContentInner>
      | Array<ResponseOutputMessageDtoContentInner>
      | Array<ContentDto>,
  ) {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && Array.isArray(content)) {
      return content
        .map((c) => {
          if (typeof c === 'string') {
            return c;
          }
          if (c.type === ResponseInputTextDto.TypeEnum.InputText) {
            return c.text;
          } else if (c.type === ResponseOutputRefusalDto.TypeEnum.Refusal) {
            return c.refusal;
          } else if (c.type === ContentDto.TypeEnum.ReasoningText) {
            return c.text;
          } else if (c.type === ResponseInputImageDto.TypeEnum.InputImage) {
            return c.image_url;
          } else if (c.type === ResponseOutputTextDto.TypeEnum.OutputText) {
            return c.text;
          } else if (c.type === ResponseInputFileDto.TypeEnum.InputFile) {
            return c.file_data ?? c.file_url;
          }
          return JSON.stringify(c);
        })
        .join(`  \n`);
    }

    return JSON.stringify(content);
  }

  private loadChatHistory(chatId: string): void {
    this.chatsApi.getChatEntries(chatId).subscribe((res) => {
      const messages: any[] = [];
      for (const entry of res) {
        if (typeof entry.request.input === 'string')
          messages.push({
            role: 'user',
            text: entry.request.input as string,
            date: new Date(entry.createdAt),
          });
        else if (typeof entry.request.input === 'object' && Array.isArray(entry.request.input)) {
          for (const inputEntry of entry.request.input) {
            if (inputEntry.type === 'message' || !inputEntry.type) {
              messages.push({
                role: 'user',
                text: this.fromContentToText(inputEntry.content),
                date: new Date(entry.createdAt),
              });
            }
          }
        }

        const u = (entry.response as any)?.usage;
        const statsStr = u
          ? `${u.input_tokens} in · ${u.output_tokens} out${u.output_tokens_details?.reasoning_tokens ? ` · ${u.output_tokens_details.reasoning_tokens} reasoning` : ''}`
          : undefined;

        for (const output of entry.response.output) {
          if (output.type === 'reasoning') {
            // Reasoning content is in content[0].text for OpenAI Responses API
            const content =
              (output as any).content?.[0]?.text ?? (output as any).summary?.[0]?.text ?? '';
            messages.push({
              role: 'reasoning',
              text: content,
              date: new Date(entry.createdAt),
              collapsed: true,
            });
          } else {
            // @ts-ignore
            if (output.type === 'mcp_call' || output.type === 'tool_call') {
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
                text: tc.name ?? tc.tool ?? '',
                toolName: tc.name ?? tc.tool ?? '',
                toolArguments: tc.arguments
                  ? typeof tc.arguments === 'string'
                    ? JSON.parse(tc.arguments)
                    : tc.arguments
                  : undefined,
                toolOutput: parsedOutput || undefined,
                providerLabel: tc.server_label ?? tc.provider_info?.server_label ?? undefined,
                date: new Date(entry.createdAt),
                collapsed: true,
              });
            } else if (output.type === 'message') {
              const content = (output as any).content?.[0]?.text ?? (output as any).content ?? '';
              messages.push({
                role: 'ai',
                text: typeof content === 'string' ? content : JSON.stringify(content),
                date: new Date(entry.createdAt),
                stats: statsStr,
              });
            }
          }
        }
      }
      this.chatService.chatMessages.set(messages);
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  openChat(chatId: string): void {
    if (this.chatService.streaming()) return;
    this.chatService.chatMessages.set([]);
    this.chatService.currentChatId.set(chatId);
    this.router.navigate(['/chat-openai', chatId]);
    this.loadChatHistory(chatId);
    this.loadChatMeta(chatId);
  }

  newChat(): void {
    if (this.chatService.streaming()) return;
    this.chatService.chatMessages.set([]);
    this.chatService.currentChatId.set(null);
    this.router.navigate(['/chat-openai']);
  }

  // ── Messaging ─────────────────────────────────────────────────────────────

  submit(): void {
    this.chatService.submit(this.selectedModel()?.id ?? '', this.reasoning(), () =>
      this.loadChatList(),
    );
  }

  resend(): void {
    this.chatService.resend(this.selectedModel()?.id ?? '', this.reasoning(), () =>
      this.loadChatList(),
    );
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
