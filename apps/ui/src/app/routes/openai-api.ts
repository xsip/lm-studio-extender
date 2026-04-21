import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChatMetadataService,
  ChatRequestDto,
  ChatsService,
  ContentDto,
  CreateChatMetadataDto,
  EasyInputMessageDtoContentInner,
  MessageDtoContentInner,
  ModelOpenAiDto,
  OpenAIService,
  ReasoningDto,
  ResponseInputFileDto,
  ResponseInputImageDto,
  ResponseInputTextDto,
  ResponseOutputMessageDtoContentInner,
  ResponseOutputRefusalDto,
  ResponseOutputTextDto
} from '../client';
import { ChatService } from './openai-api/chat.service';
import { OpenAiModelSelectorComponent } from './openai-api/model-selector.component';

// Re-use the shared sub-components from lm-studio-api — they are generic enough
import { ChatSidebarComponent } from './lm-studio-api/chat-sidebar.component';
import { ChatMessagesComponent } from './lm-studio-api/chat-messages.component';
import { InfoComponent } from './lm-studio-api/info.component';
import { ModelReasoningCapability } from './lm-studio-api/model-selector.component';
import { AppendedFile, OpenAiChatInputComponent } from './openai-api/chat-input.component';
import { take } from 'rxjs';
import { IconButtonComponent } from '../shared/components/ui/icon-button.component';
import { ButtonComponent } from '../shared/components/ui/button.component';
import { LabelComponent } from '../shared/components/ui/label.component';
import { TextInputComponent } from '../shared/components/ui/text-input.component';
import { ToggleComponent } from '../shared/components/ui/toggle.component';

