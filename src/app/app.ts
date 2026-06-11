import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './shared/components/site-header';
import { SiteFooter } from './shared/components/site-footer';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ضمان تهيئة اللغة والاتجاه عند الإقلاع
  protected readonly i18n = inject(I18nService);
}
