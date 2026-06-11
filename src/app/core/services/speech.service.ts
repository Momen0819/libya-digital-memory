import { Injectable, signal } from '@angular/core';
import { Lang } from '../models/monument.model';

/**
 * سرد صوتي حقيقي عبر Web Speech API — يقرأ النبذة التاريخية بصوت المتصفّح
 * دون الحاجة لاستضافة ملفات صوتية. (يعمل في متصفّح المستخدم)
 */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  readonly speaking = signal(false);
  readonly supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  speak(text: string, lang: Lang): void {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    u.rate = lang === 'ar' ? 0.92 : 1;
    u.pitch = 1;
    u.onend = () => this.speaking.set(false);
    u.onerror = () => this.speaking.set(false);
    this.speaking.set(true);
    window.speechSynthesis.speak(u);
  }

  stop(): void {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    this.speaking.set(false);
  }

  toggle(text: string, lang: Lang): void {
    if (this.speaking()) this.stop();
    else this.speak(text, lang);
  }
}
