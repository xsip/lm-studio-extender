import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatMetadataDto, CreateChatMetadataDto } from '../../client';
import ClientEnum = CreateChatMetadataDto.ClientEnum;

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule, DatePipe],
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
              <div class="truncate font-medium text-sm">{{ chat.name ?? 'Chat' }}</div>
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
              d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"
            />
          </svg>
          Rename
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

  @ViewChild('renameInput') renameInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('ctxRenameInput') ctxRenameInputRef?: ElementRef<HTMLInputElement>;

  readonly renamingChatId = signal<string | null>(null);
  readonly renameValue = signal('');

  readonly ctxMenu = signal<{ chat: ChatMetadataDto; x: number; y: number } | null>(null);
  readonly ctxConfirmDelete = signal(false);
  readonly ctxRenameValue = signal('');

  chatNameById(chatId: string): string {
    return this.chatList().find((c) => c._id === chatId)?.name ?? 'Chat';
  }

  onContextMenu(event: MouseEvent, chat: ChatMetadataDto): void {
    event.preventDefault();
    event.stopPropagation();
    const menuW = 216,
      menuH = 210;
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

  get filteredChats() {
    return this.chatList().filter((chat: ChatMetadataDto) => {
      return chat.client === this.client();
    });
  }
}
