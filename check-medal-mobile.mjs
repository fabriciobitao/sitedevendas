import { chromium } from 'playwright';
const sizes = [
  { name: '320', w: 320, h: 700 },
  { name: '375', w: 375, h: 812 },
  { name: '390', w: 390, h: 844 },
  { name: '414', w: 414, h: 896 },
  { name: '768-tablet', w: 768, h: 1024 },
  { name: '900', w: 900, h: 900 },
  { name: '1280-desktop', w: 1280, h: 900 },
];
const browser = await chromium.launch();
for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } });
  const page = await ctx.newPage();
  await page.goto('https://friosof.web.app', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const data = await page.evaluate(() => {
    const card = document.querySelector('.hero-brand-logocard');
    const logo = document.querySelector('.hero-brand-logo');
    const medal = document.querySelector('.hero-brand-medallion');
    const r = (el) => el ? el.getBoundingClientRect() : null;
    return {
      card: r(card) && { w: card.getBoundingClientRect().width, h: card.getBoundingClientRect().height },
      logo: r(logo) && { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height },
      medal: r(medal) && { w: medal.getBoundingClientRect().width, h: medal.getBoundingClientRect().height },
    };
  });
  console.log(`${s.name} (${s.w}x${s.h}):`, JSON.stringify(data));
  await page.screenshot({ path: `/tmp/medal-${s.name}.png`, clip: { x: 0, y: 0, width: Math.min(s.w, 700), height: Math.min(s.h, 700) } });
  await ctx.close();
}
await browser.close();
