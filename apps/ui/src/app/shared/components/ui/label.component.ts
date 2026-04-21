import { Component, input } from '@angular/core';

/**
 * Section / field label used inside settings panels and cards.
 *
 * Usage:
 *   <ui-label>Chat Name</ui-label>
 *   <ui-label size="xs" muted>TOKEN USAGE</ui-label>
 */
@Component({
  selector: 'ui-label',
  standalone: true,
  template: `
    <span
      class="block font-medium"
      [class]="classes()"
    >
      <ng-content />
    </span>
  `,
})
export class LabelComponent {
  readonly size  = input<'xs' | 'sm'>('sm');
  readonly muted = input<boolean>(false);
  readonly caps  = input<boolean>(false);

  classes(): string {
    const size  = this.size() === 'xs' ? 'text-[10px]' : 'text-xs';
    const color = this.muted() ? 'text-text-muted' : 'text-text-primary';
    const caps  = this.caps() ? 'uppercase tracking-widest' : '';
    return `${size} ${color} ${caps}`.trim();
  }
}
