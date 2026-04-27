// Coleta leads do Google Maps via Playwright (gratuito).
// Busca por tipos de estabelecimento em cada cidade, extrai nome, endereco e telefone.
import { chromium } from 'playwright';
import fs from 'node:fs';

const CITIES = ['Ouro Fino MG', 'Borda da Mata MG', 'Inconfidentes MG', 'Bueno Brandão MG'];
const QUERIES = [
  'restaurantes',
  'lanchonetes',
  'padarias',
  'pizzarias',
  'hamburguerias',
  'açougues',
  'bares',
  'sorveterias',
  'food truck',
  'cafés',
];

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s).replace(/"/g, '""');
  return /[",\n;]/.test(str) ? `"${str}"` : str;
}

function dedupKey(l) {
  return `${l.cidade}::${(l.nome || '').toLowerCase().trim()}`;
}

async function scrapeQuery(page, city, query) {
  const term = `${query} em ${city}`;
  const url = `https://www.google.com/maps/search/${encodeURIComponent(term)}/?hl=pt-BR`;
  console.log(`    -> "${term}"`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);

  // Scroll do painel de resultados ate o final
  const feedSelector = 'div[role="feed"]';
  await page.waitForSelector(feedSelector, { timeout: 10000 }).catch(() => null);
  let prevCount = 0;
  for (let i = 0; i < 8; i++) {
    await page.evaluate((sel) => {
      const feed = document.querySelector(sel);
      if (feed) feed.scrollTop = feed.scrollHeight;
    }, feedSelector);
    await page.waitForTimeout(1500);
    const cnt = await page.locator(`${feedSelector} > div > div[jsaction]`).count();
    if (cnt === prevCount) break;
    prevCount = cnt;
  }

  // Cada card tem um link com /maps/place/ — entra em cada um e extrai telefone
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/maps/place/"]'));
    const seen = new Set();
    const out = [];
    for (const a of anchors) {
      if (seen.has(a.href)) continue;
      seen.add(a.href);
      const card = a.closest('[role="article"]') || a.closest('div[jsaction]');
      const name = a.getAttribute('aria-label') || (card?.querySelector('.fontHeadlineSmall')?.textContent) || '';
      out.push({ href: a.href, nome: name.trim() });
    }
    return out;
  });

  console.log(`        ${links.length} cards encontrados`);
  const results = [];
  for (const link of links.slice(0, 60)) { // cap de seguranca
    try {
      await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1800);
      const info = await page.evaluate(() => {
        const t = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        // Botao "Telefone" tem aria-label "Telefone: ..."
        const phoneBtn = document.querySelector('button[data-item-id^="phone"]');
        const phone = phoneBtn?.getAttribute('aria-label')?.replace(/^Telefone:\s*/i, '').trim() || '';
        // Endereco: button[data-item-id="address"]
        const addrBtn = document.querySelector('button[data-item-id="address"]');
        const addr = addrBtn?.getAttribute('aria-label')?.replace(/^Endereço:\s*/i, '').trim() || '';
        // Nome: h1
        const nome = t('h1');
        // Tipo: botao com aria-label "Categoria: ..."
        const catBtn = document.querySelector('button[jsaction*="category"]');
        const tipo = catBtn?.textContent?.trim() || '';
        // Site
        const siteBtn = document.querySelector('a[data-item-id="authority"]');
        const site = siteBtn?.href || '';
        return { nome, phone, addr, tipo, site };
      });
      if (info.nome) {
        results.push({
          cidade: city.replace(/ MG$/, ''),
          nome: info.nome,
          tipo: info.tipo,
          endereco: info.addr,
          telefone: info.phone,
          site: info.site,
          query,
        });
      }
      await page.waitForTimeout(800);
    } catch (e) {
      // ignora cards que falham
    }
  }
  return results;
}

(async () => {
  console.log(`\n=== Scraping Google Maps em ${CITIES.length} cidades ===\n`);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: 'pt-BR',
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  const all = new Map();
  for (const city of CITIES) {
    console.log(`\n--- ${city} ---`);
    for (const q of QUERIES) {
      try {
        const items = await scrapeQuery(page, city, q);
        for (const item of items) {
          const k = dedupKey(item);
          if (!all.has(k)) all.set(k, item);
          else {
            // mantem o que tem mais campos preenchidos
            const old = all.get(k);
            const score = (x) => (x.telefone?1:0)+(x.endereco?1:0)+(x.site?1:0);
            if (score(item) > score(old)) all.set(k, item);
          }
        }
      } catch (e) {
        console.log(`        ERRO: ${e.message}`);
      }
    }
  }
  await browser.close();

  const list = Array.from(all.values()).sort((a,b) =>
    a.cidade.localeCompare(b.cidade) || a.nome.localeCompare(b.nome));

  console.log(`\n=== Total dedup: ${list.length} estabelecimentos ===`);
  const comTel = list.filter(l => l.telefone).length;
  const comEnd = list.filter(l => l.endereco).length;
  console.log(`     com telefone: ${comTel}`);
  console.log(`     com endereco: ${comEnd}\n`);
  for (const c of CITIES) {
    const cn = c.replace(/ MG$/, '');
    const n = list.filter(l => l.cidade === cn).length;
    const t = list.filter(l => l.cidade === cn && l.telefone).length;
    console.log(`  ${cn}: ${n} (${t} com tel)`);
  }

  const headers = ['Cidade','Nome','Tipo','Endereco','Telefone','Site','Buscado_Como'];
  const rows = [headers.join(';')];
  for (const l of list) {
    rows.push([l.cidade,l.nome,l.tipo,l.endereco,l.telefone,l.site,l.query].map(csvEscape).join(';'));
  }
  fs.writeFileSync('leads-googlemaps.csv', '\uFEFF' + rows.join('\n'), 'utf8');
  console.log(`\nSalvo: leads-googlemaps.csv\n`);

  // Versao so com telefone
  const ativos = list.filter(l => l.telefone);
  const rowsAtivos = [headers.join(';')];
  for (const l of ativos) {
    rowsAtivos.push([l.cidade,l.nome,l.tipo,l.endereco,l.telefone,l.site,l.query].map(csvEscape).join(';'));
  }
  fs.writeFileSync('leads-com-telefone.csv', '\uFEFF' + rowsAtivos.join('\n'), 'utf8');
  console.log(`Salvo: leads-com-telefone.csv (${ativos.length} com telefone)\n`);
})();
