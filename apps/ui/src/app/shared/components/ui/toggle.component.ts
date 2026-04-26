import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Styled toggle switch implementing ControlValueAccessor.
 *
 * Usage:
 *   <ui-toggle [(ngModel)]="useCrypto" />
 *   <ui-toggle [checked]="val" (checkedChange)="val = $event" />
 */
@Component({
  selector: 'ui-toggle',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      [disabled]="isDisabled"
      (click)="toggle()"
      class="relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      [class]="checked ? activeColor() : 'bg-surface-sunken border border-border-strong'" [style]="checked ? 'box-shadow: 0 0 8px var(--color-accent-glow);' : ''"
    >
      <span
        class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200"
        [class]="checked ? 'translate-x-4' : 'translate-x-1'"
      ></span>
    </button>
  `,
})
export class ToggleComponent implements ControlValueAccessor {
  readonly activeColor = input<string>('bg-accent');

  checked    = false;
  isDisabled = false;

  readonly checkedChange = output<boolean>();

  private onChange  = (_: boolean) => {};
  private onTouched = () => {};

  toggle(): void {
    if (this.isDisabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }

  writeValue(v: boolean): void            { this.checked = !!v; }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void          { this.onTouched = fn; }
  setDisabledState(d: boolean): void               { this.isDisabled = d; }
}
