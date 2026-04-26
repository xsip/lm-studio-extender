import { animate, style, transition, trigger, state } from '@angular/animations';
import { Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Reusable modal shell — backdrop + centred card.
 * Content is projected via ng-content slots:
 *
 *   [slot="header"]  — title row (gets a close button appended automatically)
 *   (default slot)   — body
 *
 * Usage:
 *   <ui-modal (closed)="closeModal()">
 *     <span slot="header">Chat Settings</span>
 *     <p>body content here…</p>
 *   </ui-modal>
 */
@Component({
  selector: 'ui-modal',
  animations: [
    trigger('backdropAnim', [
      transition(':enter', [
        style({ opacity: 0, backdropFilter: 'blur(0px)' }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.88) translateY(12px)' }),
        animate('280ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0, transform: 'scale(0.94) translateY(6px)' })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [TranslateModule],
  template: `
    <!-- backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @backdropAnim
      (click)="closed.emit()"
    >
      <!-- card -->
      <div
        class="relative w-88 bg-surface-raised border border-border-default rounded-2xl shadow-depth-xl p-6" @cardAnim
        style="box-shadow: var(--shadow-xl);"
        (click)="$event.stopPropagation()"
      >
        <!-- header row -->
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-sm font-semibold text-text-primary tracking-wide">
            <ng-content select="[slot=header]" />
          </h3>
          <button
            type="button"
            (click)="closed.emit()"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-overlay active:scale-90"
            [title]="'common.close' | translate"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- body -->
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalComponent {
  readonly closed = output<void>();
}
