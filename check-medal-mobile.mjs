import { chromium, devices } from 'playwright';

const browser = await chromium.launch();

const targets = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
];

for (const t of targets) {
  const ctx = await browser.newContext({ ...t.device });
  const page = await ctx.newPage();
  await page.goto('https://friosof.web.app/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.hero-brand-medallion', { timeout: 15000 });
  await page.waitForTimeout(1500);

  const r = await page.evaluate(() => {
    const med = document.querySelector('.hero-brand-medallion');
    const card = document.querySelector('.hero-brand--inline');
    const m = med.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    return {
      viewport: vw,
      scrollWidth: sw,
      hasHorizontalScroll: sw > vw + 1,
      card: { left: Math.round(c.left), right: Math.round(c.right), width: Math.round(c.width) },
      medal: { left: Math.round(m.left), right: Math.round(m.right), width: Math.round(m.width) },
      medalOverflowsCard: m.right > c.right + 1 || m.left < c.left - 1,
      medalOverflowsViewport: m.right > vw + 1 || m.left < -1,
    };
  });

  console.log(`\n=== ${t.name} ===`);
  console.log(JSON.stringify(r, null, 2));

  const safe = t.name.replace(/\s+/g, '-');
  await page.screenshot({ path: `test-results/medal-${safe}.png` });
  await ctx.close();
}

await browser.close();
