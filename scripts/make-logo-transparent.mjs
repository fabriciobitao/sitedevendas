import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const SRC = 'public/logo.jpg';
const DEST = 'public/logo.png';

const input = await readFile(SRC);
const img = sharp(input).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

const out = Buffer.from(data);
const { width, height, channels } = info;
const TH = 230; // brightness threshold
const SOFT = 240; // soft edge

for (let i = 0; i < out.length; i += channels) {
  const r = out[i], g = out[i + 1], b = out[i + 2];
  const min = Math.min(r, g, b);
  if (min >= SOFT) {
    out[i + 3] = 0; // fully transparent
  } else if (min >= TH) {
    // fade between TH..SOFT
    const t = (min - TH) / (SOFT - TH);
    out[i + 3] = Math.round(255 * (1 - t));
  }
}

const png = await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(DEST, png);
console.log(`Saved ${DEST} (${png.length} bytes, ${width}x${height})`);
