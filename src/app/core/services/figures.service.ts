import { Injectable } from '@angular/core';
import { Figure } from '../models/figure.model';
import { FIGURES } from '../data/figures.data';

@Injectable({ providedIn: 'root' })
export class FiguresService {
  private readonly data = FIGURES;

  all(): Figure[] {
    return this.data;
  }

  featured(): Figure[] {
    return this.data.filter((f) => f.featured);
  }

  bySlug(slug: string): Figure | undefined {
    return this.data.find((f) => f.slug === slug);
  }

  related(figure: Figure, limit = 3): Figure[] {
    return this.data
      .filter((f) => f.id !== figure.id)
      .map((f) => ({ f, score: (f.era === figure.era ? 2 : 0) + (f.origin.en === figure.origin.en ? 1 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.f);
  }
}
