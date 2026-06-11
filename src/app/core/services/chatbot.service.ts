import { Injectable, inject } from '@angular/core';
import { HeritageService } from './heritage.service';
import { FiguresService } from './figures.service';
import { I18nService } from './i18n.service';
import { ERA_LABEL, REGION_LABEL, TYPE_LABEL } from '../i18n/translations';

export interface ChatLink {
  label: string;
  route: string[];
}
export interface ChatReply {
  text: string;
  links: ChatLink[];
}

interface Entity {
  kind: 'm' | 'f';
  slug: string;
  name: string;
  summary: string;
  hay: string;
  nameNorm: string;
}

/**
 * مساعد تراثي تجريبي — لكنه «يشتغل بجد»: يبحث في بيانات المعالم والشخصيات الحقيقية
 * ويرد بإجابات صحيحة وروابط مباشرة. بلا خادم أو نموذج لغوي (heuristic فقط).
 */
@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly heritage = inject(HeritageService);
  private readonly figures = inject(FiguresService);
  private readonly i18n = inject(I18nService);

  private norm(s: string): string {
    return (s || '')
      .toLowerCase()
      .replace(/[ً-ْٰ]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ـ/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private get ar(): boolean {
    return this.i18n.lang() === 'ar';
  }
  private bi(ar: string, en: string): string {
    return this.ar ? ar : en;
  }

  private entities(): Entity[] {
    const out: Entity[] = [];
    for (const m of this.heritage.all()) {
      const hay = this.norm(
        [
          m.name.ar, m.name.en, m.city.ar, m.city.en, m.summary.ar, m.summary.en,
          ERA_LABEL[m.era].ar, ERA_LABEL[m.era].en, TYPE_LABEL[m.type].ar, TYPE_LABEL[m.type].en,
          REGION_LABEL[m.region].ar, REGION_LABEL[m.region].en, m.unesco ? 'unesco يونسكو تراث عالمي' : '',
        ].join(' '),
      );
      out.push({ kind: 'm', slug: m.slug, name: this.i18n.pick(m.name), summary: this.i18n.pick(m.summary), hay, nameNorm: this.norm(`${m.name.ar} ${m.name.en}`) });
    }
    for (const f of this.figures.all()) {
      const hay = this.norm(
        [f.name.ar, f.name.en, f.role.ar, f.role.en, f.origin.ar, f.origin.en, f.summary.ar, f.summary.en, ERA_LABEL[f.era].ar, ERA_LABEL[f.era].en].join(' '),
      );
      out.push({ kind: 'f', slug: f.slug, name: this.i18n.pick(f.name), summary: `${this.i18n.pick(f.role)} — ${this.i18n.pick(f.summary)}`, hay, nameNorm: this.norm(`${f.name.ar} ${f.name.en}`) });
    }
    return out;
  }

  private link(e: Entity): ChatLink {
    return { label: e.name, route: [e.kind === 'm' ? '/m' : '/p', e.slug] };
  }

  greeting(): ChatReply {
    return {
      text: this.bi(
        'أهلاً بك في «ذاكرة ليبيا الرقمية» 👋 أنا مرشدك التراثي. اسألني عن أي معلم (لِبدة، صبراتة، غدامس…) أو شخصية (عمر المختار، سبتيموس سيفيروس…) أو جرّب: «أقدم مسجد» أو «معالم يونسكو».',
        'Welcome to Libyan Digital Memory 👋 I am your heritage guide. Ask me about any monument (Leptis, Sabratha, Ghadames…) or figure (Omar Mukhtar, Septimius Severus…), or try: “oldest mosque” or “UNESCO sites”.',
      ),
      links: [],
    };
  }

  suggestions(): string[] {
    return this.ar
      ? ['لِبدة الكبرى', 'معالم يونسكو', 'عمر المختار', 'أقدم مسجد', 'معالم الجنوب']
      : ['Leptis Magna', 'UNESCO sites', 'Omar Mukhtar', 'oldest mosque', 'southern sites'];
  }

  answer(raw: string): ChatReply {
    const q = this.norm(raw);
    const has = (...w: string[]) => w.some((x) => q.includes(this.norm(x)));
    if (!q) return this.greeting();

    if (has('سلام', 'مرحبا', 'اهلا', 'هاي', 'هلا', 'hi', 'hello', 'hey')) return this.greeting();
    if (has('شكر', 'متشكر', 'تسلم', 'thank', 'thx')) return { text: this.bi('العفو! 🌟 تحب تعرف عن معلم أو شخصية تانية؟', 'You are welcome! 🌟 Want to explore another monument or figure?'), links: [] };

    if (has('qr', 'رمز', 'كيف يعمل', 'ازاي', 'كيف', 'how does', 'how it works', 'مسح', 'scan'))
      return { text: this.bi('فكرة المشروع بسيطة: كل معلم له رمز QR مثبّت بجانبه؛ تمسحه بهاتفك فتُفتح صفحة المعلم فوراً بصورها وتاريخها وسردها الصوتي وخريطتها وفيديو وثائقي. جرّب أي معلم 👇', 'The idea is simple: each monument has a QR plaque beside it; scan it and the monument page opens instantly with photos, history, audio narration, a map and a documentary. Try any monument 👇'), links: this.heritage.featured().slice(0, 3).map((m) => ({ label: this.i18n.pick(m.name), route: ['/m', m.slug] })) };

    if (has('كام', 'عدد', 'how many', 'count')) {
      if (has('شخصي', 'figure', 'people')) return { text: this.bi(`القسم فيه ${this.figures.all().length} شخصيات ليبية بارزة.`, `The section features ${this.figures.all().length} notable Libyan figures.`), links: [{ label: this.bi('كل الشخصيات', 'All figures'), route: ['/figures'] }] };
      const s = this.heritage.stats();
      return { text: this.bi(`عندنا ${s.monuments} معلماً موثّقاً عبر ${s.eras} عصوراً في ${s.regions} مناطق، منها ${s.unesco} مواقع تراث عالمي.`, `We document ${s.monuments} monuments across ${s.eras} eras in ${s.regions} regions, including ${s.unesco} UNESCO World Heritage sites.`), links: [{ label: this.bi('فهرس المعالم', 'All monuments'), route: ['/monuments'] }] };
    }

    if (has('يونسكو', 'unesco', 'تراث عالمي', 'world heritage')) {
      const u = this.heritage.all().filter((m) => m.unesco);
      return { text: this.bi('مواقع التراث العالمي (يونسكو) في ليبيا:', 'Libya’s UNESCO World Heritage sites:'), links: u.map((m) => ({ label: this.i18n.pick(m.name), route: ['/m', m.slug] })) };
    }

    if (has('اقدم مسجد', 'oldest mosque')) {
      const m = this.heritage.bySlug('awjila-atiq-mosque');
      if (m) return { text: this.bi(`${this.i18n.pick(m.name)} — ${this.i18n.pick(m.summary)}`, `${this.i18n.pick(m.name)} — ${this.i18n.pick(m.summary)}`), links: [{ label: this.i18n.pick(m.name), route: ['/m', m.slug] }] };
    }

    // entity scoring
    const tokens = q.split(' ').filter((t) => t.length >= 3);
    const scored = this.entities()
      .map((e) => {
        let score = 0;
        if (e.nameNorm.includes(q) || (q.length >= 4 && q.includes(e.nameNorm.split(' ')[0]))) score += 4;
        for (const t of tokens) if (e.hay.includes(t)) score += 1;
        return { e, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return { text: this.bi('لم أعثر على ذلك تحديداً 🤔 جرّب اسم معلم أو شخصية، أو اختر من الاقتراحات. مثلاً: «صبراتة»، «إراتوستينس»، «معالم رومانية».', 'I could not find that exactly 🤔 Try a monument or figure name, or pick a suggestion. e.g. “Sabratha”, “Eratosthenes”, “Roman sites”.'), links: [{ label: this.bi('فهرس المعالم', 'Monuments'), route: ['/monuments'] }, { label: this.bi('الشخصيات', 'Figures'), route: ['/figures'] }] };
    }

    if (scored[0].score >= 4 || scored.length === 1) {
      const e = scored[0].e;
      return { text: `${e.name} — ${e.summary}`, links: [this.link(e), ...scored.slice(1, 3).map((s) => this.link(s.e))] };
    }
    return { text: this.bi('وجدت لك هذه النتائج:', 'Here is what I found:'), links: scored.slice(0, 6).map((s) => this.link(s.e)) };
  }
}
