import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Era } from '../../core/models/monument.model';
import { HeritageService } from '../../core/services/heritage.service';
import { I18nService } from '../../core/services/i18n.service';
import { QrService } from '../../core/services/qr.service';
import { SpeechService } from '../../core/services/speech.service';
import { MonumentCard } from '../../shared/components/monument-card';
import { SmartImage } from '../../shared/components/smart-image';
import { Reveal } from '../../shared/components/reveal';

@Component({
  selector: 'app-monument-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MonumentCard, SmartImage, Reveal],
  template: `
    @if (monument(); as m) {
      <!-- HERO -->
      <section class="relative">
        <div class="absolute inset-0">
          <app-smart-image class="h-full w-full" [src]="activeImage()" [alt]="i18n.pick(m.name)" [label]="i18n.pick(m.name)" />
          <div class="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/55 to-ink/35"></div>
        </div>
        <div class="container relative pt-8 pb-12">
          <a routerLink="/monuments" class="inline-flex items-center gap-1.5 text-sm font-bold text-sand-50/80 hover:text-sand-50">
            <svg class="h-4 w-4 ltr:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ i18n.t('cta.back') }}
          </a>

          <div class="mt-20 flex flex-wrap items-center gap-2">
            @if (m.unesco) {
              <span class="chip bg-gold text-ink"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z"/></svg>{{ i18n.t('detail.unesco') }}</span>
            }
            <span class="chip bg-sand-50/90 text-ink">{{ i18n.region(m.region) }}</span>
            <span class="chip bg-sand-50/90 text-ink">{{ i18n.era(m.era) }}</span>
            <span class="chip bg-sand-50/90 text-ink">{{ i18n.type(m.type) }}</span>
          </div>
          <h1 class="mt-3 font-display text-4xl font-bold text-sand-50 md:text-5xl">{{ i18n.pick(m.name) }}</h1>
          <p class="mt-2 max-w-2xl text-lg text-sand-50/85">{{ i18n.pick(m.summary) }}</p>
        </div>
      </section>

      <!-- ERA TIMELINE — situates the monument within Libya's layered history -->
      <section class="border-b border-ink/10 bg-sand-50/55">
        <div class="container flex items-center gap-2 overflow-x-auto py-4 text-xs">
          <span class="shrink-0 font-bold uppercase tracking-[0.14em] text-clay">{{ i18n.t('detail.timeline') }}</span>
          <span class="mx-1 h-4 w-px shrink-0 bg-ink/15"></span>
          @for (e of eraTimeline(); track e.key; let last = $last) {
            <span
              class="shrink-0 rounded-full px-3 py-1 font-bold transition-colors"
              [class]="e.active ? 'bg-clay text-sand-50 shadow-card' : 'text-ink-faint'">
              {{ i18n.era(e.key) }}
            </span>
            @if (!last) {
              <span class="h-px w-4 shrink-0 bg-ink/20"></span>
            }
          }
        </div>
      </section>

      <section class="container grid gap-10 py-12 lg:grid-cols-[1.7fr_1fr]">
        <!-- MAIN -->
        <div class="space-y-12">
          <!-- HISTORY + LISTEN -->
          <div>
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class="font-display text-2xl font-bold">{{ i18n.t('detail.about') }}</h2>
              @if (speech.supported) {
                <button (click)="toggleListen(m)" class="btn-teal px-4 py-2">
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
            <p class="max-w-[70ch] text-lg leading-loose text-ink-soft">{{ i18n.pick(m.history) }}</p>
          </div>

          <!-- GALLERY -->
          <div>
            <h2 class="mb-4 font-display text-2xl font-bold">{{ i18n.t('detail.gallery') }}</h2>
            <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
              @for (g of m.gallery; track $index) {
                <button (click)="activeImage.set(g)"
                  class="group relative aspect-square overflow-hidden rounded-lg ring-2 transition hover:ring-clay/50"
                  [class.ring-clay]="activeImage() === g"
                  [class.ring-transparent]="activeImage() !== g">
                  <app-smart-image class="h-full w-full transition-transform duration-500 group-hover:scale-110" [src]="g" [alt]="i18n.pick(m.name)" [label]="i18n.pick(m.name)" />
                </button>
              }
            </div>
          </div>

          <!-- VIDEO -->
          <div>
            <h2 class="mb-4 font-display text-2xl font-bold">{{ i18n.t('detail.video') }}</h2>
            @if (m.videoId) {
              <div class="overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/10">
                <iframe class="aspect-video w-full border-0" [src]="youtubeEmbed(m.videoId)"
                  [title]="i18n.pick(m.name)" loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            } @else {
              <a [href]="youtubeUrl(m.name.en)" target="_blank" rel="noopener"
                 class="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl">
                <app-smart-image class="absolute inset-0 h-full w-full" [src]="m.image" [alt]="i18n.pick(m.name)" [label]="i18n.pick(m.name)" />
                <div class="absolute inset-0 bg-ink/55 transition group-hover:bg-ink/45"></div>
                <div class="relative flex flex-col items-center gap-3 text-sand-50">
                  <span class="flex h-16 w-16 items-center justify-center rounded-full bg-clay shadow-lift transition group-hover:scale-110">
                    <svg class="h-7 w-7 ltr:rotate-0 rtl:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </span>
                  <span class="text-sm font-bold">{{ i18n.t('detail.watch') }}</span>
                </div>
              </a>
            }
          </div>

          <!-- LOCATION + 360° -->
          <div>
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class="font-display text-2xl font-bold">{{ i18n.t('detail.location') }}</h2>
              <div class="inline-flex rounded-full bg-ink/[0.06] p-1 text-xs font-bold">
                <button (click)="locView.set('map')" class="rounded-full px-3.5 py-1.5 transition-colors"
                  [class]="locView() === 'map' ? 'bg-clay text-sand-50' : 'text-ink-soft hover:text-ink'">{{ i18n.t('detail.mapView') }}</button>
                <button (click)="locView.set('pano')" class="rounded-full px-3.5 py-1.5 transition-colors"
                  [class]="locView() === 'pano' ? 'bg-clay text-sand-50' : 'text-ink-soft hover:text-ink'">{{ i18n.t('detail.streetview') }}</button>
              </div>
            </div>
            <div class="overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/10">
              @if (locView() === 'map') {
                <iframe [src]="mapEmbed(m.coords.lat, m.coords.lng)" class="h-72 w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              } @else {
                <iframe [src]="panoEmbed(m.coords.lat, m.coords.lng)" class="h-72 w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              }
            </div>
            <div class="mt-3 flex flex-wrap gap-3">
              <a [href]="mapsLink(m.coords.lat, m.coords.lng)" target="_blank" rel="noopener" class="btn-ghost px-4 py-2">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                {{ i18n.t('detail.maps') }}
              </a>
              <a [href]="streetView(m.coords.lat, m.coords.lng)" target="_blank" rel="noopener" class="btn-ghost px-4 py-2">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18"/></svg>
                {{ i18n.t('detail.streetview') }}
              </a>
            </div>
          </div>
        </div>

        <!-- SIDEBAR -->
        <aside class="space-y-5">
          <!-- QR CARD -->
          <div class="card p-6 text-center">
            <div class="text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('detail.qr') }}</div>
            <div class="mx-auto mt-4 w-44 rounded-xl bg-parchment p-3 ring-1 ring-ink/10">
              @if (qr(); as q) {
                <img [src]="q" [alt]="'QR ' + i18n.pick(m.name)" class="h-full w-full" />
              } @else {
                <div class="aspect-square w-full animate-pulse rounded bg-ink/5"></div>
              }
            </div>
            <p class="mt-3 text-xs text-ink-faint">{{ i18n.t('cta.scan') }}</p>
            <code class="mt-1 block ltr truncate text-[11px] text-ink-faint">{{ publicUrl(m.slug) }}</code>
            <button (click)="share(m)" class="btn-primary mt-4 w-full justify-center py-2.5">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
              {{ shared() ? '✓' : i18n.t('detail.share') }}
            </button>
          </div>

          <!-- FACT SHEET -->
          <div class="card p-6">
            <div class="mb-3 text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('detail.facts') }}</div>
            <dl class="divide-y divide-ink/8">
              <div class="flex items-center justify-between py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('filter.era') }}</dt>
                <dd class="font-bold">{{ i18n.pick(m.yearLabel) }}</dd>
              </div>
              @for (f of m.facts; track $index) {
                <div class="flex items-center justify-between py-2.5 text-sm">
                  <dt class="text-ink-faint">{{ i18n.pick(f.label) }}</dt>
                  <dd class="font-bold">{{ i18n.pick(f.value) }}</dd>
                </div>
              }
              <div class="flex items-center justify-between py-2.5 text-sm">
                <dt class="text-ink-faint">{{ i18n.t('detail.location') }}</dt>
                <dd class="ltr tnum font-bold">{{ m.coords.lat.toFixed(3) }}, {{ m.coords.lng.toFixed(3) }}</dd>
              </div>
            </dl>
          </div>

          <!-- SOURCES -->
          <div class="card p-6">
            <div class="mb-3 text-xs font-bold uppercase tracking-wide text-clay">{{ i18n.t('detail.sources') }}</div>
            <ul class="space-y-2">
              @for (s of m.sources; track s.url) {
                <li>
                  <a [href]="s.url" target="_blank" rel="noopener" class="flex items-center gap-2 text-sm font-bold text-teal hover:underline">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
                    {{ s.label }}
                  </a>
                </li>
              }
              <li class="pt-1 text-[11px] text-ink-faint">{{ m.imageCredit }} · {{ i18n.t('footer.images') }}</li>
            </ul>
          </div>
        </aside>
      </section>

      <!-- RELATED -->
      <section class="container pb-8">
        <h2 class="mb-6 font-display text-2xl font-bold">{{ i18n.t('detail.related') }}</h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (r of related(); track r.id) {
            <app-monument-card [m]="r" [appReveal]="$index * 70" />
          }
        </div>
      </section>
    } @else {
      <section class="container flex flex-col items-center gap-4 py-32 text-center">
        <h1 class="font-display text-3xl font-bold">404</h1>
        <p class="text-ink-soft">{{ i18n.t('filter.empty') }}</p>
        <a routerLink="/monuments" class="btn-primary px-6 py-3">{{ i18n.t('cta.viewAll') }}</a>
      </section>
    }
  `,
})
export class MonumentDetail {
  readonly heritage = inject(HeritageService);
  readonly i18n = inject(I18nService);
  readonly speech = inject(SpeechService);
  private readonly qrSvc = inject(QrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly params = toSignal(this.route.paramMap, { initialValue: null });

  readonly monument = computed(() => {
    const slug = this.params()?.get('slug');
    return slug ? this.heritage.bySlug(slug) : undefined;
  });

  readonly related = computed(() => {
    const m = this.monument();
    return m ? this.heritage.related(m) : [];
  });

  readonly activeImage = signal('');
  readonly qr = signal<string | null>(null);
  readonly shared = signal(false);
  readonly locView = signal<'map' | 'pano'>('map');

  // Chronological backbone of Libyan heritage; the monument's own era is highlighted.
  private readonly eraOrder: Era[] = [
    'prehistoric',
    'phoenician',
    'greek',
    'roman',
    'byzantine',
    'islamic',
    'ottoman',
  ];

  eraTimeline(): { key: Era; active: boolean }[] {
    const era = this.monument()?.era;
    return this.eraOrder.map((key) => ({ key, active: key === era }));
  }

  constructor() {
    // عند تغيّر المعلم: ضبط الصورة النشطة، توليد QR، وإيقاف أي سرد سابق
    effect(() => {
      const m = this.monument();
      this.speech.stop();
      this.shared.set(false);
      if (m) {
        this.activeImage.set(m.image);
        this.qr.set(null);
        this.qrSvc.toDataUrl(this.qrSvc.publicUrl(m.slug)).then((url) => this.qr.set(url));
      }
    });
  }

  toggleListen(m: ReturnType<HeritageService['bySlug']>): void {
    if (!m) return;
    this.speech.toggle(this.i18n.pick(m.history), this.i18n.lang());
  }

  publicUrl(slug: string): string {
    return this.qrSvc.publicUrl(slug);
  }

  mapEmbed(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  youtubeEmbed(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${id}`);
  }

  // Keyless embedded Street View; shows Google's own panel where no imagery exists.
  panoEmbed(lat: number, lng: number): SafeResourceUrl {
    const url = `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  mapsLink(lat: number, lng: number): string {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  streetView(lat: number, lng: number): string {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }

  youtubeUrl(q: string): string {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' Libya history documentary')}`;
  }

  async share(m: ReturnType<HeritageService['bySlug']>): Promise<void> {
    if (!m) return;
    const url = this.qrSvc.publicUrl(m.slug);
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    try {
      if (nav.share) {
        await nav.share({ title: this.i18n.pick(m.name), url });
      } else {
        await navigator.clipboard.writeText(url);
        this.shared.set(true);
        setTimeout(() => this.shared.set(false), 2000);
      }
    } catch {
      /* تجاهل إلغاء المشاركة */
    }
  }
}
