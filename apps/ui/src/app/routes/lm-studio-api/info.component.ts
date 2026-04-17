import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, MeDto, ModelDto, OpenAIService } from '../../client';
import { LMStudioService } from '../../client';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-info',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col h-full overflow-y-auto p-4 gap-4 text-xs">
      <!-- ── Header ── -->
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">Theme: </span>
        <!-- Dark mode toggle -->
        <button
          type="button"
          (click)="toggleDarkMode()"
          class="flex items-center justify-center w-8 h-8 rounded-lg border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
          [title]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          @if (isDark()) {
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                stroke-linecap="round"
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
          } @else {
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          }
        </button>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">Documentation: </span>
        <div class="flex items-center gap-1 ml-1">
          <a
            routerLink="/"
            routerLinkActive="border-accent text-accent bg-accent/10"
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >View Readme</a
          >
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">Client: </span>
        <div class="flex items-center gap-1 ml-1">
          <a
            routerLink="/chat-lm-studio"
            routerLinkActive="border-accent text-accent bg-accent/10"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >LM Studio</a
          >
          <a
            routerLink="/chat-openai"
            routerLinkActive="border-accent text-accent bg-accent/10"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >OpenAI</a
          >
        </div>
      </div>
      <!-- ── Header ── -->
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">Info</span>
        <button
          type="button"
          (click)="refresh()"
          class="flex items-center gap-1 px-2 py-1 rounded-md border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
          [disabled]="loading()"
          title="Refresh"
        >
          <svg
            class="w-3 h-3 transition-transform"
            [class.animate-spin]="loading()"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <!-- ── User card ── -->
      <section class="rounded-xl border border-border-default bg-surface-raised overflow-hidden">
        <div
          class="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-overlay"
        >
          <svg
            class="w-3.5 h-3.5 text-text-muted"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span
            class="font-medium text-text-secondary tracking-wide uppercase"
            style="font-size:10px"
            >User</span
          >
        </div>

        @if (userLoading()) {
          <div class="px-3 py-4 flex justify-center">
            <svg
              class="w-4 h-4 animate-spin text-text-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        } @else if (userError()) {
          <p class="px-3 py-3 text-red-400">Failed to load user data.</p>
        } @else if (user()) {
          <div class="divide-y divide-border-subtle">
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">Username</span>
              <span class="font-medium text-text-primary font-mono">{{ user()!.username }}</span>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">Role</span>
              <span
                class="px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                [class]="
                  user()!.role === 'admin'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-surface-overlay text-text-secondary'
                "
              >
                {{ user()!.role }}
              </span>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">Subscription</span>
              <span
                class="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-accent/15 text-accent"
              >
                {{ user()!.subscription }}
              </span>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">Status</span>
              <span class="flex items-center gap-1.5">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  [class]="user()!.isActivated ? 'bg-success-muted' : 'bg-red-400'"
                >
                </span>
                <span [class]="user()!.isActivated ? 'text-success-muted' : 'text-red-400'">
                  {{ user()!.isActivated ? 'Active' : 'Inactive' }}
                </span>
              </span>
            </div>
          </div>
        }
      </section>

      <!-- ── Token usage card ── -->
      <section class="rounded-xl border border-border-default bg-surface-raised overflow-hidden">
        <div
          class="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-overlay"
        >
          <svg
            class="w-3.5 h-3.5 text-text-muted"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span
            class="font-medium text-text-secondary tracking-wide uppercase"
            style="font-size:10px"
            >Token Usage</span
          >
        </div>

        @if (userLoading()) {
          <div class="px-3 py-4 flex justify-center">
            <svg
              class="w-4 h-4 animate-spin text-text-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        } @else if (user()) {
          <div class="px-3 pt-3 pb-2 flex flex-col gap-2">
            <!-- Progress bar -->
            <div class="flex justify-between text-[10px] mb-0.5">
              <span class="text-text-muted">Used</span>
              <span class="font-mono text-text-secondary">
                {{ user()!.usedTokens | number }} / {{ user()!.tokenLimit | number }}
              </span>
            </div>
            <div class="h-1.5 rounded-full bg-surface-sunken overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                [style.width.%]="tokenPercent()"
                [class]="
                  tokenPercent() > 85
                    ? 'bg-red-400'
                    : tokenPercent() > 60
                      ? 'bg-amber-400'
                      : 'bg-accent'
                "
              ></div>
            </div>
            <div class="flex justify-between text-[10px] text-text-muted mt-0.5">
              <span>{{ tokenPercent() | number: '1.0-1' }}% used</span>
              @if (user()!.tokenCountResetDate) {
                <span>Resets {{ user()!.tokenCountResetDate | date: 'short' }}</span>
              }
            </div>
          </div>
        }
      </section>

      <!-- ── Models card ── -->
      <section class="rounded-xl border border-border-default bg-surface-raised overflow-hidden">
        <div
          class="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-overlay"
        >
          <svg
            class="w-3.5 h-3.5 text-text-muted"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span
            class="font-medium text-text-secondary tracking-wide uppercase"
            style="font-size:10px"
            >Available Models</span
          >
          @if (!modelsLoading() && models().length > 0) {
            <span
              class="ml-auto px-1.5 py-0.5 rounded-full bg-surface-sunken text-text-muted text-[10px]"
            >
              {{ models().length }}
            </span>
          }
        </div>

        @if (modelsLoading()) {
          <div class="px-3 py-4 flex justify-center">
            <svg
              class="w-4 h-4 animate-spin text-text-muted"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        } @else if (modelsError()) {
          <p class="px-3 py-3 text-red-400">Failed to load models.</p>
        } @else if (models().length === 0) {
          <p class="px-3 py-3 text-text-muted">No models loaded in LM Studio.</p>
        } @else {
          <div class="divide-y divide-border-subtle">
            @for (model of models(); track model.key) {
              <div class="px-3 py-2.5 flex flex-col gap-0.5">
                <div class="flex items-center gap-2">
                  <span
                    class="font-medium text-text-primary truncate flex-1 font-mono"
                    style="font-size:11px"
                  >
                    {{ model.key }}
                  </span>
                  <span
                    class="shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-surface-overlay text-text-muted uppercase"
                  >
                    {{ model.type }}
                  </span>
                </div>
                @if (model.publisher) {
                  <span class="text-text-muted" style="font-size:10px">{{ model.publisher }}</span>
                }
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class InfoComponent implements OnInit {
  readonly uiType = input.required<'OPENAI' | 'LMSTUDIO'>();
  private readonly authService = inject(AuthService);
  private readonly lmStudioService = inject(LMStudioService);
  private readonly openaiService = inject(OpenAIService);
  readonly isDark = signal(this.readStoredTheme());
  readonly user = signal<MeDto | null>(null);
  readonly userLoading = signal(false);
  readonly userError = signal(false);
  private static readonly THEME_STORAGE_KEY = 'theme';
  readonly models = signal<ModelDto[]>([]);
  readonly modelsLoading = signal(false);
  readonly modelsError = signal(false);

  readonly loading = () => this.userLoading() || this.modelsLoading();

  private readStoredTheme(): boolean {
    try {
      const stored = localStorage.getItem(InfoComponent.THEME_STORAGE_KEY);
      return stored ? stored === 'dark' : true; // default dark
    } catch {
      return true;
    }
  }

  tokenPercent(): number {
    const u = this.user();
    if (!u || !u.tokenLimit) return 0;
    return Math.min(100, (u.usedTokens / u.tokenLimit) * 100);
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadModels();
  }

  refresh(): void {
    this.loadUser();
    this.loadModels();
  }

  private loadUser(): void {
    this.userLoading.set(true);
    this.userError.set(false);
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user.set(data);
        this.userLoading.set(false);
      },
      error: () => {
        this.userError.set(true);
        this.userLoading.set(false);
      },
    });
  }

  private loadModels(): void {
    this.modelsLoading.set(true);
    this.modelsError.set(false);
    if (this.uiType() === 'LMSTUDIO') {
      this.lmStudioService.getModels().subscribe({
        next: (res) => {
          this.models.set(res.models ?? []);
          this.modelsLoading.set(false);
        },
        error: () => {
          this.modelsError.set(true);
          this.modelsLoading.set(false);
        },
      });
    } else {
      this.openaiService.getModelsOpenAi().subscribe({
        next: (res) => {
          this.models.set(
            (res ?? []).map((m) => {
              return {
                key: m.id,
                publisher: m.owned_by,
                type: 'llm',
              } as ModelDto;
            }),
          );
          this.modelsLoading.set(false);
        },
        error: () => {
          this.modelsError.set(true);
          this.modelsLoading.set(false);
        },
      });
    }
  }

  toggleDarkMode(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(InfoComponent.THEME_STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }
}
