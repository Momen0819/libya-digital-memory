import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { ChatbotService, ChatLink } from '../../core/services/chatbot.service';
import { BrandMark } from './brand-mark';

interface Msg {
  role: 'user' | 'bot';
  text: string;
  links: ChatLink[];
}

/** مساعد تراثي عائم (عرض تجريبي يعمل فعلياً على البيانات المحلية). */
@Component({
  selector: 'app-chat-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BrandMark],
  template: `
    <!-- PANEL -->
    @if (open()) {
      <div class="fixed bottom-5 z-[60] flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl bg-parchment shadow-lift ring-1 ring-ink/15"
           style="inset-inline-end:1.25rem; max-height:min(70vh,560px)">
        <!-- header -->
        <div class="flex items-center gap-3 bg-teal px-4 py-3 text-sand-50">
          <app-brand-mark class="h-8 w-8 shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="font-kufi text-sm font-bold">{{ i18n.t('chat.title') }}</span>
              <span class="rounded-full bg-gold/90 px-1.5 py-0.5 text-[10px] font-bold text-ink">{{ i18n.t('chat.demo') }}</span>
            </div>
            <div class="truncate text-[11px] text-sand-50/75">{{ i18n.t('chat.subtitle') }}</div>
          </div>
          <button (click)="open.set(false)" [attr.aria-label]="i18n.t('chat.close')"
                  class="grid h-9 w-9 place-items-center rounded-full text-sand-50/85 transition-colors hover:bg-sand-50/15 hover:text-sand-50">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- messages -->
        <div #scroll role="log" aria-live="polite" class="flex-1 space-y-3 overflow-y-auto bg-arabesque px-4 py-4">
          @for (m of messages(); track $index) {
            <div class="flex flex-col" [class.items-start]="m.role === 'bot'" [class.items-end]="m.role === 'user'">
              <div class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                   [class]="m.role === 'user' ? 'bg-clay text-sand-50 rounded-ee-sm' : 'bg-sand-50 text-ink shadow-card ring-1 ring-ink/5 rounded-es-sm'">
                {{ m.text }}
              </div>
              @if (m.links.length) {
                <div class="mt-2 flex max-w-[90%] flex-wrap gap-1.5">
                  @for (l of m.links; track l.route.join('/')) {
                    <a [routerLink]="l.route" (click)="onNavigate()"
                       class="inline-flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-bold text-teal transition-colors hover:bg-teal/20">
                      {{ l.label }}
                      <svg class="h-3 w-3 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </a>
                  }
                </div>
              }
            </div>
          }
          @if (typing()) {
            <div class="flex items-center gap-1.5 rounded-2xl bg-sand-50 px-3.5 py-3 text-ink shadow-card ring-1 ring-ink/5 w-fit rounded-es-sm">
              <span class="dot"></span><span class="dot" style="animation-delay:.15s"></span><span class="dot" style="animation-delay:.3s"></span>
            </div>
          }
        </div>

        <!-- suggestions -->
        @if (messages().length <= 1) {
          <div class="flex flex-wrap gap-1.5 border-t border-ink/8 bg-sand-50/60 px-3 py-2.5">
            @for (s of chatbot.suggestions(); track s) {
              <button (click)="send(s)" class="rounded-full border border-ink/12 bg-parchment px-3 py-1.5 text-xs font-bold text-ink-soft transition-colors hover:border-clay hover:text-clay">{{ s }}</button>
            }
          </div>
        }

        <!-- input -->
        <form (submit)="$event.preventDefault(); send()" class="flex items-center gap-2 border-t border-ink/10 bg-parchment p-2.5">
          <input #box [value]="draft()" (input)="draft.set($any($event.target).value)"
                 [placeholder]="i18n.t('chat.placeholder')" [attr.aria-label]="i18n.t('chat.title')"
                 class="min-h-[44px] flex-1 rounded-full border border-ink/12 bg-sand-50 px-4 text-sm outline-none transition-colors focus:border-clay" />
          <button type="submit" [disabled]="!draft().trim() || typing()" [attr.aria-label]="i18n.t('chat.send')"
                  class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay text-sand-50 transition-all hover:bg-clay-dark disabled:opacity-40">
            <svg class="h-5 w-5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.5-7.5a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.39 1.2L4 11l8 1-8 1-1.99 6.2a1 1 0 0 0 1.39 1.2z"/></svg>
          </button>
        </form>
      </div>
    }

    <!-- FAB -->
    <button (click)="toggle()" [attr.aria-label]="i18n.t('chat.open')"
            class="fixed bottom-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-clay text-sand-50 shadow-lift ring-2 ring-parchment transition-transform hover:scale-105 active:scale-95"
            style="inset-inline-end:1.25rem" [class.hidden]="open()">
      <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5A8.5 8.5 0 1 1 21 11.5z" stroke-linejoin="round"/><path d="M8.5 11.5h7M8.5 8.5h7M8.5 14.5h4" stroke-linecap="round"/></svg>
      <span class="absolute -top-0.5 inset-inline-end-0 h-3 w-3 rounded-full bg-gold ring-2 ring-parchment"></span>
    </button>
  `,
  styles: [`
    .dot { width:7px; height:7px; border-radius:9999px; background:#8A8273; display:inline-block; animation:cdot 1s infinite ease-in-out; }
    @keyframes cdot { 0%,80%,100%{ transform:translateY(0); opacity:.4 } 40%{ transform:translateY(-4px); opacity:1 } }
    @media (prefers-reduced-motion: reduce){ .dot{ animation:none } }
  `],
})
export class ChatWidget {
  readonly i18n = inject(I18nService);
  readonly chatbot = inject(ChatbotService);
  private readonly scrollRef = viewChild<ElementRef<HTMLDivElement>>('scroll');

  readonly open = signal(false);
  readonly messages = signal<Msg[]>([]);
  readonly typing = signal(false);
  readonly draft = signal('');

  toggle(): void {
    this.open.update((v) => !v);
    if (this.open() && this.messages().length === 0) {
      const g = this.chatbot.greeting();
      this.messages.set([{ role: 'bot', text: g.text, links: g.links }]);
    }
  }

  onNavigate(): void {
    if (window.matchMedia('(max-width: 640px)').matches) this.open.set(false);
  }

  send(text?: string): void {
    const t = (text ?? this.draft()).trim();
    if (!t || this.typing()) return;
    this.messages.update((m) => [...m, { role: 'user', text: t, links: [] }]);
    this.draft.set('');
    this.typing.set(true);
    this.scrollToBottom();
    window.setTimeout(() => {
      const r = this.chatbot.answer(t);
      this.messages.update((m) => [...m, { role: 'bot', text: r.text, links: r.links }]);
      this.typing.set(false);
      this.scrollToBottom();
    }, 700);
  }

  private scrollToBottom(): void {
    window.setTimeout(() => {
      const el = this.scrollRef()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 40);
  }
}
