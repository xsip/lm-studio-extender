import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Small status/label badge.
 *
 * Variants:
 *   default   — surface-overlay muted
 *   accent    — accent tint
 *   success   — green tint
 *   warn      — amber tint
 *   danger    — red tint
 *
 * Usage:
 *   <ui-badge variant="accent">Pro</ui-badge>
 *   <ui-badge variant="success">Active</ui-badge>
 *   <ui-badge>admin</ui-badge>
 */
@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium"
      [class]="variantClass()"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly variant = input<'default' | 'accent' | 'success' | 'warn' | 'danger'>('default');

  variantClass(): string {
    const map: Record<string, string> = {
      default: 'bg-surface-overlay text-text-secondary',
      accent:  'bg-accent/15 text-accent',
      success: 'bg-success-bg text-success-muted',
      warn:    'bg-amber-500/15 text-amber-400',
      danger:  'bg-red-500/15 text-red-400',
    };
    return map[this.variant()];
  }
}
