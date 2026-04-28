import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['Pixel 5'] });
const page = await context.newPage();
await page.goto('http://localhost:4173/');
await page.waitForSelector('.hero-brand-medallion', { timeout: 10000 });
await page.waitForTimeout(800);

const result = await page.evaluate(() => {
  const med = document.querySelector('.hero-brand-medallion');
  const card = document.querySelector('.hero-brand--inline');
  const m = med.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  return {
    viewport: vw,
    cardLeft: Math.round(c.left), cardRight: Math.round(c.right), cardWidth: Math.round(c.width),
    medLeft: Math.round(m.left), medRight: Math.round(m.right), medWidth: Math.round(m.width),
    medOverflowsCard: m.right > c.right + 1 || m.left < c.left - 1,
    medOverflowsViewport: m.right > vw + 1 || m.left < -1,
  };
});

console.log(JSON.stringify(result, null, 2));
await page.screenshot({ path: 'test-results/medal-mobile.png', fullPage: false });
await browser.close();
