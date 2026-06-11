import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { HeritageService } from '../../core/services/heritage.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-map-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="border-b border-ink/10 bg-sand-50/60">
      <div class="container py-12">
        <span class="eyebrow">{{ i18n.t('nav.map') }}</span>
        <h1 class="mt-3 font-display text-3xl font-bold md:text-4xl">{{ i18n.t('map.title') }}</h1>
        <p class="mt-3 max-w-2xl text-ink-soft">{{ i18n.t('map.sub') }}</p>
      </div>
    </section>

    <section class="container py-10">
      <div #map class="h-[68vh] w-full overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/10"></div>
      <div class="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        @for (r of legend(); track r.region) {
          <span class="inline-flex items-center gap-2">
            <span class="h-3 w-3 rounded-full" [style.background]="r.color"></span>{{ i18n.region(r.region) }}
          </span>
        }
      </div>
    </section>
  `,
})
export class MapPage implements AfterViewInit, OnDestroy {
  readonly heritage = inject(HeritageService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private map?: L.Map;

  private readonly colors: Record<string, string> = {
    west: '#A8472A',
    east: '#C2A14D',
    south: '#14564E',
  };

  ngAfterViewInit(): void {
    const map = L.map(this.mapEl().nativeElement, {
      center: [27.5, 17.5],
      zoom: 5,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    this.map = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    for (const m of this.heritage.all()) {
      const color = this.colors[m.region];
      const icon = L.divIcon({
        className: 'ldm-pin',
        html: `<span style="display:block;width:18px;height:18px;border-radius:50%;background:${color};box-shadow:0 0 0 4px ${color}33,0 2px 6px rgba(0,0,0,.4);border:2px solid #FAF5EC"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([m.coords.lat, m.coords.lng], { icon, title: this.i18n.pick(m.name) }).addTo(map);
      const name = this.i18n.pick(m.name);
      const city = this.i18n.pick(m.city);
      const cta = this.i18n.t('cta.details');
      marker.bindPopup(
        `<div style="font-family:Tajawal,sans-serif;text-align:center;min-width:140px">
           <strong style="font-size:14px;color:#221C14">${name}</strong>
           <div style="font-size:11px;color:#8A8273;margin:2px 0 8px">${city}</div>
           <button data-slug="${m.slug}" style="background:#A8472A;color:#FBF7EF;border:0;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer">${cta}</button>
         </div>`,
      );
    }

    map.on('popupopen', (e: L.PopupEvent) => {
      const btn = e.popup.getElement()?.querySelector('button[data-slug]') as HTMLButtonElement | null;
      btn?.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        if (slug) this.router.navigate(['/m', slug]);
      });
    });
  }

  legend() {
    return this.heritage.regions().map((region) => ({ region, color: this.colors[region] }));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
