import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPaperClip } from '@ng-icons/heroicons/outline';
import { AuthImagesDirective } from '../../routes/lm-studio-api/markdown.pipe';
import { ChatMetadataDto } from '../../client';

@Component({
  selector: 'app-chat-attachments-sidebar',
  animations: [
    trigger('chatItemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate(
          '220ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
    ]),
  ],
  imports: [CommonModule, TranslateModule, NgIconComponent, AuthImagesDirective],
  viewProviders: [provideIcons({ heroPaperClip })],
  template: `
    <div class="flex-1 overflow-y-auto py-1 min-h-0 px-2 flex flex-col gap-0.5">
      @if (chat()?.generatedAssets?.length === 0) {
        <div class="flex flex-col items-center justify-center h-full gap-2 text-center px-3 py-8">
          <ng-icon name="heroPaperClip" class="w-8 h-8 text-text-disabled animate-float" />
          <span class="text-[10px] text-text-disabled uppercase tracking-wider">{{
            'sidebar.noGeneratedFiles' | translate
          }}</span>
        </div>
      } @else {
        @for (asset of chat()!.generatedAssets!; track asset._id) {
          <button
            type="button"
            class="w-full flex flex-col gap-2 text-left px-2.5 py-2 text-xs rounded-xl group relative active:scale-[0.98] transition-all duration-200"
            @chatItemAnim
            [class]="'text-text-secondary bg-surface-overlay/40 hover:bg-surface-overlay hover:text-text-primary'"
          >
            @if (asset.thumbnail) {
              <div class="relative">
                <img
                  #img
                  [attr.data-auth-src]="asset.thumbnail"
                  class="rounded-md w-full h-auto"
                  src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO89x8AAsEB3+IGkhwAAAAASUVORK5CYII="
                />
                <div
                  class="flex absolute bottom-0 left-0 w-full bg-surface-overlay/80 items-center gap-1.5 pl-1"
                >
                  <div class="truncate font-medium leading-tight">
                    {{ asset.filename }}
                  </div>
                </div>
              </div>
            }
          </button>
        }
      }
    </div>
  `,
})
export class ChatAttachmentsSidebarComponent {
  readonly chat = input.required<ChatMetadataDto | null>();
}
