import { Component, output } from '@angular/core';

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
  standalone: true,
  template: `
    <!-- backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      (click)="closed.emit()"
    >
      <!-- card — stop propagation so clicks inside don't close the modal -->
      <div
        class="relative w-80 bg-surface-raised border border-border-default rounded-xl shadow-depth-xl shadow-black/50 p-5"
        (click)="$event.stopPropagation()"
      >
        <!-- header row -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-text-primary tracking-wide">
            <ng-content select="[slot=header]" />
          </h3>
          <button
            type="button"
            (click)="closed.emit()"
            class="text-text-muted hover:text-text-primary transition-colors"
            title="Close"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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
