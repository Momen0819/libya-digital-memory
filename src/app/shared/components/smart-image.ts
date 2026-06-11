import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/**
 * صورة مع لوحة بديلة بهوية المشروع عند تعذّر التحميل،
 * فلا تظهر صورة مكسورة أبداً. تُستخدم لصور Wikimedia.
 */
@Component({
  selector: 'app-smart-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!failed()) {
      <img
        [src]="src()"
        [alt]="alt()"
        loading="lazy"
        decoding="async"
        (error)="failed.set(true)"
        (load)="loaded.set(true)"
        class="h-full w-full object-cover transition-opacity duration-700"
        [class.opacity-0]="!loaded()"
        [class.opacity-100]="loaded()" />
    }
    @if (failed() || !loaded()) {
      <div class="plate absolute inset-0" [class.opacity-0]="loaded() && !failed()">
        <div class="relative z-10 px-5 text-center">
          <svg class="mx-auto mb-3 h-7 w-7 text-gold/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="font-kufi text-base font-semibold leading-snug text-sand-50/95">{{ label() }}</div>
        </div>
      </div>
    }
  `,
  host: { class: 'relative block h-full w-full overflow-hidden bg-teal' },
})
export class SmartImage {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly label = input('');
  readonly failed = signal(false);
  readonly loaded = signal(false);
}
