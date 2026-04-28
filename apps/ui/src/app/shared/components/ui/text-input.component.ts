import { Component, forwardRef, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';

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
  imports: [CommonModule, FormsModule, NgIconComponent],
  viewProviders: [provideIcons({ heroEye, heroEyeSlash })],
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
        class="w-full bg-surface-base border border-border-default rounded-xl px-3 py-2 text-xs text-text-primary placeholder-text-disabled focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        [class]="mono() ? 'font-mono' : ''"
        [class.pr-8]="type() === 'password' && showToggle()"
      />

      @if (type() === 'password' && showToggle()) {
        <button
          type="button"
          (click)="showPassword = !showPassword"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary active:scale-90 transition-all duration-150"
          tabindex="-1"
        >
          @if (showPassword) {
            <!-- eye-slash -->
            <ng-icon name="heroEyeSlash" class="w-3.5 h-3.5" />
          } @else {
            <!-- eye -->
            <ng-icon name="heroEye" class="w-3.5 h-3.5" />
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
