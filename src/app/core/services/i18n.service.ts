import { Injectable, computed, signal } from '@angular/core';
import { Lang, LocalizedText, Region, Era, MonumentType } from '../models/monument.model';
import { UI, REGION_LABEL, ERA_LABEL, TYPE_LABEL } from '../i18n/translations';

const STORAGE_KEY = 'ldm-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _lang = signal<Lang>(this.initial());
  readonly lang = this._lang.asReadonly();
  readonly dir = computed<'rtl' | 'ltr'>(() => (this._lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isRtl = computed(() => this._lang() === 'ar');

  constructor() {
    this.apply(this._lang());
  }

  private initial(): Lang {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar';
  }

  private apply(lang: Lang): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  setLang(lang: Lang): void {
    this._lang.set(lang);
    this.apply(lang);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
  }

  toggle(): void {
    this.setLang(this._lang() === 'ar' ? 'en' : 'ar');
  }

  /** ترجمة مفتاح من قاموس الواجهة */
  t(key: string): string {
    const entry = UI[key];
    return entry ? entry[this._lang()] : key;
  }

  /** اختيار النص المترجم من كائن LocalizedText */
  pick(text: LocalizedText | undefined): string {
    if (!text) return '';
    return text[this._lang()];
  }

  region(r: Region): string {
    return REGION_LABEL[r][this._lang()];
  }
  era(e: Era): string {
    return ERA_LABEL[e][this._lang()];
  }
  type(t: MonumentType): string {
    return TYPE_LABEL[t][this._lang()];
  }
}
