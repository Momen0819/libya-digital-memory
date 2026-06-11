import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeritageService } from '../../core/services/heritage.service';
import { I18nService } from '../../core/services/i18n.service';
import { MonumentCard } from '../../shared/components/monument-card';
import { Reveal } from '../../shared/components/reveal';
import { Era, Region } from '../../core/models/monument.model';

@Component({
  selector: 'app-monuments',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MonumentCard, Reveal],
  template: `
    <section class="border-b border-ink/10 bg-sand-50/60">
      <div class="container py-12">
        <span class="eyebrow">{{ i18n.t('nav.monuments') }}</span>
        <h1 class="mt-3 font-display text-3xl font-bold md:text-4xl">{{ i18n.t('section.featuredSub') }}</h1>
      </div>
    </section>

    <section class="container py-10">
      <!-- filter bar -->
      <div class="card mb-8 flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <div class="relative flex-1">
          <svg class="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" style="inset-inline-start:0.9rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
          <input
            type="search"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            [placeholder]="i18n.t('filter.search')"
            class="w-full rounded-full border border-ink/12 bg-parchment py-2.5 ps-10 pe-4 text-sm outline-none transition-colors focus:border-clay" />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-ink-faint">{{ i18n.t('filter.region') }}:</span>
          <button (click)="region.set('all')" [class]="pill(region() === 'all')">{{ i18n.t('filter.all') }}</button>
          @for (r of heritage.regions(); track r) {
            <button (click)="region.set(r)" [class]="pill(region() === r)">{{ i18n.region(r) }}</button>
          }
        </div>
      </div>

      <div class="mb-6 flex flex-wrap items-center gap-2">
        <span class="text-xs font-bold text-ink-faint">{{ i18n.t('filter.era') }}:</span>
        <button (click)="era.set('all')" [class]="pill(era() === 'all')">{{ i18n.t('filter.all') }}</button>
        @for (e of heritage.eras(); track e) {
          <button (click)="era.set(e)" [class]="pill(era() === e)">{{ i18n.era(e) }}</button>
        }
        <span class="ms-auto text-sm font-bold text-ink-soft">{{ results().length }} {{ i18n.t('filter.results') }}</span>
      </div>

      @if (results().length) {
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (m of results(); track m.id) {
            <app-monument-card [m]="m" [appReveal]="$index * 55" />
          }
        </div>
      } @else {
        <div class="card flex flex-col items-center gap-3 py-20 text-center">
          <svg class="h-10 w-10 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
          <p class="text-ink-soft">{{ i18n.t('filter.empty') }}</p>
        </div>
      }
    </section>
  `,
})
export class Monuments {
  readonly heritage = inject(HeritageService);
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly qp = toSignal(this.route.queryParamMap, { initialValue: null });

  readonly query = signal('');
  readonly region = signal<Region | 'all'>('all');
  readonly era = signal<Era | 'all'>('all');
  private synced = false;

  constructor() {
    // مزامنة المنطقة من رابط الاستعلام (?region=) عند أول قيمة متاحة
    effect(() => {
      const param = this.qp()?.get('region') as Region | null;
      if (!this.synced && param) {
        this.region.set(param);
        this.synced = true;
      }
    });
  }

  readonly results = computed(() =>
    this.heritage.filter({ query: this.query(), region: this.region(), era: this.era() }),
  );

  pill(active: boolean): string {
    const base = 'inline-flex min-h-[40px] items-center rounded-full px-4 py-2 text-sm font-bold transition-colors';
    return active
      ? `${base} bg-clay text-sand-50 shadow-card`
      : `${base} border border-ink/12 text-ink-soft hover:border-ink/30 hover:text-ink`;
  }
}
