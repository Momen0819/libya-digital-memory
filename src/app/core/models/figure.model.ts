import { Accent, Era, LocalizedText, SourceLink } from './monument.model';

/** شخصية تاريخية ليبية (أو مرتبطة بليبيا) — للعرض في قسم «شخصيات». */
export interface Figure {
  id: string;
  slug: string;
  name: LocalizedText;
  role: LocalizedText;
  era: Era;
  lifespan: LocalizedText;
  origin: LocalizedText;
  summary: LocalizedText;
  bio: LocalizedText;
  image: string;
  imageCredit: string;
  sources: SourceLink[];
  accent: Accent;
  featured?: boolean;
}
