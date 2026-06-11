import { Injectable } from '@angular/core';
import { toDataURL } from 'qrcode';

@Injectable({ providedIn: 'root' })
export class QrService {
  /** يبني رابطاً مطلقاً لصفحة المعلم (نفس ما يُشفّر في لوحة QR الميدانية).
   *  يعتمد على baseURI ليعمل بشكل صحيح محلياً وعلى GitHub Pages (مسار فرعي). */
  publicUrl(slug: string): string {
    const base =
      typeof document !== 'undefined' && document.baseURI
        ? document.baseURI.replace(/\/$/, '')
        : typeof location !== 'undefined'
          ? location.origin
          : 'https://memory.ly';
    return `${base}/m/${slug}`;
  }

  async toDataUrl(text: string): Promise<string> {
    return toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: { dark: '#221C14', light: '#FBF7EF' },
    });
  }
}
