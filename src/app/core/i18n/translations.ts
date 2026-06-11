import { Lang, Region, Era, MonumentType, LocalizedText } from '../models/monument.model';

export const UI: Record<string, LocalizedText> = {
  'brand.name': { ar: 'ذاكرة ليبيا الرقمية', en: 'Libyan Digital Memory' },
  'brand.tagline': { ar: 'توثيق التراث الليبي بتقنية الوسائط الرقمية', en: 'Documenting Libyan heritage through digital media' },

  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.monuments': { ar: 'فهرس المعالم', en: 'Monuments' },
  'nav.map': { ar: 'الخريطة', en: 'Map' },
  'nav.gallery': { ar: 'المعرض', en: 'Gallery' },
  'nav.about': { ar: 'عن المشروع', en: 'About' },

  'cta.explore': { ar: 'استكشف المعالم', en: 'Explore monuments' },
  'cta.map': { ar: 'الخريطة التفاعلية', en: 'Interactive map' },
  'cta.viewAll': { ar: 'عرض كل المعالم', en: 'View all monuments' },
  'cta.details': { ar: 'تفاصيل المعلم', en: 'View details' },
  'cta.back': { ar: 'رجوع', en: 'Back' },
  'cta.scan': { ar: 'امسح للوصول', en: 'Scan to open' },

  'hero.eyebrow': { ar: 'مشروع وطني للتراث', en: 'A national heritage project' },
  'hero.title': { ar: 'يكفي مسحُ رمزٍ لاستعادة آلاف السنين', en: 'Scan a code, recover thousands of years' },
  'hero.subtitle': {
    ar: 'منصّة رقمية تفاعلية تحوّل كل معلم تاريخي ليبي إلى بوابة تحكي قصته بالصوت والصورة والبيانات.',
    en: 'An interactive platform that turns every Libyan landmark into a gateway telling its story through audio, image and data.',
  },

  'stats.monuments': { ar: 'معلم موثّق', en: 'Documented monuments' },
  'stats.regions': { ar: 'مناطق', en: 'Regions' },
  'stats.unesco': { ar: 'مواقع تراث عالمي', en: 'World Heritage sites' },
  'stats.eras': { ar: 'عصور حضارية', en: 'Civilisational eras' },

  'section.featured': { ar: 'أبرز المعالم', en: 'Featured monuments' },
  'section.featuredSub': { ar: 'مختارات من كنوز التراث الليبي عبر العصور', en: 'A selection of Libya’s heritage treasures across the ages' },
  'section.explore': { ar: 'استكشف حسب المنطقة', en: 'Explore by region' },
  'section.how': { ar: 'كيف تعمل المنصّة', en: 'How it works' },
  'section.partners': { ar: 'شركاء المشروع', en: 'Project partners' },

  'how.scan.t': { ar: 'امسح الرمز', en: 'Scan the code' },
  'how.scan.d': { ar: 'لوحة QR مقاومة للعوامل الجوية بجانب كل معلم.', en: 'A weatherproof QR plate beside every monument.' },
  'how.open.t': { ar: 'افتح البوابة', en: 'Open the gateway' },
  'how.open.d': { ar: 'صفحة تفاعلية كاملة تُفتح فوراً على هاتفك.', en: 'A full interactive page opens instantly on your phone.' },
  'how.discover.t': { ar: 'اكتشف القصة', en: 'Discover the story' },
  'how.discover.d': { ar: 'صوت، صور، خريطة، وتاريخ موثّق بمصادره.', en: 'Audio, images, maps and sourced history.' },

  'filter.all': { ar: 'الكل', en: 'All' },
  'filter.region': { ar: 'المنطقة', en: 'Region' },
  'filter.era': { ar: 'العصر', en: 'Era' },
  'filter.search': { ar: 'ابحث عن معلم…', en: 'Search a monument…' },
  'filter.results': { ar: 'نتيجة', en: 'results' },
  'filter.empty': { ar: 'لا توجد معالم مطابقة للبحث.', en: 'No monuments match your search.' },

  'detail.about': { ar: 'نبذة تاريخية', en: 'Historical overview' },
  'detail.listen': { ar: 'استمع للسرد', en: 'Listen to narration' },
  'detail.stop': { ar: 'إيقاف', en: 'Stop' },
  'detail.gallery': { ar: 'معرض الصور', en: 'Photo gallery' },
  'detail.location': { ar: 'الموقع الجغرافي', en: 'Location' },
  'detail.streetview': { ar: 'جولة 360°', en: '360° tour' },
  'detail.maps': { ar: 'فتح في خرائط جوجل', en: 'Open in Google Maps' },
  'detail.facts': { ar: 'بطاقة المعلم', en: 'Fact sheet' },
  'detail.sources': { ar: 'المصادر والمراجع', en: 'Sources & references' },
  'detail.qr': { ar: 'رمز الوصول', en: 'Access code' },
  'detail.share': { ar: 'مشاركة', en: 'Share' },
  'detail.video': { ar: 'فيديو وثائقي', en: 'Documentary video' },
  'detail.watch': { ar: 'شاهد على يوتيوب', en: 'Watch on YouTube' },
  'detail.related': { ar: 'معالم ذات صلة', en: 'Related monuments' },
  'detail.unesco': { ar: 'تراث عالمي', en: 'World Heritage' },
  'detail.timeline': { ar: 'الحقبة الزمنية', en: 'Era on the timeline' },

  'map.title': { ar: 'خريطة ليبيا التفاعلية', en: 'Interactive map of Libya' },
  'map.sub': { ar: 'عرض جغرافي لجميع المعالم الموثّقة — انقر على أي علامة للتفاصيل.', en: 'A geographic view of all documented monuments — click a marker for details.' },

  'gallery.title': { ar: 'المعرض المرئي', en: 'Visual gallery' },
  'gallery.sub': { ar: 'أرشيف بصري لكنوز ليبيا التاريخية.', en: 'A visual archive of Libya’s historical treasures.' },

  'about.title': { ar: 'عن المشروع', en: 'About the project' },
  'about.lead': {
    ar: 'مشروع «ذاكرة ليبيا الرقمية» مبادرة لتوثيق المعالم التاريخية الليبية رقمياً وإتاحتها للجمهور عبر رمز الاستجابة السريعة والوسائط المتعددة، دعماً للسياحة الثقافية والهوية الوطنية.',
    en: 'Libyan Digital Memory is an initiative to document Libya’s historical landmarks digitally and make them publicly accessible via QR codes and rich media, in support of cultural tourism and national identity.',
  },
  'about.vision': { ar: 'الرؤية', en: 'Vision' },
  'about.visionText': {
    ar: 'أن يتحوّل كل معلم تاريخي ليبي إلى بوابة رقمية تفاعلية تحكي قصته بصوت وصورة وبيانات.',
    en: 'That every Libyan landmark becomes an interactive digital gateway telling its story through sound, image and data.',
  },
  'about.ministry': { ar: 'وزارة السياحة — ليبيا', en: 'Ministry of Tourism — Libya' },
  'about.ministryRole': { ar: 'الجهة الراعية والمشرفة', en: 'Sponsoring & supervising authority' },
  'about.partnerRole': { ar: 'الشريك التقني المنفّذ', en: 'Technical implementation partner' },
  'about.poc': { ar: 'هذه نسخة أولية (POC) تعرض 10 معالم نموذجية بداتا حقيقية.', en: 'This is a proof-of-concept showcasing 10 sample monuments with real data.' },

  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  'footer.proposal': { ar: 'مقترح مشروع — يونيو 2026', en: 'Project proposal — June 2026' },
  'footer.images': { ar: 'الصور من Wikimedia Commons', en: 'Images via Wikimedia Commons' },
};

