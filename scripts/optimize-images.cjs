#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public');
const DIRS = [
  { src: path.join(ROOT, 'images'), out: path.join(ROOT, 'images', 'webp') },
  { src: path.join(ROOT, 'produtos'), out: path.join(ROOT, 'produtos', 'webp') },
];
const WIDTHS = [400, 800];
const QUALITY = 78;
const EXT_RE = /\.(png|jpe?g|webp)$/i;

async function processDir({ src, out }) {
  if (!fs.existsSync(src)) return { before: 0, after: 0, count: 0 };
  if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

  const files = fs.readdirSync(src).filter((f) => {
    if (!EXT_RE.test(f)) return false;
    const full = path.join(src, f);
    return fs.statSync(full).isFile();
  });

  let before = 0;
  let after = 0;
  let produced = 0;

  for (const file of files) {
    const full = path.join(src, file);
    const base = file.replace(EXT_RE, '');
    const stat = fs.statSync(full);
    before += stat.size;

    const meta = await sharp(full).metadata();

    for (const w of WIDTHS) {
      const targetW = Math.min(w, meta.width || w);
      const outFile = path.join(out, `${base}-${w}.webp`);
      if (fs.existsSync(outFile)) {
        after += fs.statSync(outFile).size;
        continue;
      }
      await sharp(full)
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outFile);
      after += fs.statSync(outFile).size;
      produced++;
    }
    process.stdout.write('.');
  }

  console.log(`\n[${path.basename(src)}] ${files.length} fontes, ${produced} webp novos`);
  return { before, after, count: files.length };
}

(async () => {
  let totalBefore = 0;
  let totalAfter = 0;
  let totalCount = 0;
  for (const d of DIRS) {
    const r = await processDir(d);
    totalBefore += r.before;
    totalAfter += r.after;
    totalCount += r.count;
  }
  console.log('\n====================');
  console.log(`Fontes processadas: ${totalCount}`);
  console.log(`Tamanho fontes:     ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Tamanho webp:       ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Economia:           ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
