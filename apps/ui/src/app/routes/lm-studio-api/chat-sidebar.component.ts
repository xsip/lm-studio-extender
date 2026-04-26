import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMetadataDto, CreateChatMetadataDto, UpdateChatMetadataDto } from '../../client';
import {
  ChatSettingsDialogComponent,
  ChatSettingsData,
  ChatSettingsSaveEvent,
} from '../../shared/components/chat-settings-dialog.component';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import ClientEnum = CreateChatMetadataDto.ClientEnum;
import InvokeAiModelToUseEnum = UpdateChatMetadataDto.InvokeAiModelToUseEnum;

@Component({
  selector: 'app-chat-sidebar',
  animations: [
    trigger('chatItemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate('220ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('newChatAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('ctxMenuAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.90)', transformOrigin: 'top left' }),
        animate('180ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'scale(0.94)' })),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TranslateModule,
    ChatSettingsDialogComponent,
    SpinnerComponent,
  ],
  template: `
    <div
      class="flex flex-col w-60 border-r border-border-default shrink-0 h-full bg-surface-raised"
      style="box-shadow: 2px 0 12px rgba(0,0,0,0.06);"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0">
        <div class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <span class="text-[10px] text-text-muted uppercase tracking-[0.14em] font-semibold">{{ 'sidebar.history' | translate }}</span>
        </div>
        @if (chatsLoading()) {
          <app-spinner />
        }
      </div>

      <!-- New chat button -->
      <div class="px-2 pt-2 pb-1 shrink-0">
        <button
          type="button"
          (click)="newChat.emit()"
          class="w-full flex items-center gap-2 px-3 py-2.5 text-xs rounded-xl border group active:scale-[0.98] transition-all duration-200"
          @newChatAnim
          [class]="!currentChatId()
            ? 'bg-accent-subtle border-accent/40 text-accent shadow-depth-sm'
            : 'border-border-default text-text-secondary hover:bg-surface-overlay hover:border-border-strong hover:text-text-primary'"
        >
          <div class="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-200"
               [style]="!currentChatId() ? 'background: var(--color-accent); box-shadow: 0 2px 8px var(--color-accent-glow);' : 'background: var(--color-surface-sunken);'">
            <svg class="w-3 h-3" [class]="!currentChatId() ? 'text-white' : 'text-text-muted'" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
          <span class="font-medium">{{ 'sidebar.newChat' | translate }}</span>
        </button>
      </div>

      <!-- Chat list -->
      <div class="flex-1 overflow-y-auto py-1 min-h-0 px-2 flex flex-col gap-0.5">
        @if (filteredChats.length === 0 && !chatsLoading()) {
          <div class="flex flex-col items-center justify-center h-full gap-2 text-center px-3 py-8">
            <svg class="w-8 h-8 text-text-disabled animate-float" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span class="text-[10px] text-text-disabled uppercase tracking-wider">{{ 'sidebar.noChats' | translate }}</span>
          </div>
        }

        @for (chat of filteredChats; track chat._id) {
          @if (renamingChatId() === chat._id) {
            <div class="px-1 py-1">
              <input
                #renameInput
                type="text"
                [value]="renameValue()"
                (input)="renameValue.set($any($event.target).value)"
                (keydown)="onRenameKeydown($event, chat._id!)"
                (blur)="commitRename.emit({ chatId: chat._id!, name: renameValue() }); renamingChatId.set(null)"
                class="w-full bg-surface-base border border-accent rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                [placeholder]="'sidebar.chatNamePlaceholder' | translate"
              />
            </div>
          } @else {
            <button
              type="button"
              (click)="chatOpened.emit(chat._id!)"
              (contextmenu)="onContextMenu($event, chat)"
              class="w-full text-left px-2.5 py-2 text-xs rounded-xl group relative active:scale-[0.98] transition-all duration-200"
              @chatItemAnim
              [class]="currentChatId() === chat._id
                ? 'bg-accent-subtle text-text-primary shadow-depth-sm'
                : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary'"
            >
              <!-- Active indicator -->
              @if (currentChatId() === chat._id) {
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-accent"></div>
              }
              <div class="flex items-center gap-1.5 pl-1">
                @if (chat.useCrypto) {
                  <svg class="w-2.5 h-2.5 shrink-0 text-amber-400/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                }
                <div class="truncate font-medium leading-tight">{{ chat.name ?? 'Chat' }}</div>
              </div>
              @if (chat.lastMessageSentAt) {
                <div class="text-text-muted mt-0.5 text-[10px] pl-1">
                  {{ chat.lastMessageSentAt | date: 'dd MMM, HH:mm' }}
                </div>
              }
            </button>
          }
        }
      </div>
    </div>

    <!-- Context menu -->
    @if (ctxMenu(); as menu) {
      <div class="fixed inset-0 z-40" (click)="closeCtxMenu()" (contextmenu)="$event.preventDefault(); closeCtxMenu()"></div>
      <div
        class="fixed z-50 w-52 bg-surface-raised border border-border-default rounded-2xl overflow-hidden py-1" @ctxMenuAnim
        style="box-shadow: var(--shadow-xl); left: {{ menu.x }}px; top: {{ menu.y }}px;"
        [style.left.px]="menu.x"
        [style.top.px]="menu.y"
      >
        <div class="px-3 py-2 text-[10px] text-text-muted uppercase tracking-widest border-b border-border-subtle truncate font-semibold">
          {{ chatNameById(menu.chat._id!) }}
        </div>

        <div class="px-2 pt-2 pb-1">
          <input
            #ctxRenameInput
            type="text"
            [value]="ctxRenameValue()"
            (input)="ctxRenameValue.set($any($event.target).value)"
            (keydown)="onCtxRenameKeydown($event, menu.chat._id!)"
            class="w-full bg-surface-base border border-border-default focus:border-accent rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:outline-none transition-colors"
            [placeholder]="'sidebar.chatNamePlaceholder' | translate"
          />
        </div>

        <button
          type="button"
          (click)="commitCtxRename(menu.chat._id!)"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-overlay hover:text-text-primary active:scale-[0.98] text-left"
        >
          <svg class="w-3.5 h-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"/>
          </svg>
          {{ 'sidebar.rename' | translate }}
        </button>

        <div class="border-t border-border-subtle mx-2 my-1"></div>

        <button
          type="button"
          (click)="openSettings(menu.chat)"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 mb-1 text-xs text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors text-left"
        >
          <svg class="w-3.5 h-3.5 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {{ 'sidebar.settings' | translate }}
        </button>

        <div class="border-t border-border-subtle mx-2 mb-1"></div>

        @if (!ctxConfirmDelete()) {
          <button
            type="button"
            (click)="ctxConfirmDelete.set(true)"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-error-text/70 hover:bg-error-bg hover:text-error-text active:scale-[0.98] text-left"
          >
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"/>
            </svg>
            {{ 'sidebar.deleteChat' | translate }}
          </button>
        } @else {
          <div class="px-3 py-2 flex flex-col gap-2">
            <span class="text-[10px] text-error-text uppercase tracking-widest font-semibold">{{ 'sidebar.deleteConfirm' | translate }}</span>
            <div class="flex gap-1.5">
              <button
                type="button"
                (click)="chatDeleted.emit(menu.chat._id!); closeCtxMenu()"
                class="flex-1 px-2 py-1.5 text-xs bg-error-text hover:opacity-90 text-white rounded-lg transition-colors font-semibold"
              >
                {{ 'sidebar.delete' | translate }}
              </button>
              <button
                type="button"
                (click)="ctxConfirmDelete.set(false)"
                class="flex-1 px-2 py-1.5 text-xs border border-border-default hover:border-border-strong text-text-secondary hover:text-text-primary rounded-lg transition-colors"
              >
                {{ 'sidebar.cancel' | translate }}
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Chat Settings dialog -->
    @if (settingsModal(); as modal) {
      <app-chat-settings-dialog
        [data]="modal"
        [loading]="settingsLoading()"
        [showCrypto]="client() === 'OPENAI'"
        [showInvoke]="client() === 'OPENAI'"
        (saved)="onSettingsSaved($event)"
        (closed)="closeSettings()"
      />
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
  readonly newChat = output<void>();
  readonly chatDeleted = output<string>();
  readonly openChatSettings = output<string>();
  readonly saveCryptoSettings = output<ChatSettingsSaveEvent>();

  @ViewChild('renameInput') renameInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('ctxRenameInput') ctxRenameInputRef?: ElementRef<HTMLInputElement>;

  readonly renamingChatId = signal<string | null>(null);
  readonly renameValue = signal('');

  readonly ctxMenu = signal<{ chat: ChatMetadataDto; x: number; y: number } | null>(null);
  readonly ctxConfirmDelete = signal(false);
  readonly ctxRenameValue = signal('');

  readonly settingsModal = signal<ChatSettingsData | null>(null);
  readonly settingsLoading = signal(false);

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
    this.settingsModal.set({
      chatId: chat._id!,
      chatName: chat.name ?? 'Chat',
      name: chat.name ?? '',
      useCrypto: false,
      cryptoKey: '',
      useInvoke: chat.useInvoke ?? false,
      invokeAiModelToUse: chat.invokeAiModelToUse,
    });
    this.openChatSettings.emit(chat._id!);
  }

  /** Called by parent after getChatMetadata resolves to populate the form. */
  loadSettingsData(
    name: string,
    useCrypto: boolean,
    cryptoKey: string,
    useInvoke: boolean,
    invokeAiModelToUse?:InvokeAiModelToUseEnum,
  ): void {
    this.settingsModal.update((m) =>
      m ? { ...m, name, useCrypto, cryptoKey, invokeAiModelToUse, useInvoke } : null,
    );
    this.settingsLoading.set(false);
  }

  closeSettings(): void {
    this.settingsModal.set(null);
    this.settingsLoading.set(false);
  }

  onSettingsSaved(event: ChatSettingsSaveEvent): void {
    this.saveCryptoSettings.emit(event);
    this.closeSettings();
  }

  get filteredChats() {
    return this.chatList()
      .filter((chat) => chat.client === this.client())
      .sort((a, b) => {
        const dateA = new Date(a.lastMessageSentAt ?? 0).getTime();
        const dateB = new Date(b.lastMessageSentAt ?? 0).getTime();
        return dateB - dateA;
      });
  }
}
