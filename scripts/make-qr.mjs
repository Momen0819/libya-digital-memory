// Generate real, scannable QR codes (PNG) for every monument, pointing to the
// live deep link. Saved to public/qr/<slug>.png so they ship with the site and
// can be uploaded into Canva / printed on field plaques.
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/qr');
const BASE = 'https://momen0819.github.io/libya-digital-memory/m/';

const SLUGS = [
  'leptis-magna', 'sabratha', 'cyrene', 'ghadames', 'tadrart-acacus',
  'marcus-aurelius-arch', 'red-castle', 'apollonia', 'ptolemais', 'gurgi-mosque',
];

await mkdir(OUT, { recursive: true });
for (const slug of SLUGS) {
  const url = BASE + slug;
  await QRCode.toFile(resolve(OUT, `${slug}.png`), url, {
    errorCorrectionLevel: 'Q', // robust for print / partial damage
    margin: 2,
    width: 1000,
    color: { dark: '#221C14', light: '#FFFFFF' }, // near-black ink on white = high contrast
  });
  console.log(`OK ${slug}.png -> ${url}`);
}
console.log('done');
