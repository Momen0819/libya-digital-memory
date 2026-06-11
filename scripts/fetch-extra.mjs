// Fetch real Wikimedia Commons images for the NEW batch of Libyan monuments.
// Same approach as fetch-images.mjs (Commons file-search + 1600px thumbs).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/img');
const UA = 'LibyaDigitalMemory/1.0 (heritage POC; contact: info@libya-heritage.ly)';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

const MON = [
  { slug: 'villa-silin', q: 'Villa Silin Libya mosaic Roman' },
  { slug: 'ghirza', q: 'Ghirza Libya' },
  { slug: 'qasr-libya', q: 'Qasr Libya mosaics' },
  { slug: 'tocra', q: 'Tocra Taucheira Libya' },
  { slug: 'berenice-benghazi', q: 'Sidi Khrebish Benghazi archaeology' },
  { slug: 'slonta', q: 'Slonta Libya sanctuary' },
  { slug: 'qasr-al-haj', q: 'Qasr al-Hajj Libya' },
  { slug: 'ksar-nalut', q: 'Nalut Libya ksar' },
  { slug: 'awjila-atiq-mosque', q: 'Atiq Mosque Awjila Libya' },
  { slug: 'karamanli-mosque', q: 'Karamanli Mosque Tripoli' },
  { slug: 'wadi-methkandoush', q: 'Wadi Mathendous rock art Libya' },
  { slug: 'old-tripoli-medina', q: 'Tripoli medina old city Libya' },
];

const BAD = /commons-logo|oojs|wikidata|wikimedia|\bflag\b|edit-|question_book|ambox|symbol|_icon|icon_|locator|gnome|folder|linkfa|padlock|disambig|red_pog|maplink|\bmap\b|карта|admiralty|chart|\.svg$/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
async function searchFiles(q) {
  const j = await api(COMMONS, { action: 'query', list: 'search', srnamespace: '6', srsearch: q, srlimit: '30' });
  return (j?.query?.search || []).map((s) => s.title);
}
async function infoFor(titles) {
  if (!titles.length) return [];
  const j = await api(COMMONS, { action: 'query', titles: titles.join('|'), prop: 'imageinfo', iiprop: 'url|size|mime', iiurlwidth: '1600' });
  return (j?.query?.pages || [])
    .map((p) => p.imageinfo?.[0] && { title: p.title, url: p.imageinfo[0].thumburl || p.imageinfo[0].url, w: p.imageinfo[0].width, h: p.imageinfo[0].height, mime: p.imageinfo[0].mime })
    .filter((x) => x && /jpeg|jpg/i.test(x.mime) && x.w >= 900 && x.h >= 600 && !BAD.test(x.title))
    .sort((a, b) => b.w * b.h - a.w * a.h);
}
async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`DL ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const result = {};
await mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const list = only.length ? MON.filter((m) => only.includes(m.slug)) : MON;

for (const m of list) {
  try {
    const titles = await searchFiles(m.q);
    await sleep(450);
    const infos = await infoFor(titles.slice(0, 28));
    await sleep(450);
    const picks = infos.slice(0, 4);
    const paths = [];
    let i = 0;
    for (const p of picks) {
      i++;
      try {
        await download(p.url, resolve(OUT, `${m.slug}-${i}.jpg`));
        paths.push(`img/${m.slug}-${i}.jpg`);
        console.log(`OK  ${m.slug}-${i}.jpg  ${p.w}x${p.h}  <- ${p.title.replace('File:', '')}`);
        await sleep(250);
      } catch (e) { console.log(`ERR ${m.slug}-${i} ${e.message}`); }
    }
    result[m.slug] = paths.length;
  } catch (e) { console.log(`FAIL ${m.slug}: ${e.message}`); result[m.slug] = 0; }
  await sleep(550);
}
console.log('\nCOUNTS ' + JSON.stringify(result));
