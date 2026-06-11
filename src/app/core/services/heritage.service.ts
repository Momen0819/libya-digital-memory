import { Injectable } from '@angular/core';
import { Monument, Region, Era } from '../models/monument.model';
import { MONUMENTS } from '../data/monuments.data';

export interface HeritageStats {
  monuments: number;
  regions: number;
  unesco: number;
  eras: number;
}

export interface MonumentFilter {
  query?: string;
  region?: Region | 'all';
  era?: Era | 'all';
}

@Injectable({ providedIn: 'root' })
export class HeritageService {
  private readonly data = MONUMENTS;

  all(): Monument[] {
    return this.data;
  }

  featured(): Monument[] {
    return this.data.filter((m) => m.featured);
  }

  bySlug(slug: string): Monument | undefined {
    return this.data.find((m) => m.slug === slug);
  }

  byRegion(region: Region): Monument[] {
    return this.data.filter((m) => m.region === region);
  }

  related(monument: Monument, limit = 3): Monument[] {
    return this.data
      .filter((m) => m.id !== monument.id)
      .map((m) => ({
        m,
        score: (m.region === monument.region ? 2 : 0) + (m.era === monument.era ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.m);
  }

  filter(f: MonumentFilter): Monument[] {
    const q = (f.query ?? '').trim().toLowerCase();
    return this.data.filter((m) => {
      if (f.region && f.region !== 'all' && m.region !== f.region) return false;
      if (f.era && f.era !== 'all' && m.era !== f.era) return false;
      if (q) {
        const hay = `${m.name.ar} ${m.name.en} ${m.city.ar} ${m.city.en} ${m.summary.ar} ${m.summary.en}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  stats(): HeritageStats {
    return {
      monuments: this.data.length,
      regions: new Set(this.data.map((m) => m.region)).size,
      unesco: this.data.filter((m) => m.unesco).length,
      eras: new Set(this.data.map((m) => m.era)).size,
    };
  }

  regions(): Region[] {
    return ['west', 'east', 'south'];
  }

  eras(): Era[] {
    return Array.from(new Set(this.data.map((m) => m.era)));
  }
}
