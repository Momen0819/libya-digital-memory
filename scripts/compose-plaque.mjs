// Composite a real, scannable QR into the Canva plaque template (cand3 — the one
// with an empty white QR box). Auto-detects the white box, fits the QR inside.
import { Jimp } from 'jimp';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const TEMPLATE = resolve(root, 'design-assets/canva/cand3.png');
const QR = resolve(root, 'public/qr/leptis-magna.png');
const OUT = resolve(root, 'design-assets/plaques/leptis-magna-plaque.png');

const plaque = await Jimp.read(TEMPLATE);
const W = plaque.bitmap.width, H = plaque.bitmap.height;

// Detect the near-white box within the central region (read raw RGBA bitmap).
const data = plaque.bitmap.data;
const isWhite = (x, y) => {
  const i = (y * W + x) * 4;
  return data[i] > 244 && data[i + 1] > 242 && data[i + 2] > 236;
};
const x0 = Math.floor(W * 0.18), x1 = Math.floor(W * 0.82);
const y0 = Math.floor(H * 0.14), y1 = Math.floor(H * 0.62);
let minX = W, minY = H, maxX = 0, maxY = 0, count = 0;
for (let y = y0; y < y1; y += 2) {
  for (let x = x0; x < x1; x += 2) {
    if (isWhite(x, y)) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      count++;
    }
  }
}
const boxW = maxX - minX, boxH = maxY - minY;
console.log(`box: x[${minX}-${maxX}] y[${minY}-${maxY}]  ${boxW}x${boxH}  whitePixels=${count}`);
if (count < 500 || boxW < 100 || boxH < 100) throw new Error('white box not found reliably');

// Fit a square QR inside the box (use the smaller side), with inner padding.
const side = Math.min(boxW, boxH);
const target = Math.round(side * 0.84);
const qr = await Jimp.read(QR);
qr.resize({ w: target, h: target });
const cx = minX + Math.round((boxW - target) / 2);
const cy = minY + Math.round((boxH - target) / 2);
plaque.composite(qr, cx, cy);

await plaque.write(OUT);
console.log(`OK wrote ${OUT}  (QR ${target}px at ${cx},${cy})`);
