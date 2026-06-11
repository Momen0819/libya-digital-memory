import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * يكشف العنصر بانسياب لطيف عند دخوله نطاق الرؤية (fade + rise)، مع تأخير اختياري
 * للحصول على ظهور متتابع (stagger) لعناصر الشبكة. يحترم تفضيل تقليل الحركة.
 *
 * الاستخدام: <app-monument-card [appReveal]="$index * 70" />  (التأخير بالملّي ثانية)
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class Reveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  /** تأخير الظهور بالملّي ثانية (للتتابع عبر الفهرس). */
  readonly delay = input(0, { alias: 'appReveal' });

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      node.style.opacity = '0';
      node.style.transform = 'translateY(16px)';
      node.style.transition =
        'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)';
      node.style.willChange = 'opacity, transform';

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            window.setTimeout(() => {
              node.style.opacity = '1';
              node.style.transform = 'none';
              node.style.willChange = 'auto';
            }, Number(this.delay()) || 0);
            io.unobserve(node);
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(node);
    });
  }
}
