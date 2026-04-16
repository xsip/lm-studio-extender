import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMetadataDto, CreateChatMetadataDto } from '../../client';
import ClientEnum = CreateChatMetadataDto.ClientEnum;

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule, DatePipe, FormsModule],
  template: `
    <div
      class="flex flex-col w-56 border-r border-border-default shrink-0 h-full bg-surface-raised"
    >
      <div
        class="flex items-center justify-between px-3 py-2.5 border-b border-border-default shrink-0"
      >
        <span class="text-xs text-text-muted uppercase tracking-widest font-medium">History</span>
        @if (chatsLoading()) {
          <span
            class="w-3 h-3 rounded-full border-2 border-border-strong border-t-text-secondary animate-spin"
          ></span>
        }
      </div>

      <div class="flex-1 overflow-y-auto py-1 min-h-0">
        @if (filteredChats.length === 0 && !chatsLoading()) {
          <div
            class="flex items-center justify-center h-full text-xs text-text-muted tracking-wide px-3 text-center"
          >
            No chats yet
          </div>
        }

        @for (chat of filteredChats; track chat._id) {
          @if (renamingChatId() === chat._id) {
            <div class="px-2 py-1.5">
              <input
                #renameInput
                type="text"
                [value]="renameValue()"
                (input)="renameValue.set($any($event.target).value)"
                (keydown)="onRenameKeydown($event, chat._id!)"
                (blur)="
                  commitRename.emit({ chatId: chat._id!, name: renameValue() });
                  renamingChatId.set(null)
                "
                class="w-full bg-surface-overlay border border-accent rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Chat name…"
              />
            </div>
          } @else {
            <button
              type="button"
              (click)="chatOpened.emit(chat._id!)"
              (contextmenu)="onContextMenu($event, chat)"
              class="w-full text-left px-3 py-2.5 text-xs transition-colors border-l-2 group"
              [class]="
                currentChatId() === chat._id
                  ? 'bg-surface-overlay border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:bg-surface-overlay hover:text-text-primary'
              "
            >
              <div class="flex items-center gap-1.5">
                @if (chat.useCrypto) {
                  <svg
                    class="w-3 h-3 shrink-0 text-amber-400/80"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    aria-label="Encrypted"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                }
                <div class="truncate font-medium text-sm">{{ chat.name ?? 'Chat' }}</div>
              </div>
              @if (chat.lastMessageSentAt) {
                <div
                  class="text-text-muted mt-0.5 group-hover:text-text-secondary transition-colors text-[10px]"
                >
                  {{ chat.lastMessageSentAt | date: 'dd MMM, HH:mm' }}
                </div>
              }
              <div class="text-text-muted mt-0.5 text-[10px] font-mono truncate">
                {{ chat._id }}
              </div>
            </button>
          }
        }
      </div>
    </div>

    <!-- Context menu -->
    @if (ctxMenu(); as menu) {
      <div
        class="fixed inset-0 z-40"
        (click)="closeCtxMenu()"
        (contextmenu)="$event.preventDefault(); closeCtxMenu()"
      ></div>
      <div
        class="fixed z-50 w-52 bg-surface-raised border border-border-default rounded-lg shadow-2xl shadow-black/30 overflow-hidden py-1"
        [style.left.px]="menu.x"
        [style.top.px]="menu.y"
      >
        <div
          class="px-3 py-1.5 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-default truncate"
        >
          {{ chatNameById(menu.chat._id!) }}
        </div>

        <div class="px-2 pt-2 pb-1">
          <input
            #ctxRenameInput
            type="text"
            [value]="ctxRenameValue()"
            (input)="ctxRenameValue.set($any($event.target).value)"
            (keydown)="onCtxRenameKeydown($event, menu.chat._id!)"
            class="w-full bg-surface-base border border-border-default focus:border-accent focus:ring-1 focus:ring-accent rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none transition-colors"
            placeholder="Chat name…"
          />
        </div>

        <button
          type="button"
          (click)="commitCtxRename(menu.chat._id!)"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors text-left"
        >
          <svg
            class="w-3.5 h-3.5 shrink-0 opacity-60"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"
            />
          </svg>
          Rename
        </button>

        <div class="border-t border-zinc-800 mx-1 my-1"></div>

        <!-- Settings item -->
        <button
          type="button"
          (click)="openSettings(menu.chat)"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 mb-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors text-left"
        >
          <svg
            class="w-3.5 h-3.5 shrink-0 opacity-60"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </button>

        <div class="border-t border-zinc-800 mx-1 mb-1"></div>

        @if (!ctxConfirmDelete()) {
          <button
            type="button"
            (click)="ctxConfirmDelete.set(true)"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500/70 hover:bg-red-950/40 hover:text-red-400 transition-colors text-left"
          >
            <svg
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"
              />
            </svg>
            Delete chat
          </button>
        } @else {
          <div class="px-3 py-2 flex flex-col gap-1.5">
            <span class="text-[10px] text-red-400 uppercase tracking-widest"
              >Delete this chat?</span
            >
            <div class="flex gap-1.5">
              <button
                type="button"
                (click)="chatDeleted.emit(menu.chat._id!); closeCtxMenu()"
                class="flex-1 px-2 py-1 text-xs bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors font-semibold tracking-wide"
              >
                Delete
              </button>
              <button
                type="button"
                (click)="ctxConfirmDelete.set(false)"
                class="flex-1 px-2 py-1 text-xs border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Settings modal -->
    @if (settingsModal(); as modal) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        (click)="closeSettings()"
      >
        <div
          class="relative w-80 bg-surface-raised border border-border-default rounded-xl shadow-2xl shadow-black/50 p-5"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-text-primary tracking-wide">Chat Settings</h3>
            <button
              type="button"
              (click)="closeSettings()"
              class="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            class="text-[10px] text-text-muted uppercase tracking-widest mb-4 truncate border-b border-border-default pb-2"
          >
            {{ modal.chatName }}
          </div>

          @if (settingsLoading()) {
            <div class="flex items-center justify-center py-6">
              <span
                class="w-5 h-5 rounded-full border-2 border-border-strong border-t-text-secondary animate-spin"
              ></span>
            </div>
          } @else {
            <!-- Chat name -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-text-primary mb-1.5">Chat Name</label>
              <input
                type="text"
                [(ngModel)]="settingsChatName"
                placeholder="Chat name…"
                class="w-full bg-surface-base border border-border-default focus:border-accent focus:ring-1 focus:ring-accent rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none transition-colors"
              />
            </div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="text-xs font-medium text-text-primary">Encryption</div>
                <div class="text-[10px] text-text-muted mt-0.5">Encrypt messages with a key</div>
              </div>
              <button
                type="button"
                (click)="settingsUseCrypto.set(!settingsUseCrypto())"
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                [class]="settingsUseCrypto() ? 'bg-amber-500' : 'bg-zinc-700'"
              >
                <span
                  class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                  [class]="settingsUseCrypto() ? 'translate-x-4' : 'translate-x-1'"
                ></span>
              </button>
            </div>

            <!-- Crypto key input -->
            @if (settingsUseCrypto()) {
              <div class="mb-4">
                <label class="block text-xs font-medium text-text-primary mb-1.5">
                  Encryption Key
                </label>
                <div class="relative">
                  <input
                    [type]="showKey() ? 'text' : 'password'"
                    [(ngModel)]="settingsCryptoKey"
                    placeholder="Enter encryption key…"
                    class="w-full bg-surface-base border border-border-default focus:border-accent focus:ring-1 focus:ring-accent rounded-md px-2.5 py-1.5 pr-8 text-xs text-text-primary placeholder-text-muted focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    (click)="showKey.set(!showKey())"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    @if (showKey()) {
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
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    } @else {
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  </button>
                </div>
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-2 pt-1">
              <button
                type="button"
                (click)="saveSettings(modal.chatId)"
                class="flex-1 px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 text-white rounded-md transition-colors font-medium"
              >
                Save
              </button>
              <button
                type="button"
                (click)="closeSettings()"
                class="flex-1 px-3 py-1.5 text-xs border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ChatSidebarComponent {
  readonly client = input.required<ClientEnum>();
  readonly chatList = input.required<ChatMetadataDto[]>();
  readonly chatsLoading = input.required<boolean>();
  readonly currentChatId = input.required<string | null>();

  readonly chatOpened = output<string>();
  readonly commitRename = output<{ chatId: string; name: string }>();
  readonly chatDeleted = output<string>();
  readonly openChatSettings = output<string>();
  readonly saveCryptoSettings = output<{
    chatId: string;
    name: string;
    useCrypto: boolean;
    cryptoKey: string;
  }>();

  @ViewChild('renameInput') renameInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('ctxRenameInput') ctxRenameInputRef?: ElementRef<HTMLInputElement>;

  readonly renamingChatId = signal<string | null>(null);
  readonly renameValue = signal('');

  readonly ctxMenu = signal<{ chat: ChatMetadataDto; x: number; y: number } | null>(null);
  readonly ctxConfirmDelete = signal(false);
  readonly ctxRenameValue = signal('');

  readonly settingsModal = signal<{ chatId: string; chatName: string } | null>(null);
  readonly settingsLoading = signal(false);
  readonly settingsUseCrypto = signal(false);
  settingsCryptoKey = '';
  settingsChatName = '';
  readonly showKey = signal(false);

  chatNameById(chatId: string): string {
    return this.chatList().find((c) => c._id === chatId)?.name ?? 'Chat';
  }

  onContextMenu(event: MouseEvent, chat: ChatMetadataDto): void {
    event.preventDefault();
    event.stopPropagation();
    const menuW = 216,
      menuH = 270;
    const x = Math.min(event.clientX, window.innerWidth - menuW);
    const y = Math.min(event.clientY, window.innerHeight - menuH);
    this.ctxConfirmDelete.set(false);
    this.ctxRenameValue.set(chat.name ?? '');
    this.ctxMenu.set({ chat, x, y });
    setTimeout(() => this.ctxRenameInputRef?.nativeElement?.focus(), 0);
  }

  closeCtxMenu(): void {
    this.ctxMenu.set(null);
    this.ctxConfirmDelete.set(false);
  }

  onCtxRenameKeydown(event: KeyboardEvent, chatId: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitCtxRename(chatId);
    } else if (event.key === 'Escape') {
      this.closeCtxMenu();
    }
  }

  commitCtxRename(chatId: string): void {
    const name = this.ctxRenameValue().trim();
    if (name && name !== this.chatNameById(chatId)) {
      this.commitRename.emit({ chatId, name });
    }
    this.closeCtxMenu();
  }

  onRenameKeydown(event: KeyboardEvent, chatId: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitRename.emit({ chatId, name: this.renameValue() });
      this.renamingChatId.set(null);
    } else if (event.key === 'Escape') {
      this.renamingChatId.set(null);
    }
  }

  startRename(chatId: string): void {
    this.renameValue.set(this.chatNameById(chatId));
    this.renamingChatId.set(chatId);
    setTimeout(() => this.renameInputRef?.nativeElement?.select(), 0);
  }

  openSettings(chat: ChatMetadataDto): void {
    this.closeCtxMenu();
    this.settingsLoading.set(true);
    this.showKey.set(false);
    this.settingsCryptoKey = '';
    this.settingsChatName = chat.name ?? '';
    this.settingsModal.set({ chatId: chat._id!, chatName: chat.name ?? 'Chat' });
    // Parent will call getChatMetadata and feed results back via loadSettingsData()
    this.openChatSettings.emit(chat._id!);
  }

  /** Called by parent after getChatMetadata resolves to populate the form */
  loadSettingsData(name: string, useCrypto: boolean, cryptoKey: string): void {
    this.settingsChatName = name;
    this.settingsUseCrypto.set(useCrypto);
    this.settingsCryptoKey = cryptoKey;
    this.settingsLoading.set(false);
  }

  closeSettings(): void {
    this.settingsModal.set(null);
    this.settingsLoading.set(false);
  }

  saveSettings(chatId: string): void {
    this.saveCryptoSettings.emit({
      chatId,
      name: this.settingsChatName.trim() || this.chatNameById(chatId),
      useCrypto: this.settingsUseCrypto(),
      cryptoKey: this.settingsCryptoKey,
    });
    this.closeSettings();
  }

  get filteredChats() {
    return this.chatList().filter((chat: ChatMetadataDto) => {
      return chat.client === this.client();
    });
  }
}
