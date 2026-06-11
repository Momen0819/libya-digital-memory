import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { BrandMark } from './brand-mark';

@Component({
  selector: 'app-site-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, BrandMark],
  template: `
    <header class="sticky top-0 z-50 border-b border-ink/10 glass">
      <div class="container flex h-16 items-center justify-between gap-4">
        <a routerLink="/" class="flex items-center gap-3" (click)="open.set(false)">
          <app-brand-mark class="h-9 w-9" />
          <span class="hidden flex-col leading-none sm:flex">
            <span class="font-kufi text-base font-bold text-ink">{{ i18n.t('brand.name') }}</span>
            <span class="mt-0.5 text-[11px] text-ink-faint">{{ i18n.t('brand.tagline') }}</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 md:flex">
          @for (l of links; track l.path) {
            <a
              [routerLink]="l.path"
              routerLinkActive="text-clay bg-clay/[0.07]"
              [routerLinkActiveOptions]="{ exact: l.path === '/' }"
              class="rounded-full px-3.5 py-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink">
              {{ i18n.t(l.key) }}
            </a>
          }
        </nav>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="i18n.toggle()"
            class="btn-ghost px-3.5 py-2"
            [attr.aria-label]="i18n.lang() === 'ar' ? 'Switch to English' : 'التبديل للعربية'">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></svg>
            {{ i18n.lang() === 'ar' ? 'EN' : 'ع' }}
          </button>
          <button
            type="button"
            class="btn-ghost p-2 md:hidden"
            (click)="open.set(!open())"
            aria-label="القائمة">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      @if (open()) {
        <nav class="border-t border-ink/10 bg-parchment/95 px-5 py-3 md:hidden">
          @for (l of links; track l.path) {
            <a
              [routerLink]="l.path"
              routerLinkActive="text-clay"
              [routerLinkActiveOptions]="{ exact: l.path === '/' }"
              (click)="open.set(false)"
              class="block rounded-lg px-3 py-2.5 text-sm font-bold text-ink-soft">
              {{ i18n.t(l.key) }}
            </a>
          }
        </nav>
      }
    </header>
  `,
})
export class SiteHeader {
  readonly i18n = inject(I18nService);
  readonly open = signal(false);

  readonly links = [
    { path: '/', key: 'nav.home' },
    { path: '/monuments', key: 'nav.monuments' },
    { path: '/figures', key: 'nav.figures' },
    { path: '/map', key: 'nav.map' },
    { path: '/gallery', key: 'nav.gallery' },
    { path: '/about', key: 'nav.about' },
  ];
}
