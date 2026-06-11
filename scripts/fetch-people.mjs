// Fetch portraits/busts for Libyan historical figures from Wikimedia Commons.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/img/people');
const UA = 'LibyaDigitalMemory/1.0 (heritage POC; contact: info@libya-heritage.ly)';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

const PPL = [
  { slug: 'septimius-severus', q: 'Septimius Severus bust', hint: 'severus' },
  { slug: 'omar-mukhtar', q: 'Omar Mukhtar', hint: 'mukhtar' },
  { slug: 'eratosthenes', q: 'Eratosthenes', hint: 'eratosthenes' },
  { slug: 'aristippus', q: 'Aristippus philosopher', hint: 'aristippus' },
  { slug: 'synesius', q: 'Synesius of Cyrene', hint: 'synesius' },
  { slug: 'simon-of-cyrene', q: 'Simon of Cyrene cross', hint: 'simon' },
  { slug: 'callimachus', q: 'Callimachus poet Cyrene', hint: 'callimachus' },
  { slug: 'ahmed-karamanli', q: 'Karamanli dynasty Tripoli', hint: 'karamanli' },
  { slug: 'idris-i', q: 'Idris of Libya king', hint: 'idris' },
  { slug: 'ramadan-al-suwayhli', q: 'Ramadan al-Suwayhli', hint: 'suwayhli' },
];

const BAD = /commons-logo|oojs|wikidata|wikimedia|\bflag\b|edit-|ambox|symbol|_icon|icon_|locator|gnome|folder|linkfa|padlock|disambig|maplink|\bmap\b|\.svg$/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(p) {
  const u = `${COMMONS}?${new URLSearchParams({ format: 'json', formatversion: '2', ...p })}`;
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  return r.json();
}
async function download(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error('DL ' + r.status);
  await writeFile(dest, Buffer.from(await r.arrayBuffer()));
}

const result = {};
await mkdir(OUT, { recursive: true });
const only = process.argv.slice(2);
const list = only.length ? PPL.filter((p) => only.includes(p.slug)) : PPL;

for (const person of list) {
  try {
    const j = await api({ action: 'query', list: 'search', srnamespace: '6', srsearch: person.q, srlimit: '30' });
    const titles = (j?.query?.search || []).map((s) => s.title);
    await sleep(450);
    const ji = await api({ action: 'query', titles: titles.slice(0, 28).join('|'), prop: 'imageinfo', iiprop: 'url|size|mime', iiurlwidth: '1100' });
    const infos = (ji?.query?.pages || [])
      .map((p) => p.imageinfo?.[0] && { title: p.title, url: p.imageinfo[0].thumburl || p.imageinfo[0].url, w: p.imageinfo[0].width, h: p.imageinfo[0].height, mime: p.imageinfo[0].mime })
      .filter((x) => x && /jpeg|jpg/i.test(x.mime) && x.w >= 500 && !BAD.test(x.title));
    // prefer files whose name contains the person hint, then by size
    infos.sort((a, b) => {
      const ah = a.title.toLowerCase().includes(person.hint) ? 1 : 0;
      const bh = b.title.toLowerCase().includes(person.hint) ? 1 : 0;
      if (ah !== bh) return bh - ah;
      return b.w * b.h - a.w * a.h;
    });
    await sleep(450);
    let i = 0;
    const paths = [];
    for (const p of infos.slice(0, 2)) {
      i++;
      try {
        await download(p.url, resolve(OUT, `${person.slug}-${i}.jpg`));
        paths.push(`img/people/${person.slug}-${i}.jpg`);
        console.log(`OK ${person.slug}-${i}.jpg ${p.w}x${p.h} <- ${p.title.replace('File:', '')}`);
        await sleep(250);
      } catch (e) { console.log(`ERR ${person.slug}-${i} ${e.message}`); }
    }
    result[person.slug] = paths.length;
  } catch (e) { console.log(`FAIL ${person.slug}: ${e.message}`); result[person.slug] = 0; }
  await sleep(550);
}
console.log('\nCOUNTS ' + JSON.stringify(result));
