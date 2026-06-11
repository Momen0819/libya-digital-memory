import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeritageService } from '../../core/services/heritage.service';
import { I18nService } from '../../core/services/i18n.service';
import { MonumentCard } from '../../shared/components/monument-card';
import { SmartImage } from '../../shared/components/smart-image';
import { Region } from '../../core/models/monument.model';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MonumentCard, SmartImage],
  template: `
    <!-- HERO -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <app-smart-image class="h-full w-full" [src]="hero().image" [alt]="i18n.pick(hero().name)" [label]="i18n.pick(hero().name)" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/65 to-ink/55"></div>
        <div class="absolute inset-0 bg-arabesque opacity-40 mix-blend-overlay"></div>
      </div>

      <div class="container relative py-24 md:py-32">
        <div class="max-w-2xl animate-fade-up">
          <span class="eyebrow text-gold-light">
            <span class="h-px w-8 bg-gold-light"></span>{{ i18n.t('hero.eyebrow') }}
          </span>
          <h1 class="mt-5 font-display text-4xl font-bold leading-[1.15] text-sand-50 text-balance md:text-6xl">
            {{ i18n.t('hero.title') }}
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-sand-50/85">
            {{ i18n.t('hero.subtitle') }}
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a routerLink="/monuments" class="btn-primary px-6 py-3 text-base">
              {{ i18n.t('cta.explore') }}
              <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a routerLink="/map" class="btn px-6 py-3 text-base bg-sand-50/10 text-sand-50 ring-1 ring-sand-50/30 backdrop-blur hover:bg-sand-50/20">
              {{ i18n.t('cta.map') }}
            </a>
          </div>
        </div>
      </div>

      <!-- stats band -->
      <div class="relative border-t border-sand-50/15 bg-ink/30 backdrop-blur">
        <div class="container grid grid-cols-2 divide-x divide-sand-50/10 rtl:divide-x-reverse md:grid-cols-4">
          @for (s of statItems(); track s.key) {
            <div class="px-4 py-6 text-center">
              <div class="font-kufi text-3xl font-bold text-gold-light">{{ s.value }}</div>
              <div class="mt-1 text-xs font-medium text-sand-50/70">{{ i18n.t(s.key) }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FEATURED -->
    <section class="container py-20">
      <div class="mb-10 text-center">
        <div class="rule-gold mx-auto mb-5 max-w-[180px]"><span class="diamond"></span></div>
        <h2 class="font-display text-3xl font-bold md:text-4xl">{{ i18n.t('section.featured') }}</h2>
        <p class="mx-auto mt-3 max-w-xl text-ink-soft">{{ i18n.t('section.featuredSub') }}</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        @for (m of featured(); track m.id) {
          <app-monument-card [m]="m" />
        }
      </div>
      <div class="mt-10 text-center">
        <a routerLink="/monuments" class="btn-ghost px-6 py-3">{{ i18n.t('cta.viewAll') }}</a>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="border-y border-ink/10 bg-sand-50/60">
      <div class="container py-20">
        <div class="mb-12 text-center">
          <span class="eyebrow">{{ i18n.t('section.how') }}</span>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          @for (step of steps(); track step.n) {
            <div class="relative text-center">
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal text-sand-50 shadow-card">
                @switch (step.n) {
                  @case (1) {
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 21v.01M17 21h.01M21 17h.01" stroke-linecap="round"/></svg>
                  }
                  @case (2) {
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2" stroke-linecap="round"/></svg>
                  }
                  @default {
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11l19-9-9 19-2-8z" stroke-linejoin="round"/></svg>
                  }
                }
              </div>
              <div class="mx-auto mt-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-clay text-xs font-bold text-sand-50">{{ step.n }}</div>
              <h3 class="mt-3 font-kufi text-xl font-bold">{{ i18n.t(step.t) }}</h3>
              <p class="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{{ i18n.t(step.d) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- EXPLORE BY REGION -->
    <section class="container py-20">
      <div class="mb-10 text-center">
        <h2 class="font-display text-3xl font-bold md:text-4xl">{{ i18n.t('section.explore') }}</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        @for (r of regions(); track r.region) {
          <a [routerLink]="['/monuments']" [queryParams]="{ region: r.region }"
             class="group card relative overflow-hidden p-7 transition-all hover:-translate-y-1 hover:shadow-lift">
            <div class="absolute inset-y-0 -left-6 w-24 bg-arabesque opacity-60"></div>
            <div class="relative">
              <div class="font-kufi text-sm font-bold text-clay">{{ r.count }} {{ i18n.t('stats.monuments') }}</div>
              <h3 class="mt-2 font-display text-2xl font-bold">{{ i18n.region(r.region) }}</h3>
              <div class="mt-5 flex items-center gap-1.5 text-sm font-bold text-teal">
                {{ i18n.t('cta.explore') }}
                <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- PARTNERS / CTA -->
    <section class="container pb-8">
      <div class="overflow-hidden rounded-2xl bg-teal px-8 py-12 text-center text-sand-50">
        <h2 class="font-display text-2xl font-bold md:text-3xl">{{ i18n.t('about.visionText') }}</h2>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-6 text-sm text-sand-50/80">
          <span>{{ i18n.t('about.ministry') }}</span>
          <span class="h-4 w-px bg-sand-50/30"></span>
          <a href="https://izer.ie/" target="_blank" rel="noopener" class="font-bold text-gold-light hover:underline">IZER — izer.ie</a>
        </div>
      </div>
    </section>
  `,
})
export class Home {
  readonly heritage = inject(HeritageService);
  readonly i18n = inject(I18nService);

  readonly featured = computed(() => this.heritage.featured());
  readonly hero = computed(() => this.heritage.featured()[0] ?? this.heritage.all()[0]);

  statItems() {
    const s = this.heritage.stats();
    return [
      { key: 'stats.monuments', value: '50+' },
      { key: 'stats.unesco', value: String(s.unesco) },
      { key: 'stats.regions', value: '3' },
      { key: 'stats.eras', value: `${s.eras}+` },
    ];
  }

  regions(): { region: Region; count: number }[] {
    return this.heritage.regions().map((region) => ({
      region,
      count: this.heritage.byRegion(region).length,
    }));
  }

  steps() {
    return [
      { n: 1, t: 'how.scan.t', d: 'how.scan.d' },
      { n: 2, t: 'how.open.t', d: 'how.open.d' },
      { n: 3, t: 'how.discover.t', d: 'how.discover.d' },
    ];
  }
}
