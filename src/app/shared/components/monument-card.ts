import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Monument } from '../../core/models/monument.model';
import { I18nService } from '../../core/services/i18n.service';
import { SmartImage } from './smart-image';

@Component({
  selector: 'app-monument-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SmartImage],
  template: `
    <a
      [routerLink]="['/m', m().slug]"
      class="group card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-clay">
      <div class="relative aspect-[4/3] overflow-hidden">
        <app-smart-image
          class="h-full w-full transition-transform duration-700 group-hover:scale-105"
          [src]="m().image"
          [alt]="i18n.pick(m().name)"
          [label]="i18n.pick(m().name)" />
        <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/55 to-transparent"></div>
        @if (m().unesco) {
          <span class="chip absolute top-3 bg-gold text-ink shadow-sm" [style.inset-inline-start.px]="12">
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z"/></svg>
            {{ i18n.t('detail.unesco') }}
          </span>
        }
        <span class="chip absolute bottom-3 bg-sand-50/90 text-ink backdrop-blur" [style.inset-inline-start.px]="12">
          {{ i18n.region(m().region) }}
        </span>
      </div>

      <div class="flex flex-1 flex-col p-5">
        <div class="mb-2 flex items-center gap-2 text-xs font-semibold text-ink-faint">
          <span class="inline-block h-1.5 w-1.5 rounded-full" [style.background]="dot()"></span>
          {{ i18n.era(m().era) }} · {{ i18n.pick(m().city) }}
        </div>
        <h3 class="font-kufi text-xl font-bold text-ink">{{ i18n.pick(m().name) }}</h3>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{{ i18n.pick(m().summary) }}</p>
        <div class="mt-4 flex items-center gap-1.5 text-sm font-bold text-clay">
          {{ i18n.t('cta.details') }}
          <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </a>
  `,
})
export class MonumentCard {
  readonly i18n = inject(I18nService);
  readonly m = input.required<Monument>();

  dot(): string {
    const a = this.m().accent;
    return a === 'clay' ? '#A8472A' : a === 'teal' ? '#14564E' : '#C2A14D';
  }
}
