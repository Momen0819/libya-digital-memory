import { Figure } from '../models/figure.model';

/**
 * شخصيات تاريخية ليبية حقيقية (أو وُلدت على أرض ليبيا) ببيانات ومصادر.
 * الصور (بورتريهات/تماثيل) محمّلة محلياً في public/img/people/ من Wikimedia Commons.
 */
const BASE = typeof document !== 'undefined' ? document.baseURI : '/';
const portrait = (slug: string): string => `${BASE}img/people/${slug}-1.jpg`;

export const FIGURES: Figure[] = [
  {
    id: 'septimius-severus',
    slug: 'septimius-severus',
    name: { ar: 'سبتيموس سيفيروس', en: 'Septimius Severus' },
    role: { ar: 'إمبراطور روماني', en: 'Roman Emperor' },
    era: 'roman',
    lifespan: { ar: '145–211 م', en: '145–211 AD' },
    origin: { ar: 'لِبدة الكبرى', en: 'Leptis Magna' },
    summary: {
      ar: 'ابن لِبدة الذي اعتلى عرش روما وأسّس الأسرة السيفيرية.',
      en: 'The son of Leptis Magna who rose to the throne of Rome and founded the Severan dynasty.',
    },
    bio: {
      ar: 'وُلد في لِبدة الكبرى عام 145م لعائلة محلية مرموقة، وصعد في مناصب الدولة الرومانية حتى صار إمبراطوراً عام 193م. وسّع حدود الإمبراطورية وأصلح الجيش، وأغدق على مدينته لِبدة عمائر فخمة من قوس نصرٍ وبازيليكا وميناء ومسرح. حكم حتى وفاته في بريطانيا عام 211م، وتُعدّ سلالته من أبرز سلالات روما.',
      en: 'Born in Leptis Magna in 145 AD to a prominent local family, he rose through Roman public office to become emperor in 193 AD. He expanded the frontiers of the empire and reformed the army, and lavished his home city of Leptis with a triumphal arch, basilica, harbour and theatre. He ruled until his death in Britain in 211 AD, and his line became one of the notable dynasties of Rome.',
    },
    image: portrait('septimius-severus'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Septimius_Severus' }],
    accent: 'clay',
    featured: true,
  },
  {
    id: 'omar-mukhtar',
    slug: 'omar-mukhtar',
    name: { ar: 'عمر المختار', en: 'Omar Mukhtar' },
    role: { ar: 'قائد المقاومة الليبية', en: 'Leader of the Libyan resistance' },
    era: 'modern',
    lifespan: { ar: '1858–1931 م', en: '1858–1931 AD' },
    origin: { ar: 'برقة (الجبل الأخضر)', en: 'Cyrenaica' },
    summary: {
      ar: '«أسد الصحراء» الذي قاد المقاومة الليبية ضد الاحتلال الإيطالي.',
      en: 'The Lion of the Desert who led the Libyan resistance against the Italian occupation.',
    },
    bio: {
      ar: 'معلّم قرآن وشيخ من قبيلة المنفة في برقة، قاد لأكثر من عشرين عاماً مقاومةً ضارية ضد الاحتلال الإيطالي معتمداً على حرب العصابات في الجبل الأخضر. أُسر عام 1931م وأُعدم شنقاً أمام أتباعه وهو في الثالثة والسبعين، فصار رمزاً خالداً للكرامة والمقاومة في ليبيا والعالم.',
      en: 'A Quran teacher and sheikh of the Mnifa tribe in Cyrenaica, he led a fierce twenty-year resistance against the Italian occupation through guerrilla warfare in the Green Mountain. Captured in 1931 and hanged before his followers at the age of seventy-three, he became an enduring symbol of dignity and resistance in Libya and beyond.',
    },
    image: portrait('omar-mukhtar'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Omar_al-Mukhtar' }],
    accent: 'teal',
    featured: true,
  },
  {
    id: 'eratosthenes',
    slug: 'eratosthenes',
    name: { ar: 'إراتوستينس', en: 'Eratosthenes' },
    role: { ar: 'عالم رياضيات وجغرافيا', en: 'Mathematician & geographer' },
    era: 'greek',
    lifespan: { ar: '276–194 ق.م', en: '276–194 BC' },
    origin: { ar: 'قورينا', en: 'Cyrene' },
    summary: {
      ar: 'ابن قورينا الذي قاس محيط الأرض لأول مرة في التاريخ.',
      en: 'The son of Cyrene who was the first to measure the circumference of the Earth.',
    },
    bio: {
      ar: 'وُلد في قورينا نحو عام 276 قبل الميلاد، وتولّى إدارة مكتبة الإسكندرية. اشتُهر بحسابه الدقيق لمحيط الأرض اعتماداً على زوايا الشمس، وبوضعه أسس الجغرافيا الرياضية وخطوط الطول والعرض، كما ابتكر «غربال إراتوستينس» لإيجاد الأعداد الأولية، ويُعدّ من أعظم علماء العصر الهلنستي.',
      en: 'Born in Cyrene around 276 BC, he became chief librarian of the Library of Alexandria. He is famed for accurately calculating the circumference of the Earth from the angles of the Sun, for founding mathematical geography with lines of latitude and longitude, and for the Sieve of Eratosthenes for finding prime numbers, among the greatest scholars of the Hellenistic age.',
    },
    image: portrait('eratosthenes'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Eratosthenes' }],
    accent: 'gold',
    featured: true,
  },
  {
    id: 'aristippus',
    slug: 'aristippus',
    name: { ar: 'أريستيبوس', en: 'Aristippus' },
    role: { ar: 'فيلسوف، مؤسّس المدرسة القورينائية', en: 'Philosopher, founder of the Cyrenaic school' },
    era: 'greek',
    lifespan: { ar: '435–356 ق.م', en: '435–356 BC' },
    origin: { ar: 'قورينا', en: 'Cyrene' },
    summary: {
      ar: 'تلميذ سقراط الذي أسّس مذهب اللذة القورينائي.',
      en: 'A pupil of Socrates who founded the Cyrenaic philosophy of pleasure.',
    },
    bio: {
      ar: 'وُلد في قورينا وتتلمذ على يد سقراط في أثينا، ثم أسّس «المدرسة القورينائية» التي جعلت اللذة الحاضرة غايةً للحياة الأخلاقية. أثّر فكره لاحقاً في الفلسفة الأبيقورية، وتناقلت كتب الفلاسفة طرائفه وحكمته في التعامل مع الحكّام والمال.',
      en: 'Born in Cyrene and taught by Socrates in Athens, he founded the Cyrenaic school, which made present pleasure the aim of the ethical life. His thought later influenced Epicurean philosophy, and the histories of the philosophers preserved his wit and his shrewdness with rulers and wealth.',
    },
    image: portrait('aristippus'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Aristippus' }],
    accent: 'teal',
  },
  {
    id: 'simon-of-cyrene',
    slug: 'simon-of-cyrene',
    name: { ar: 'سمعان القوريني', en: 'Simon of Cyrene' },
    role: { ar: 'شخصية من الإنجيل', en: 'Biblical figure' },
    era: 'roman',
    lifespan: { ar: 'القرن 1 م', en: '1st c. AD' },
    origin: { ar: 'قورينا', en: 'Cyrene' },
    summary: {
      ar: 'القوريني الذي حمل الصليب عن المسيح بحسب الأناجيل.',
      en: 'The man of Cyrene who, according to the Gospels, carried the cross of Christ.',
    },
    bio: {
      ar: 'يذكر الإنجيل أنّ سمعان القوريني، القادم من مدينة قورينا الليبية، أُلزم بحمل صليب المسيح في طريق الجلجلة. ارتبط اسمه عبر القرون بالعون والتضحية، وصار من أكثر الشخصيات الليبية حضوراً في الفنّ المسيحي العالمي، شاهداً على امتداد أثر أبناء قورينا في حوض المتوسط.',
      en: 'The Gospels record that Simon of Cyrene, who came from the Libyan city of Cyrene, was compelled to carry the cross of Christ on the road to Golgotha. His name has been linked through the centuries with aid and sacrifice, and he became one of the most depicted Libyan figures in world Christian art, a testimony to the reach of the people of Cyrene across the Mediterranean.',
    },
    image: portrait('simon-of-cyrene'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Simon_of_Cyrene' }],
    accent: 'gold',
  },
  {
    id: 'idris-i',
    slug: 'idris-i',
    name: { ar: 'إدريس الأول', en: 'Idris I' },
    role: { ar: 'أول ملوك ليبيا', en: 'First King of Libya' },
    era: 'modern',
    lifespan: { ar: '1889–1983 م', en: '1889–1983 AD' },
    origin: { ar: 'الجغبوب / برقة', en: 'Jaghbub / Cyrenaica' },
    summary: {
      ar: 'زعيم الحركة السنوسية وأول ملك لليبيا المستقلة.',
      en: 'Leader of the Senussi movement and the first king of independent Libya.',
    },
    bio: {
      ar: 'حفيد مؤسّس الحركة السنوسية، قاد المقاومة والعمل السياسي حتى نالت ليبيا استقلالها عام 1951م فصار أول ملوكها باسم إدريس الأول. وحّد أقاليم برقة وطرابلس وفزّان في دولة واحدة، وحكم حتى أُطيح بالملكية عام 1969م، ويُذكر بدوره في تأسيس الدولة الليبية الحديثة.',
      en: 'Grandson of the founder of the Senussi movement, he led resistance and political work until Libya gained independence in 1951, when he became its first king as Idris I. He united the provinces of Cyrenaica, Tripolitania and Fezzan into a single state and reigned until the monarchy was overthrown in 1969, remembered for his role in founding the modern Libyan state.',
    },
    image: portrait('idris-i'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Idris_of_Libya' }],
    accent: 'clay',
  },
  {
    id: 'ramadan-al-suwayhli',
    slug: 'ramadan-al-suwayhli',
    name: { ar: 'رمضان السويحلي', en: 'Ramadan al-Suwayhli' },
    role: { ar: 'قائد مقاومة وزعيم وطني', en: 'Resistance commander & national leader' },
    era: 'modern',
    lifespan: { ar: '1879–1920 م', en: '1879–1920 AD' },
    origin: { ar: 'مصراتة', en: 'Misrata' },
    summary: {
      ar: 'بطل معركة القرضابية وأحد مؤسّسي الجمهورية الطرابلسية.',
      en: 'Hero of the Battle of Qardabiya and a founder of the Tripolitanian Republic.',
    },
    bio: {
      ar: 'زعيم من مصراتة قاد المقاومة ضد الاحتلال الإيطالي، وحقّق انتصاراً مدوّياً في معركة القرضابية عام 1915م. كان من مؤسّسي «الجمهورية الطرابلسية» عام 1918م، أوّل جمهورية في العالم العربي، وظلّ رمزاً للكفاح الوطني حتى استُشهد عام 1920م.',
      en: 'A leader from Misrata who led resistance against the Italian occupation and won a resounding victory at the Battle of Qardabiya in 1915. He was among the founders of the Tripolitanian Republic in 1918, the first republic in the Arab world, and remained a symbol of national struggle until his death in 1920.',
    },
    image: portrait('ramadan-al-suwayhli'),
    imageCredit: 'Wikimedia Commons',
    sources: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ramadan_al-Suwayhli' }],
    accent: 'teal',
  },
];
