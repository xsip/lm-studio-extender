import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService, LMStudioService, MeDto, ModelDto, OpenAIService } from '../../client';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { DarkModeToggleComponent } from '../../shared/components/ui/dark-mode-toggle.component';
import { BadgeComponent } from '../../shared/components/ui/badge.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
  selector: 'app-info',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    SpinnerComponent,
    DarkModeToggleComponent,
    BadgeComponent,
    ButtonComponent,
  ],
  template: `
    <div class="flex flex-col h-full overflow-y-auto p-4 gap-4 text-xs">
      <!-- ── Theme ── -->
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">{{ 'info.theme' | translate }}</span>
        <ui-dark-mode-toggle />
      </div>

      <!-- ── Navigation links ── -->
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">{{ 'info.documentation' | translate }}</span>
        <a
          routerLink="/"
          routerLinkActive="border-accent text-accent bg-accent/10"
          [routerLinkActiveOptions]="{ exact: true }"
          class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
          >{{ 'info.viewReadme' | translate }}</a
        >
      </div>

      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">{{ 'info.client' | translate }}</span>
        <div class="flex items-center gap-1 ml-1">
          <a
            routerLink="/chat-lm-studio"
            routerLinkActive="border-accent text-accent bg-accent/10"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >{{ 'info.lmStudio' | translate }}</a
          >
          <a
            routerLink="/chat-openai"
            routerLinkActive="border-accent text-accent bg-accent/10"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-2.5 py-1 text-[11px] rounded-md font-medium border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
            >{{ 'info.openAI' | translate }}</a
          >
        </div>
      </div>

      <!-- ── Refresh ── -->
      <div class="flex items-center justify-between">
        <span class="text-text-primary font-semibold text-sm">{{ 'info.info' | translate }}</span>
        <ui-button variant="secondary" size="xs" [disabled]="loading()" (clicked)="refresh()">
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
          <span>{{ 'info.refresh' | translate }}</span>
        </ui-button>
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
            >{{ 'info.user' | translate }}</span
          >
        </div>

        @if (userLoading()) {
          <div class="px-3 py-4 flex justify-center"><app-spinner size="md" /></div>
        } @else if (userError()) {
          <p class="px-3 py-3 text-red-400">{{ 'info.failedLoadUser' | translate }}</p>
        } @else if (user()) {
          <div class="divide-y divide-border-subtle">
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">{{ 'info.username' | translate }}</span>
              <span class="font-medium text-text-primary font-mono">{{ user()!.username }}</span>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">{{ 'info.role' | translate }}</span>
              <ui-badge [variant]="user()!.role === 'admin' ? 'warn' : 'default'">{{
                user()!.role
              }}</ui-badge>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">{{ 'info.subscription' | translate }}</span>
              <ui-badge variant="accent">{{ user()!.subscription }}</ui-badge>
            </div>
            <div class="flex justify-between items-center px-3 py-2">
              <span class="text-text-muted">{{ 'info.status' | translate }}</span>
              <span class="flex items-center gap-1.5">
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  [class]="user()!.isActivated ? 'bg-success-muted' : 'bg-red-400'"
                ></span>
                <span [class]="user()!.isActivated ? 'text-success-muted' : 'text-red-400'">
                  {{ (user()!.isActivated ? 'info.active' : 'info.inactive') | translate }}
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
            >{{ 'info.tokenUsage' | translate }}</span
          >
        </div>

        @if (userLoading()) {
          <div class="px-3 py-4 flex justify-center"><app-spinner size="md" /></div>
        } @else if (user()) {
          <div class="px-3 pt-3 pb-2 flex flex-col gap-2">
            <div class="flex justify-between text-[10px] mb-0.5">
              <span class="text-text-muted">{{ 'info.used' | translate }}</span>
              <span class="font-mono text-text-secondary"
                >{{ user()!.usedTokens | number }} / {{ user()!.tokenLimit | number }}</span
              >
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
              <span>{{ 'info.percentUsed' | translate: { percent: (tokenPercent() | number: '1.0-1') } }}</span>
              @if (user()!.tokenCountResetDate) {
                <span>{{ 'info.resets' | translate }} {{ user()!.tokenCountResetDate | date: 'short' }}</span>
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
            >{{ 'info.availableModels' | translate }}</span
          >
          @if (!modelsLoading() && models().length > 0) {
            <span
              class="ml-auto px-1.5 py-0.5 rounded-full bg-surface-sunken text-text-muted text-[10px]"
              >{{ models().length }}</span
            >
          }
        </div>

        @if (modelsLoading()) {
          <div class="px-3 py-4 flex justify-center"><app-spinner size="md" /></div>
        } @else if (modelsError()) {
          <p class="px-3 py-3 text-red-400">{{ 'info.failedLoadModels' | translate }}</p>
        } @else if (models().length === 0) {
          <p class="px-3 py-3 text-text-muted">{{ 'info.noModelsLoaded' | translate }}</p>
        } @else {
          <div class="divide-y divide-border-subtle">
            @for (model of models(); track model.key) {
              <div class="px-3 py-2.5 flex flex-col gap-0.5">
                <div class="flex items-center gap-2">
                  <span
                    class="font-medium text-text-primary truncate flex-1 font-mono"
                    style="font-size:11px"
                    >{{ model.key }}</span
                  >
                  <ui-badge>{{ model.type }}</ui-badge>
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

  readonly user = signal<MeDto | null>(null);
  readonly userLoading = signal(false);
  readonly userError = signal(false);
  readonly models = signal<ModelDto[]>([]);
  readonly modelsLoading = signal(false);
  readonly modelsError = signal(false);

  readonly loading = () => this.userLoading() || this.modelsLoading();

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
            (res ?? []).map((m) => ({ key: m.id, publisher: m.owned_by, type: 'llm' }) as ModelDto),
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
}
