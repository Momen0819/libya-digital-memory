import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeritageService } from '../../core/services/heritage.service';
import { I18nService } from '../../core/services/i18n.service';
import { SmartImage } from '../../shared/components/smart-image';

@Component({
  selector: 'app-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SmartImage],
  template: `
    <section class="border-b border-ink/10 bg-sand-50/60">
      <div class="container py-12">
        <span class="eyebrow">{{ i18n.t('gallery.title') }}</span>
        <h1 class="mt-3 font-display text-3xl font-bold md:text-4xl">{{ i18n.t('gallery.title') }}</h1>
        <p class="mt-3 max-w-xl text-ink-soft">{{ i18n.t('gallery.sub') }}</p>
      </div>
    </section>

    <section class="container py-10">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        @for (m of items(); track m.key) {
          <a [routerLink]="['/m', m.slug]"
             class="group relative block overflow-hidden rounded-xl shadow-card"
             [class.row-span-2]="m.tall"
             [style.aspect-ratio]="m.tall ? '3 / 4' : '4 / 3'">
            <app-smart-image class="h-full w-full transition-transform duration-700 group-hover:scale-105"
              [src]="m.src" [alt]="m.name" [label]="m.name" />
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-80"></div>
            <div class="absolute inset-x-0 bottom-0 p-4">
              <div class="font-kufi text-sm font-bold text-sand-50">{{ m.name }}</div>
              <div class="mt-0.5 text-[11px] text-sand-50/70">{{ m.sub }}</div>
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class Gallery {
  readonly heritage = inject(HeritageService);
  readonly i18n = inject(I18nService);

  items() {
    return this.heritage.all().map((m, i) => ({
      key: m.id,
      slug: m.slug,
      src: m.image,
      name: this.i18n.pick(m.name),
      sub: `${this.i18n.era(m.era)} · ${this.i18n.pick(m.city)}`,
      tall: i % 5 === 0,
    }));
  }
}
