// Build a 1200x630 Open Graph image from a real flagship photo (Leptis Magna),
// with a subtle dark scrim at the bottom for legibility when platforms overlay text.
import { Jimp } from 'jimp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const src = await Jimp.read(resolve(root, 'public/img/leptis-magna-1.jpg'));
src.cover({ w: 1200, h: 630 });

// bottom gradient scrim (dark) so any overlaid title stays readable
const H = 630, W = 1200, band = 230;
const data = src.bitmap.data;
for (let y = H - band; y < H; y++) {
  const a = (y - (H - band)) / band; // 0 -> 1 toward bottom
  const k = a * 0.55;
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    data[i] = Math.round(data[i] * (1 - k) + 0x14 * k);
    data[i + 1] = Math.round(data[i + 1] * (1 - k) + 0x10 * k);
    data[i + 2] = Math.round(data[i + 2] * (1 - k) + 0x0c * k);
  }
}

await src.write(resolve(root, 'public/og.jpg'));
console.log('wrote public/og.jpg 1200x630');
