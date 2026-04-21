import { Component, forwardRef, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Styled text / password input implementing ControlValueAccessor.
 * Works with both [(ngModel)] and reactive forms via formControlName.
 *
 * Usage:
 *   <!-- template-driven -->
 *   <ui-text-input [(ngModel)]="name" placeholder="Chat name…" />
 *
 *   <!-- type password with show/hide toggle -->
 *   <ui-text-input type="password" [(ngModel)]="key" [showToggle]="true" />
 *
 *   <!-- reactive -->
 *   <ui-text-input formControlName="input" placeholder="Enter prompt…" />
 */
@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <input
        [type]="resolvedType()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="w-full bg-surface-base border border-border-default focus:border-accent focus:ring-1 focus:ring-accent rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        [class]="mono() ? 'font-mono' : ''"
        [class.pr-8]="type() === 'password' && showToggle()"
      />

      @if (type() === 'password' && showToggle()) {
        <button
          type="button"
          (click)="showPassword = !showPassword"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          tabindex="-1"
        >
          @if (showPassword) {
            <!-- eye-slash -->
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          } @else {
            <!-- eye -->
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        </button>
      }
    </div>
  `,
})
export class TextInputComponent implements ControlValueAccessor {
  readonly placeholder  = input<string>('');
  readonly type         = input<'text' | 'password'>('text');
  readonly showToggle   = input<boolean>(false);
  readonly mono         = input<boolean>(false);

  value       = '';
  isDisabled  = false;
  showPassword = false;

  private onChange  = (_: string) => {};
  onTouched = () => {};

  resolvedType(): string {
    if (this.type() === 'password' && this.showToggle()) {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type();
  }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  writeValue(v: string): void       { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void  { this.onChange = fn; }
  registerOnTouched(fn: () => void): void          { this.onTouched = fn; }
  setDisabledState(d: boolean): void               { this.isDisabled = d; }
}
