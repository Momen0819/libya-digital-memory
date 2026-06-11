export type Lang = 'ar' | 'en';

export type Region = 'west' | 'east' | 'south';

export type Era =
  | 'prehistoric'
  | 'phoenician'
  | 'greek'
  | 'roman'
  | 'byzantine'
  | 'islamic'
  | 'ottoman';

export type MonumentType =
  | 'archaeological-city'
  | 'monument'
  | 'fortress'
  | 'mosque'
  | 'rock-art'
  | 'old-town';

export type Accent = 'clay' | 'teal' | 'gold';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Fact {
  label: LocalizedText;
  value: LocalizedText;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface Monument {
  id: string;
  slug: string;
  name: LocalizedText;
  region: Region;
  city: LocalizedText;
  era: Era;
  type: MonumentType;
  yearLabel: LocalizedText;
  unesco: boolean;
  coords: { lat: number; lng: number };
  summary: LocalizedText;
  history: LocalizedText;
  facts: Fact[];
  image: string;
  gallery: string[];
  imageCredit: string;
  sources: SourceLink[];
  featured: boolean;
  accent: Accent;
}