export const REGION_LABEL: Record<Region, LocalizedText> = {
  west: { ar: 'الإقليم الغربي', en: 'Western Region' },
  east: { ar: 'الإقليم الشرقي', en: 'Eastern Region' },
  south: { ar: 'الجنوب (فزّان)', en: 'Southern Region (Fezzan)' },
};

export const ERA_LABEL: Record<Era, LocalizedText> = {
  prehistoric: { ar: 'ما قبل التاريخ', en: 'Prehistoric' },
  phoenician: { ar: 'فينيقي', en: 'Phoenician' },
  greek: { ar: 'إغريقي', en: 'Greek' },
  roman: { ar: 'روماني', en: 'Roman' },
  byzantine: { ar: 'بيزنطي', en: 'Byzantine' },
  islamic: { ar: 'إسلامي', en: 'Islamic' },
  ottoman: { ar: 'عثماني', en: 'Ottoman' },
};

export const TYPE_LABEL: Record<MonumentType, LocalizedText> = {
  'archaeological-city': { ar: 'مدينة أثرية', en: 'Archaeological city' },
  monument: { ar: 'معلم', en: 'Monument' },
  fortress: { ar: 'قلعة', en: 'Fortress' },
  mosque: { ar: 'مسجد', en: 'Mosque' },
  'rock-art': { ar: 'فنّ صخري', en: 'Rock art' },
  'old-town': { ar: 'مدينة قديمة', en: 'Old town' },
};

export function pickText(t: LocalizedText, lang: Lang): string {
  return t[lang];
}
