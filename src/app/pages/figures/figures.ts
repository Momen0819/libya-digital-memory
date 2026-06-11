import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FiguresService } from '../../core/services/figures.service';
import { I18nService } from '../../core/services/i18n.service';
import { SmartImage } from '../../shared/components/smart-image';
import { Reveal } from '../../shared/components/reveal';

@Component({
  selector: 'app-figures',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SmartImage, Reveal],
  template: `
    <section class="border-b border-ink/10 bg-sand-50/60">
      <div class="container py-12">
        <span class="eyebrow">{{ i18n.t('figures.eyebrow') }}</span>
        <h1 class="mt-3 font-display text-3xl font-bold md:text-4xl">{{ i18n.t('figures.title') }}</h1>
        <p class="mt-3 max-w-2xl text-ink-soft">{{ i18n.t('figures.sub') }}</p>
      </div>
    </section>

    <section class="container py-10">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (f of figures(); track f.id) {
          <a [routerLink]="['/p', f.slug]" [appReveal]="$index * 60"
             class="group card flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-clay">
            <div class="relative w-32 shrink-0 overflow-hidden bg-sand-100">
              <app-smart-image class="h-full w-full transition-transform duration-700 group-hover:scale-105"
                [src]="f.image" [alt]="i18n.pick(f.name)" [label]="i18n.pick(f.name)" />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="chip self-start bg-clay/10 text-clay">{{ i18n.era(f.era) }}</span>
              <h3 class="mt-2 font-kufi text-lg font-bold leading-tight text-ink">{{ i18n.pick(f.name) }}</h3>
              <p class="mt-1 text-xs font-bold text-ink-faint">{{ i18n.pick(f.role) }}</p>
              <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{{ i18n.pick(f.summary) }}</p>
              <span class="mt-auto pt-3 text-xs font-bold tnum text-ink-faint">{{ i18n.pick(f.lifespan) }}</span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class Figures {
  readonly svc = inject(FiguresService);
  readonly i18n = inject(I18nService);
  figures() {
    return this.svc.all();
  }
}
