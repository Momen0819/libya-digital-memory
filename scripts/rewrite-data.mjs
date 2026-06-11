import { readFile, writeFile } from 'node:fs/promises';
const f = 'src/app/core/data/monuments.data.ts';
let s = await readFile(f, 'utf8');
const SLUGS = ['leptis-magna', 'sabratha', 'cyrene', 'ghadames', 'tadrart-acacus', 'marcus-aurelius-arch', 'red-castle', 'apollonia', 'ptolemais', 'gurgi-mosque'];

// 1) swap the img() helper for a base-aware local() helper
const HELPER =
  "const BASE = typeof document !== 'undefined' ? document.baseURI : '/';\n" +
  'const local = (slug: string, n: number): string => `${BASE}img/${slug}-${n}.jpg`;';
s = s.replace(
  /const img = \(file: string, w = 1280\): string =>\s*`https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/\$\{encodeURIComponent\(file\)\}\?width=\$\{w\}`;/,
  HELPER,
);

// 2) replace each `image: img(...)` in document order
let i = 0;
s = s.replace(/image: img\([^)]*\),/g, () => `image: local('${SLUGS[i++]}', 1),`);

// 3) replace each `gallery: [...]` in document order (4 images each)
let j = 0;
s = s.replace(/gallery: \[[^\]]*\],/g, () => {
  const sl = SLUGS[j++];
  return `gallery: [local('${sl}', 1), local('${sl}', 2), local('${sl}', 3), local('${sl}', 4)],`;
});

if (i !== 10 || j !== 10) {
  console.error(`COUNT MISMATCH image=${i} gallery=${j}`);
  process.exit(1);
}
await writeFile(f, s);
console.log(`OK rewrote ${i} image + ${j} gallery refs; helper replaced=${!s.includes('Special:FilePath')}`);
