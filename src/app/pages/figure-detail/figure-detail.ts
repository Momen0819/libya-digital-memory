import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FiguresService } from '../../core/services/figures.service';
import { I18nService } from '../../core/services/i18n.service';
import { SpeechService } from '../../core/services/speech.service';
import { SmartImage } from '../../shared/components/smart-image';
import { Reveal } from '../../shared/components/reveal';

@Component({
  selector: 'app-figure-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SmartImage, Reveal],
  template: `
    @if (figure(); as f) {
      <!-- HERO -->
      <section class="border-b border-ink/10 bg-gradient-to-b from-teal to-teal-dark text-sand-50">
        <div class="container py-8">
          <a routerLink="/figures" class="inline-flex items-center gap-1.5 text-sm font-bold text-sand-50/80 hover:text-sand-50">
            <svg class="h-4 w-4 ltr:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ i18n.t('figures.eyebrow') }}
          </a>
          <div class="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div class="aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-2xl bg-teal-dark shadow-lift ring-4 ring-sand-50/15">
              <app-smart-image class="h-full w-full" [src]="f.image" [alt]="i18n.pick(f.name)" [label]="i18n.pick(f.name)" />
            </div>
            <div class="pb-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="chip bg-gold text-ink">{{ i18n.era(f.era) }}</span>
                <span class="chip bg-sand-50/15 text-sand-50">{{ i18n.pick(f.origin) }}</span>
              </div>
              <h1 class="mt-3 font-display text-4xl font-bold md:text-5xl">{{ i18n.pick(f.name) }}</h1>
              <p class="mt-1 text-lg text-gold-light">{{ i18n.pick(f.role) }}</p>
              <p class="mt-1 tnum text-sm text-sand-50/80">{{ i18n.pick(f.lifespan) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="container grid gap-8 py-12 md:grid-cols-[1.6fr_1fr] md:gap-10">
        <!-- BIO -->
        <div>
          <div class="mb-4 flex items-center justify-between gap-4">
            <h2 class="font-display text-2xl font-bold">{{ i18n.t('figure.bio') }}</h2>
            @if (speech.supported) {
              <button (click)="toggleListen(f.bio)" class="btn-teal px-4 py-2">
                @if (speech.speaking()) {
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  {{ i18n.t('detail.stop') }}
                } @else {
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ i18n.t('detail.listen') }}
                }
              </button>
            }
          </div>
          <p class="max-w-[70ch] text-lg leading-loose text-ink-soft">{{ i18n.pick(f.bio) }}</p>
        </div>

        <!-- SIDEBAR -->
        <aside class="space-y-5">
          <div class="card p-6">
            <div class="mb-3 text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('detail.facts') }}</div>
            <dl class="divide-y divide-ink/8">
              <div class="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('figure.role') }}</dt>
                <dd class="text-end font-bold">{{ i18n.pick(f.role) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('figure.lifespan') }}</dt>
                <dd class="tnum font-bold">{{ i18n.pick(f.lifespan) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('figure.origin') }}</dt>
                <dd class="font-bold">{{ i18n.pick(f.origin) }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('filter.era') }}</dt>
                <dd class="font-bold">{{ i18n.era(f.era) }}</dd>
              </div>
            </dl>
          </div>

          <div class="card p-6">
            <div class="mb-3 text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('detail.sources') }}</div>
            <ul class="space-y-2">
              @for (s of f.sources; track s.url) {
                <li>
                  <a [href]="s.url" target="_blank" rel="noopener" class="flex items-center gap-2 text-sm font-bold text-teal hover:underline">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
                    {{ s.label }}
                  </a>
                </li>
              }
              <li class="pt-1 text-[11px] text-ink-faint">{{ f.imageCredit }}</li>
            </ul>
          </div>
        </aside>
      </section>

      <!-- RELATED -->
      <section class="container pb-10">
        <h2 class="mb-6 font-display text-2xl font-bold">{{ i18n.t('figure.related') }}</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (r of related(); track r.id) {
            <a [routerLink]="['/p', r.slug]" [appReveal]="$index * 70"
               class="group card flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div class="relative w-28 shrink-0 overflow-hidden bg-sand-100">
                <app-smart-image class="h-full w-full transition-transform duration-700 group-hover:scale-105" [src]="r.image" [alt]="i18n.pick(r.name)" [label]="i18n.pick(r.name)" />
              </div>
              <div class="flex flex-1 flex-col p-4">
                <span class="chip self-start bg-clay/10 text-clay">{{ i18n.era(r.era) }}</span>
                <h3 class="mt-2 font-kufi text-base font-bold leading-tight">{{ i18n.pick(r.name) }}</h3>
                <p class="mt-1 text-xs text-ink-faint">{{ i18n.pick(r.role) }}</p>
              </div>
            </a>
          }
        </div>
      </section>
    } @else {
      <section class="container flex flex-col items-center gap-4 py-32 text-center">
        <h1 class="font-display text-3xl font-bold">404</h1>
        <a routerLink="/figures" class="btn-primary px-6 py-3">{{ i18n.t('figures.eyebrow') }}</a>
      </section>
    }
  `,
})
export class FigureDetail {
  readonly svc = inject(FiguresService);
  readonly i18n = inject(I18nService);
  readonly speech = inject(SpeechService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: null });

  readonly figure = computed(() => {
    const slug = this.params()?.get('slug');
    return slug ? this.svc.bySlug(slug) : undefined;
  });
  readonly related = computed(() => {
    const f = this.figure();
    return f ? this.svc.related(f) : [];
  });

  constructor() {
    effect(() => {
      this.figure();
      this.speech.stop();
    });
  }

  toggleListen(bio: { ar: string; en: string }): void {
    this.speech.toggle(this.i18n.pick(bio), this.i18n.lang());
  }
}
