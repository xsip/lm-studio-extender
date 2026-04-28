import { Component, input, output, signal, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from './ui/modal.component';
import { ButtonComponent } from './ui/button.component';
import { LabelComponent } from './ui/label.component';
import { TextInputComponent } from './ui/text-input.component';
import { ToggleComponent } from './ui/toggle.component';
import { SpinnerComponent } from './spinner.component';
import { ChatMetadataDto } from '../../client';
import InvokeAiModelToUseEnum = ChatMetadataDto.InvokeAiModelToUseEnum;

export interface ChatSettingsData {
  chatId: string;
  chatName: string;
  name: string;
  useCrypto: boolean;
  cryptoKey: string;
  useInvoke: boolean;
  invokeAiModelToUse?: InvokeAiModelToUseEnum;
}

export interface ChatSettingsSaveEvent {
  chatId: string;
  name: string;
  useCrypto: boolean;
  cryptoKey: string;
  useInvoke: boolean;
  invokeAiModelToUse?: InvokeAiModelToUseEnum;
}

@Component({
  selector: 'app-chat-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ModalComponent,
    ButtonComponent,
    LabelComponent,
    TextInputComponent,
    ToggleComponent,
    SpinnerComponent,
  ],
  template: `
    <ui-modal (closed)="closed.emit()">
      <span slot="header">{{ 'chatSettings.title' | translate }}</span>

      <div
        class="text-[10px] text-text-muted uppercase tracking-widest mb-4 truncate border-b border-border-default pb-2"
      >
        {{ data().chatName }}
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-6">
          <app-spinner size="md" />
        </div>
      } @else {
        <!-- Chat name -->
        <div class="mb-4">
          <ui-label class="mb-1.5">{{ 'chatSettings.chatNameLabel' | translate }}</ui-label>
          <ui-text-input
            [(ngModel)]="localName"
            [placeholder]="'chatSettings.chatNamePlaceholder' | translate"
          />
        </div>

        @if (showCrypto()) {
          <!-- Encryption toggle -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <ui-label>{{ 'chatSettings.encryption' | translate }}</ui-label>
              <span class="text-[10px] text-text-muted mt-0.5 block">{{
                'chatSettings.encryptionHint' | translate
              }}</span>
            </div>
            <ui-toggle [(ngModel)]="localUseCrypto" activeColor="bg-amber-500" />
          </div>

          <!-- Crypto key input -->
          @if (localUseCrypto) {
            <div class="mb-4">
              <ui-label class="mb-1.5">{{ 'chatSettings.encryptionKey' | translate }}</ui-label>
              <ui-text-input
                type="password"
                [showToggle]="true"
                [mono]="true"
                [(ngModel)]="localCryptoKey"
                [placeholder]="'chatSettings.encryptionKeyPlaceholder' | translate"
              />
            </div>
          }
        }

        @if (showInvoke()) {
          <!-- Invoke AI toggle -->
          <div class="flex items-center justify-between">
            <div>
              <ui-label>{{ 'chatSettings.invoke' | translate }}</ui-label>
              <span class="text-[10px] text-text-muted mt-0.5 block">{{
                'chatSettings.invokeHint' | translate
              }}</span>
            </div>
            <ui-toggle [(ngModel)]="localUseInvoke" activeColor="bg-amber-500" />
          </div>
          @if (localUseInvoke) {
            <div class="self-center w-full mt-1.5">
              <ui-label class="mb-1.5 {{ !localUseInvoke ? 'opacity-0.5' : '' }}">{{
                'toolbar.model' | translate
              }}</ui-label>
              <div class="flex w-full gap-2">
                <ui-button
                  [disabled]="!localUseInvoke"
                  class="flex-1"
                  size="md"
                  variant="secondary"
                  [active]="localInvokeAiModelPreference === 'Juggernaut XL v9'"
                  (clicked)="localInvokeAiModelPreference = 'Juggernaut XL v9'"
                  ><p class="p-1.5">Juggernaut XL v9</p>
                  <div class="absolute top-0 right-2 text-[10px] text-warn">sdxl</div></ui-button
                >
                <ui-button
                  class="flex-1"
                  size="md"
                  variant="secondary"
                  [disabled]="!localUseInvoke"
                  [active]="localInvokeAiModelPreference === 'Dreamshaper 8'"
                  (clicked)="localInvokeAiModelPreference = 'Dreamshaper 8'"
                  ><p class="p-1.5">Dreamshaper 8</p>
                  <div class="absolute top-0 right-2 text-[10px] text-warn">sd 1.5</div></ui-button
                >
              </div>
            </div>
          }
        }
        <!-- Actions -->
        <div class="flex gap-2 pt-1">
          <ui-button variant="primary" class="flex-1" (clicked)="save()">{{
            'chatSettings.save' | translate
          }}</ui-button>
          <ui-button variant="secondary" class="flex-1" (clicked)="closed.emit()">{{
            'chatSettings.cancel' | translate
          }}</ui-button>
        </div>
      }
    </ui-modal>
  `,
})
export class ChatSettingsDialogComponent implements OnChanges, OnInit {
  readonly data = input.required<ChatSettingsData>();
  readonly loading = input<boolean>(false);
  readonly showCrypto = input<boolean>(false);
  readonly showInvoke = input<boolean>(false);

  readonly saved = output<ChatSettingsSaveEvent>();
  readonly closed = output<void>();

  localName = '';
  localUseCrypto = false;
  localUseInvoke = false;
  localCryptoKey = '';
  localInvokeAiModelPreference?: InvokeAiModelToUseEnum;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const d = this.data();
      this.localName = d.name;
      this.localUseCrypto = d.useCrypto;
      this.localCryptoKey = d.cryptoKey;
      this.localUseInvoke = d.useInvoke;
      this.localInvokeAiModelPreference = d.invokeAiModelToUse;
    }
  }

  ngOnInit() {
    const d = this.data();
    this.localName = d.name;
    this.localUseCrypto = d.useCrypto;
    this.localCryptoKey = d.cryptoKey;
    this.localUseInvoke = d.useInvoke;
    this.localInvokeAiModelPreference = d.invokeAiModelToUse;
  }

  save(): void {
    const d = this.data();
    this.saved.emit({
      chatId: d.chatId,
      name: this.localName.trim() || d.chatName,
      useCrypto: this.localUseCrypto,
      cryptoKey: this.localCryptoKey,
      useInvoke: this.localUseInvoke,
      invokeAiModelToUse: this.localInvokeAiModelPreference,
    });
  }
}
