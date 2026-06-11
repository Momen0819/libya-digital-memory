// Fetch verified, real images for each monument from Wikimedia Commons.
// Uses Commons file-search (forgiving) + imageinfo thumburl at 1600px (pre-resized by
// Wikimedia = small & fast). Downloads into public/img/<slug>-N.jpg and writes a mapping.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/img');
const UA = 'LibyaDigitalMemory/1.0 (heritage POC; contact: info@libya-heritage.ly)';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

// Search queries tuned to surface iconic shots; order = lead-priority hints.
const MON = [
  { slug: 'leptis-magna', q: 'Leptis Magna' },
  { slug: 'sabratha', q: 'Sabratha theatre Libya' },
  { slug: 'cyrene', q: 'Cyrene Libya temple' },
  { slug: 'ghadames', q: 'Ghadames old town' },
  { slug: 'tadrart-acacus', q: 'Tadrart Acacus rock art' },
  { slug: 'marcus-aurelius-arch', q: 'Arch of Marcus Aurelius Tripoli' },
  { slug: 'red-castle', q: 'Assaraya Alhamra Red Castle Tripoli citadel' },
  { slug: 'apollonia', q: 'Apollonia Cyrenaica Libya' },
  { slug: 'ptolemais', q: 'Ptolemais Cyrenaica Tolmeita ruins' },
  { slug: 'gurgi-mosque', q: 'Gurgi Mosque Tripoli' },
];

const BAD = /commons-logo|oojs|wikidata|wikimedia|\bflag\b|edit-|question_book|ambox|symbol|_icon|icon_|locator|gnome|folder|linkfa|padlock|text_document|disambig|red_pog|maplink|\bmap\b|карта|plan_|_plan|coin|stamp|\.svg$|uss[ _]|warship|\bship\b|harbou?r|compton|gainard|naval|destroyer|museum|bronze|head/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function searchFiles(q) {
  const j = await api(COMMONS, { action: 'query', list: 'search', srnamespace: '6', srsearch: q, srlimit: '30' });
  return (j?.query?.search || []).map((s) => s.title); // "File:...."
}

async function infoFor(titles) {
  if (!titles.length) return [];
  const j = await api(COMMONS, {
    action: 'query', titles: titles.join('|'),
    prop: 'imageinfo', iiprop: 'url|size|mime', iiurlwidth: '1600',
  });
  return (j?.query?.pages || [])
    .map((p) => p.imageinfo?.[0] && { title: p.title, url: p.imageinfo[0].thumburl || p.imageinfo[0].url, w: p.imageinfo[0].width, h: p.imageinfo[0].height, mime: p.imageinfo[0].mime })
    .filter((x) => x && /jpeg|jpg/i.test(x.mime) && x.w >= 1000 && x.h >= 700 && !BAD.test(x.title))
    .sort((a, b) => b.w * b.h - a.w * a.h);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`DL ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

const result = {};
const credits = {};
await mkdir(OUT, { recursive: true });

const only = process.argv.slice(2);
const list = only.length ? MON.filter((m) => only.includes(m.slug)) : MON;
for (const m of list) {
  try {
    const titles = await searchFiles(m.q);
    await sleep(500);
    const infos = await infoFor(titles.slice(0, 28));
    await sleep(500);
    const picks = infos.slice(0, 4);
    const paths = [];
    let i = 0;
    for (const p of picks) {
      i++;
      const dest = resolve(OUT, `${m.slug}-${i}.jpg`);
      try {
        const bytes = await download(p.url, dest);
        paths.push(`img/${m.slug}-${i}.jpg`);
        console.log(`OK  ${m.slug}-${i}.jpg  ${(bytes / 1024 | 0)}KB  ${p.w}x${p.h}  <- ${p.title.replace('File:', '')}`);
        await sleep(300);
      } catch (e) {
        console.log(`ERR ${m.slug}-${i}  ${e.message}`);
      }
    }
    result[m.slug] = paths;
    credits[m.slug] = picks.map((p) => p.title.replace('File:', ''));
  } catch (e) {
    console.log(`FAIL ${m.slug}: ${e.message}`);
    result[m.slug] = [];
  }
  await sleep(600);
}

await writeFile(resolve(OUT, '_mapping.json'), JSON.stringify({ images: result, credits }, null, 2));
console.log('\n=== MAPPING ===');
console.log(JSON.stringify(result, null, 2));
