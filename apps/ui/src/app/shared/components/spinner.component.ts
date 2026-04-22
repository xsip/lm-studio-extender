import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable animated spinner.
 *
 * Usage:
 *   <app-spinner />                       — default size (w-3 h-3)
 *   <app-spinner size="sm" />             — w-3 h-3
 *   <app-spinner size="md" />             — w-4 h-4
 *   <app-spinner size="lg" />             — w-5 h-5
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="rounded-full border-2 border-border-default border-t-text-secondary animate-spin shrink-0 inline-block"
      [class]="sizeClass()"
    ></span>
  `,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('sm');

  sizeClass(): string {
    switch (this.size()) {
      case 'xl': return 'w-12 h-12';
      case 'lg': return 'w-5 h-5';
      case 'md': return 'w-4 h-4';
      default:   return 'w-3 h-3';
    }
  }
}
