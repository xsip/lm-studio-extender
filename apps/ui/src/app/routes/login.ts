import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen bg-surface-base text-text-primary  flex items-center justify-center p-6"
    >
      <div class="w-full max-w-sm flex flex-col gap-6">
        <!-- Header -->
        <div class="flex flex-col gap-2 border-b border-border-default pb-5">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-accent 400 animate-pulse"></div>
            <span class="text-xs text-text-muted tracking-wide font-medium">LM Studio Extender</span>
          </div>
          <h1 class="text-lg text-text-primary tracking-tight">Sign in</h1>
          <p class="text-xs text-text-muted">Enter your credentials to continue.</p>
        </div>

        <!-- Error banner -->
        @if (errorMessage()) {
          <div
            class="flex items-start gap-2 bg-error-bg border border-error-border rounded-lg px-4 py-3 text-xs text-error-text"
          >
            <span class="shrink-0 mt-0.5">✕</span>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
          <!-- Username -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-text-muted uppercase tracking-widest">Username</label>
            <input
              type="text"
              formControlName="username"
              autocomplete="username"
              placeholder="username"
              class="bg-surface-raised border border-border-default rounded-lg px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              [class.border-red-700]="isInvalid('username')"
            />
            @if (isInvalid('username')) {
              <span class="text-xs text-error-text">Username is required.</span>
            }
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-text-muted uppercase tracking-widest">Password</label>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full bg-surface-raised border border-border-default rounded-lg px-4 py-3 pr-10 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                [class.border-red-700]="isInvalid('password')"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-zinc-400 transition-colors text-xs"
                tabindex="-1"
              >
                {{ showPassword() ? 'hide' : 'show' }}
              </button>
            </div>
            @if (isInvalid('password')) {
              <span class="text-xs text-error-text">Password is required.</span>
            }
          </div>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="mt-2 px-5 py-3 text-xs tracking-wide font-medium bg-accent 600 hover:bg-accent 500 disabled:bg-surface-overlay disabled:text-text-muted disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
          >
            @if (loading()) {
              <span
                class="w-3 h-3 rounded-full border-2 border-zinc-600 border-t-emerald-400 animate-spin"
              ></span>
              <span>Signing in...</span>
            } @else {
              <span>Sign in</span>
            }
          </button>
        </form>
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
          this.errorMessage.set('Unexpected response from server.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.error?.message ?? err?.message ?? 'Login failed. Check your credentials.',
        );
        this.loading.set(false);
      },
    });
  }
}
