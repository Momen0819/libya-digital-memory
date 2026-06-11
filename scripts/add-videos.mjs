import { readFile, writeFile } from 'node:fs/promises';
const f = 'src/app/core/data/monuments.data.ts';
let s = await readFile(f, 'utf8');

const VIDEOS = {
  'leptis-magna': 'uHxPAye2m5k',
  'sabratha': 'wdrDliJZDhE',
  'cyrene': 'pG7AmxcYJKo',
  'ghadames': 'CXAyfvFlgfU',
  'tadrart-acacus': 'nzrqwWpw1UY',
  'marcus-aurelius-arch': '4wmKigAczHo',
  'red-castle': '2Gz8xsqj7IM',
  'apollonia': 'b7sJ61QhP98',
  'ptolemais': 'jy0fEjyQ0rY',
};

let n = 0;
for (const [slug, id] of Object.entries(VIDEOS)) {
  if (s.includes(`videoId: '${id}'`)) continue; // idempotent
  const re = new RegExp(`( *)slug: '${slug}',(\\r?\\n)`);
  if (!re.test(s)) { console.error(`MISS slug ${slug}`); continue; }
  s = s.replace(re, (m, indent, eol) => `${indent}slug: '${slug}',${eol}${indent}videoId: '${id}',${eol}`);
  n++;
}
await writeFile(f, s);
console.log(`inserted videoId for ${n} monuments`);
