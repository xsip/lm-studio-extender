import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../client';

@Component({
  selector: 'app-login',
  animations: [
    trigger('pageAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.94) translateY(16px)' }),
        animate('380ms 60ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
    ]),
    trigger('headerAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms 30ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('errorAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-8px)' }),
        animate('220ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('160ms ease-in', style({ opacity: 0, transform: 'translateX(8px)' })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface-base text-text-primary flex items-center justify-center p-6 relative overflow-hidden" @pageAnim>
      <!-- Atmospheric background -->
      <div class="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
           style="background: radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%); filter: blur(60px); opacity: 0.35;"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
           style="background: radial-gradient(circle, var(--color-secondary-accent-subtle) 0%, transparent 70%); filter: blur(50px); opacity: 0.4;"></div>

      <div class="w-full max-w-sm flex flex-col gap-8 relative animate-slide-up">

        <!-- Logo / Header -->
        <div class="flex flex-col items-center gap-4 text-center" @headerAnim>
          <div class="relative">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
                 style="background: linear-gradient(135deg, var(--color-accent), var(--color-secondary-accent)); box-shadow: 0 8px 32px var(--color-accent-glow);">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success-muted animate-pulse"
                 style="box-shadow: 0 0 8px var(--color-success-muted);"></div>
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-text-primary tracking-tight">{{ 'login.title' | translate }}</h1>
            <p class="text-sm text-text-muted mt-1">{{ 'login.subtitle' | translate }}</p>
          </div>
        </div>

        <!-- Card -->
        <div class="glass-strong rounded-2xl p-6 flex flex-col gap-5 shadow-depth-xl" @cardAnim>

          @if (errorMessage()) {
            <div class="flex items-start gap-2.5 bg-error-bg border border-error-border rounded-xl px-4 py-3 text-xs text-error-text" @errorAnim>
              <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] text-text-muted uppercase tracking-[0.15em] font-semibold">{{ 'login.username' | translate }}</label>
              <input
                type="text"
                formControlName="username"
                autocomplete="username"
                [placeholder]="'login.usernamePlaceholder' | translate"
                class="bg-surface-base border border-border-default rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-all duration-200"
                style="box-shadow: var(--shadow-inset);"
                [class.border-error-border]="isInvalid('username')"
              />
              @if (isInvalid('username')) {
                <span class="text-xs text-error-text animate-slide-up">{{ 'login.usernameRequired' | translate }}</span>
              }
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-[10px] text-text-muted uppercase tracking-[0.15em] font-semibold">{{ 'login.password' | translate }}</label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full bg-surface-base border border-border-default rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent transition-all duration-200"
                  style="box-shadow: var(--shadow-inset);"
                  [class.border-error-border]="isInvalid('password')"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
                  tabindex="-1"
                >
                  @if (showPassword()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (isInvalid('password')) {
                <span class="text-xs text-error-text animate-slide-up">{{ 'login.passwordRequired' | translate }}</span>
              }
            </div>

            <div class="animate-slide-up"><button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="mt-1 relative overflow-hidden px-5 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              style="background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover)); box-shadow: 0 4px 20px var(--color-accent-glow);"
            >
              @if (loading()) {
                <span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                <span>{{ 'login.signingIn' | translate }}</span>
              } @else {
                <span>{{ 'login.submit' | translate }}</span>
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              }
            </button></div>
          </form>
        </div>

        <div class="flex items-center justify-center gap-2 text-[10px] text-text-disabled animate-fade-in">
          <div class="w-1.5 h-1.5 rounded-full bg-success-muted" style="box-shadow: 0 0 6px var(--color-success-muted);"></div>
          <span class="tracking-wide uppercase">{{ 'login.appName' | translate }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [],
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly showPassword = signal(false);

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.form.markAllAsTouched();

    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login({ user: username!, password: password! }).subscribe({
      next: (res: any) => {
        const token = res?.access_token ?? res?.token ?? res;
        if (token && typeof token === 'string') {
          localStorage.setItem('jwt_token', token);
          this.router.navigate(['/chat-openai']);
        } else {
          this.errorMessage.set('login.unexpectedResponse');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message ?? err?.message ?? 'login.loginFailed',
        );
        this.loading.set(false);
      },
    });
  }
}
