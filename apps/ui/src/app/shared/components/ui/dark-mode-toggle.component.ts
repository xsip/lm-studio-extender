import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readStoredTheme, applyTheme } from '../../utils/theme.utils';

/**
 * Self-contained dark-mode toggle button.
 * Reads the stored preference on init and applies it immediately.
 *
 * Usage:
 *   <ui-dark-mode-toggle />
 */
@Component({
  selector: 'ui-dark-mode-toggle',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      [title]="(isDark() ? 'darkMode.switchToLight' : 'darkMode.switchToDark') | translate"
    >
      @if (isDark()) {
        <!-- sun -->
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      } @else {
        <!-- moon -->
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      }
    </button>
  `,
})
export class DarkModeToggleComponent implements OnInit {
  readonly isDark = signal(readStoredTheme());

  ngOnInit(): void {
    applyTheme(this.isDark());
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    applyTheme(next);
  }
}
