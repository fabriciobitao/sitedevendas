#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'public', 'images');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images-optimized');

const WIDTHS = [400, 800];
const QUALITY = 78;

async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));
  console.log(`Processando ${files.length} imagens...`);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const src = path.join(SRC_DIR, file);
    const base = file.replace(/\.(png|jpe?g)$/i, '');
    const stat = fs.statSync(src);
    totalBefore += stat.size;

    const input = sharp(src);
    const meta = await input.metadata();

    for (const w of WIDTHS) {
      const targetW = Math.min(w, meta.width || w);
      const out = path.join(OUT_DIR, `${base}-${w}.webp`);
      await sharp(src)
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      totalAfter += fs.statSync(out).size;
    }
    process.stdout.write('.');
  }
  console.log('\nDone.');
  console.log(`Antes: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Depois (2 tamanhos por imagem): ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
