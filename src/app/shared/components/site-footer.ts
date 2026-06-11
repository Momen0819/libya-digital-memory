import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { BrandMark } from './brand-mark';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrandMark],
  template: `
    <footer class="mt-24 border-t border-ink/10 bg-teal text-sand-50">
      <div class="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div class="flex items-center gap-3">
            <app-brand-mark class="h-10 w-10" />
            <span class="font-kufi text-lg font-bold">{{ i18n.t('brand.name') }}</span>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-sand-50/75">
            {{ i18n.t('hero.subtitle') }}
          </p>
        </div>

        <div>
          <h4 class="mb-4 font-kufi text-sm font-bold text-gold">{{ i18n.t('nav.monuments') }}</h4>
          <ul class="space-y-2.5 text-sm text-sand-50/80">
            <li><a routerLink="/monuments" class="hover:text-gold">{{ i18n.t('nav.monuments') }}</a></li>
            <li><a routerLink="/map" class="hover:text-gold">{{ i18n.t('nav.map') }}</a></li>
            <li><a routerLink="/gallery" class="hover:text-gold">{{ i18n.t('nav.gallery') }}</a></li>
            <li><a routerLink="/about" class="hover:text-gold">{{ i18n.t('nav.about') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="mb-4 font-kufi text-sm font-bold text-gold">{{ i18n.t('section.partners') }}</h4>
          <ul class="space-y-2.5 text-sm text-sand-50/80">
            <li>{{ i18n.t('about.ministry') }}</li>
            <li><a href="https://izer.ie/" target="_blank" rel="noopener" class="hover:text-gold">IZER — izer.ie</a></li>
            <li class="text-sand-50/55">{{ i18n.t('footer.images') }}</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-sand-50/15">
        <div class="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-sand-50/60 sm:flex-row">
          <span>© 2026 {{ i18n.t('brand.name') }} — {{ i18n.t('footer.rights') }}</span>
          <span>{{ i18n.t('footer.proposal') }}</span>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  readonly i18n = inject(I18nService);
}
