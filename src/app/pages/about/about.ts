import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { Reveal } from '../../shared/components/reveal';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="relative overflow-hidden border-b border-ink/10 bg-teal text-sand-50">
      <div class="absolute inset-0 bg-arabesque opacity-30"></div>
      <div class="container relative py-16">
        <span class="eyebrow text-gold-light"><span class="h-px w-8 bg-gold-light"></span>{{ i18n.t('about.title') }}</span>
        <h1 class="mt-4 max-w-3xl font-display text-3xl font-bold leading-snug md:text-4xl">{{ i18n.t('about.lead') }}</h1>
      </div>
    </section>

    <section class="container grid gap-10 py-16 md:grid-cols-[1.5fr_1fr]">
      <div>
        <h2 class="font-display text-2xl font-bold text-clay">{{ i18n.t('about.vision') }}</h2>
        <p class="mt-4 text-lg leading-relaxed text-ink-soft">“{{ i18n.t('about.visionText') }}”</p>

        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          @for (s of steps(); track s.t) {
            <div class="card p-5" [appReveal]="$index * 80">
              <div class="font-kufi text-3xl font-bold text-gold">0{{ s.n }}</div>
              <h3 class="mt-2 font-kufi text-base font-bold">{{ i18n.t(s.t) }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ i18n.t(s.d) }}</p>
            </div>
          }
        </div>

        <div class="mt-8 rounded-xl border border-gold/30 bg-gold/[0.07] p-4 text-sm text-ink-soft">
          ⓘ {{ i18n.t('about.poc') }}
        </div>
      </div>

      <aside class="space-y-4">
        <div class="card p-6">
          <div class="text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('about.ministryRole') }}</div>
          <div class="mt-2 font-kufi text-lg font-bold">{{ i18n.t('about.ministry') }}</div>
        </div>
        <div class="card p-6">
          <div class="text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('about.partnerRole') }}</div>
          <div class="mt-2 font-kufi text-lg font-bold">IZER</div>
          <a href="https://izer.ie/" target="_blank" rel="noopener" class="mt-1 inline-block text-sm font-bold text-teal hover:underline">izer.ie ↗</a>
          <p class="mt-3 text-sm leading-relaxed text-ink-soft">
            {{ i18n.lang() === 'ar'
              ? 'شركة متخصصة في بناء الهويات الرقمية وإنتاج الفيديو والتصميم والاستشارات الرقمية.'
              : 'A studio specialised in digital identity, video production, design and digital consultancy.' }}
          </p>
        </div>
      </aside>
    </section>
  `,
})
export class About {
  readonly i18n = inject(I18nService);

  steps() {
    return [
      { n: 1, t: 'how.scan.t', d: 'how.scan.d' },
      { n: 2, t: 'how.open.t', d: 'how.open.d' },
      { n: 3, t: 'how.discover.t', d: 'how.discover.d' },
    ];
  }
}