@Component({
  selector: 'app-openai-api',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatSidebarComponent,
    ChatMessagesComponent,
    OpenAiChatInputComponent,
    OpenAiModelSelectorComponent,
    InfoComponent,
    IconButtonComponent,
    ButtonComponent,
    LabelComponent,
    TextInputComponent,
    ToggleComponent,
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
        <ui-button
          variant="secondary"
          size="xs"
          [active]="showChatsSidebar()"
          (clicked)="showChatsSidebar.set(!showChatsSidebar())"
          title="Toggle chat history"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <span class="hidden sm:inline">Chats</span>
        </ui-button>

        <div class="w-1.5 h-1.5 rounded-full bg-success-muted animate-pulse ml-1"></div>
        <span class="text-xs text-text-muted tracking-wide font-medium hidden md:block">OpenAI Extender</span>

        <!-- Provider tabs -->

        <div class="relative ml-auto">
          <app-openai-model-selector
            [models]="models()"
            [modelsLoading]="modelsLoading()"
            [selectedModel]="selectedModel()"
            [hasChatOpen]="chatService.hasChatOpen()"
            (modelSelected)="selectModel($event)"
          />
        </div>

        <!-- User / Info panel toggle -->
        <ui-icon-button
          [active]="showInfoPanel()"
          title="User info"
          (clicked)="showInfoPanel.set(!showInfoPanel())"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </ui-icon-button>
      </div>

      <!-- ── Body ── -->
      <div class="flex flex-1 overflow-hidden relative min-h-0 bg-surface-base">
        @if (showChatsSidebar()) {
          <app-chat-sidebar
            #chatSidebar
            client="OPENAI"
            (newChat)="newChat()"
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
                client="OPENAI"
                [messages]="$any(chatService.chatMessages())"
                [streaming]="chatService.streaming()"
                [showResend]="chatService.showResend()"
                (toggleCollapsed)="chatService.toggleCollapsed($event)"
                (resend)="resend()"
              >
                @if (!chatService.hasChatOpen()) {
                  <div
                    class="flex flex-col gap-4 w-full max-w-md mx-auto mt-6 p-5 bg-surface-raised border border-border-default rounded-xl shadow-lg shadow-black/20"
                  >
                    <!-- Header -->
                    <div class="flex items-center gap-2 border-b border-border-default pb-3">
                      <svg
                        class="w-4 h-4 text-accent shrink-0"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span class="text-sm font-semibold text-text-primary tracking-wide"
                        >New Chat Options</span
                      >
                    </div>

                    <!-- Chat Name -->
                    <div>
                      <ui-label class="mb-1.5">Chat Name</ui-label>
                      <ui-text-input
                        [(ngModel)]="newChatName"
                        placeholder="Optional name…"
                      />
                    </div>

                    <!-- Endpoint Preference -->
                    <div>
                      <ui-label class="mb-1.5">Endpoint</ui-label>
                      <div class="flex gap-2">
                        <ui-button
                          class="flex-1"
                          variant="secondary"
                          [active]="newChatEndpointPreference() === 'RESPONSES'"
                          (clicked)="newChatEndpointPreference.set('RESPONSES')"
                        >Responses API</ui-button>
                        <ui-button
                          class="flex-1"
                          variant="secondary"
                          [disabled]="true"
                          [active]="newChatEndpointPreference() === 'COMPLETION'"
                          (clicked)="newChatEndpointPreference.set('COMPLETION')"
                        >Chat Completions</ui-button>
                      </div>
                      <p class="mt-1.5 text-[10px] text-text-muted">
                        @if (newChatEndpointPreference() === 'RESPONSES') {
                          Uses the <span class="font-mono text-text-secondary">/responses</span> endpoint —
                          supports reasoning &amp; file inputs.
                        } @else {
                          Uses the <span class="font-mono text-text-secondary">/chat/completions</span>
                          endpoint — standard chat interface.
                        }
                      </p>
                    </div>

                    <!-- Encryption toggle -->
                    <div class="flex items-center justify-between">
                      <div>
                        <ui-label>Encryption</ui-label>
                        <span class="text-[10px] text-text-muted mt-0.5 block">Encrypt messages with a key</span>
                      </div>
                      <ui-toggle
                        [(ngModel)]="newChatUseCryptoModel"
                        activeColor="bg-amber-500"
                        (checkedChange)="newChatUseCrypto.set($event)"
                      />
                    </div>

                    <!-- Crypto key input -->
                    @if (newChatUseCrypto()) {
                      <div>
                        <ui-label class="mb-1.5">Encryption Key</ui-label>
                        <ui-text-input
                          type="password"
                          [showToggle]="true"
                          [mono]="true"
                          [(ngModel)]="newChatCryptoKey"
                          placeholder="Enter encryption key…"
                        />
                      </div>
                    }
                  </div>
                }
              </app-chat-messages>
            </div>

            <app-openai-chat-input
              #chatInput
              [form]="chatService.form"
              [streaming]="chatService.streaming()"
              [reasoning]="reasoning()"
              [modelReasoningCap]="modelReasoningCap()"
              (submitted)="submit()"
              (reset)="chatService.reset()"
              (reasoningChanged)="selectReasoning($event)"
              (appendedFilesChanged)="appendedFiles.set($event)"
            />
          </div>
        </div>

        @if (showInfoPanel()) {
          <div
            class="w-72 shrink-0 border-l border-border-default bg-surface-raised md:relative fixed md:h-auto h-full top-0 right-0 flex flex-col overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-3 py-2 border-b border-border-default shrink-0"
            >
              <span class="text-xs font-semibold text-text-primary">Info</span>
              <ui-icon-button size="sm" title="Close" (clicked)="showInfoPanel.set(false)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ui-icon-button>
            </div>
            <div class="flex-1 overflow-hidden">
              <app-info [uiType]="'OPENAI'" />
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
  @ViewChild('chatInput') private chatInputRef?: OpenAiChatInputComponent;
  @ViewChild('chatSidebar') private chatSidebarRef?: ChatSidebarComponent;

  readonly showChatsSidebar = signal(true);
  readonly showInfoPanel = signal(false);
  readonly chatList = signal<any[]>([]);
  readonly chatsLoading = signal(false);
  readonly appendedFiles = signal<AppendedFile[]>([]);

  // ── New-chat options ───────────────────────────────────────────────────────
  readonly newChatEndpointPreference =
    signal<CreateChatMetadataDto.OpenAiEndpointPreferenceEnum>('RESPONSES');
  readonly newChatUseCrypto = signal(false);
  newChatCryptoKey = '';
  newChatName = '';
  /** Two-way ngModel bridge for ui-toggle — kept in sync with newChatUseCrypto signal. */
  newChatUseCryptoModel = false;

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
      if (!this.chatService.hasChatOpen()) this.reasoning.set(
        (cap?.allowed_options?.find((e) => e.startsWith(cap?.default)) as any) ?? undefined,
      );
    });
  }

  selectReasoning(value: ChatRequestDto.ReasoningEnum | ReasoningDto.EffortEnum): void {
    this.reasoning.set(value as ReasoningDto.EffortEnum);
    const chatId = this.chatService.currentChatId();
    if (chatId) {
      this.chatMetaService.updateChatMetadata(chatId, { reasoningMode: value }).subscribe();
    }
  }

  private chatId?: string;
  ngOnInit(): void {
    this.loadChatList();
    this.loadModels();

    const chatId = this.route.snapshot.paramMap.get('chatId');
    this.chatService.currentChatId.set(chatId);
    this.chatId = chatId ?? undefined;
    if (chatId) {
      this.loadChatHistory(chatId);
      this.loadChatMeta(chatId);
    }
  }

  private loadChatMeta(chatId: string): void {
    this.chatMetaService.getChatMetadata(chatId).subscribe({
      next: (meta) => {
        const reasoningValue = meta.reasoningMode as ReasoningDto.EffortEnum | undefined;
        const match = this.models()?.find((m) => m.id === meta.usedModel);
        if(match)
          this.selectModel(match);
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
            if (
              inputEntry.type === 'message' ||
              (!inputEntry.type && (inputEntry as any).role !== 'developer')
            ) {
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
    this.chatId = chatId;
    this.loadChatHistory(chatId);
    this.loadChatMeta(chatId);
  }

  newChat(): void {
    if (this.chatService.streaming()) return;
    this.chatService.chatMessages.set([]);
    this.chatService.currentChatId.set(null);
    this.router.navigate(['/chat-openai']);
    // Reset new-chat options to defaults
    this.newChatEndpointPreference.set('RESPONSES');
    this.newChatUseCrypto.set(false);
    this.newChatUseCryptoModel = false;
    this.newChatCryptoKey = '';
    this.newChatName = '';
  }

  // ── Messaging ─────────────────────────────────────────────────────────────

  submit(): void {
    if (this.chatId) {
      this.chatMetaService
        .getChatMetadata(this.chatId)
        .pipe(take(1))
        .subscribe((res) => {
          this.chatService.submit(
            this.selectedModel()?.id ?? '',
            this.reasoning(),
            this.appendedFiles(),
            res.useCrypto && res.cryptoKey ? res.cryptoKey : undefined,
            () => this.loadChatList(),
          );

          this.chatInputRef?.clearFiles();
        });
      return;
    }

    this.chatService.submit(
      this.selectedModel()?.id ?? '',
      this.reasoning(),
      this.appendedFiles(),
      this.newChatUseCrypto() && this.newChatCryptoKey ? this.newChatCryptoKey : undefined,
      () => this.loadChatList(),
      {
        name: this.newChatName.trim() || undefined,
        useCrypto: this.newChatUseCrypto(),
        cryptoKey: this.newChatCryptoKey || undefined,
        openAiEndpointPreference: this.newChatEndpointPreference(),
      },
    );

    this.chatInputRef?.clearFiles();
  }

  resend(): void {
    this.submit();
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
        );
      },
      error: () => {
        this.chatSidebarRef?.loadSettingsData('', false, '');
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
