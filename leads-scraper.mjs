// Coleta estabelecimentos de alimentacao (lanchonetes, restaurantes, padarias, etc)
// nas cidades atendidas pela Frios OF, via OpenStreetMap Overpass API.
// Saida: leads.csv com Cidade, Nome, Tipo, Endereco, Telefone, Site.
import fs from 'node:fs';

const CITIES = [
  { name: 'Ouro Fino', uf: 'MG' },
  { name: 'Borda da Mata', uf: 'MG' },
  { name: 'Inconfidentes', uf: 'MG' },
  { name: 'Bueno Brandão', uf: 'MG' },
];

// Tipos de estabelecimento que usam frios na producao
const AMENITIES = ['restaurant', 'fast_food', 'cafe', 'bar', 'pub', 'ice_cream', 'food_court', 'biergarten'];
const SHOPS = ['bakery', 'butcher', 'convenience', 'deli', 'pastry'];

const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

function buildQuery(cityName, uf) {
  // Busca area da cidade pelo nome + estado, depois nodes/ways/relations dentro dela
  const amen = AMENITIES.map(a => `nwr["amenity"="${a}"](area.a);`).join('\n  ');
  const shop = SHOPS.map(s => `nwr["shop"="${s}"](area.a);`).join('\n  ');
  return `
[out:json][timeout:90];
area["name"="${cityName}"]["admin_level"="8"]->.a;
(
  ${amen}
  ${shop}
);
out center tags;
`;
}

async function fetchCity(city) {
  const query = buildQuery(city.name, city.uf);
  console.log(`  -> Buscando ${city.name}/${city.uf}...`);
  let lastErr;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json',
          'User-Agent': 'FriosOF-Leads/1.0 (contato: friosof@gmail.com)',
        },
        body: 'data=' + encodeURIComponent(query),
      });
      if (!res.ok) {
        lastErr = `${endpoint} -> ${res.status}`;
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      const data = await res.json();
      return data.elements || [];
    } catch (e) {
      lastErr = `${endpoint} -> ${e.message}`;
    }
  }
  throw new Error(`Todos endpoints falharam. Ultimo: ${lastErr}`);
}

function tagOf(el, key) {
  return (el.tags && el.tags[key]) || '';
}

function buildAddress(el) {
  const t = el.tags || {};
  const parts = [];
  const street = t['addr:street'] || '';
  const num = t['addr:housenumber'] || '';
  if (street) parts.push(street + (num ? `, ${num}` : ''));
  if (t['addr:suburb']) parts.push(t['addr:suburb']);
  return parts.join(' - ');
}

function typeLabel(el) {
  const t = el.tags || {};
  const map = {
    restaurant: 'Restaurante', fast_food: 'Lanchonete', cafe: 'Cafe',
    bar: 'Bar', pub: 'Bar', ice_cream: 'Sorveteria', food_court: 'Praca de Alimentacao',
    biergarten: 'Cervejaria', bakery: 'Padaria', butcher: 'Acougue',
    convenience: 'Conveniencia', deli: 'Empório', pastry: 'Confeitaria',
  };
  return map[t.amenity] || map[t.shop] || 'Estabelecimento';
}

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s).replace(/"/g, '""');
  return /[",\n;]/.test(str) ? `"${str}"` : str;
}

(async () => {
  console.log(`\n=== Buscando leads em ${CITIES.length} cidades ===\n`);
  const all = [];
  for (const city of CITIES) {
    try {
      const elements = await fetchCity(city);
      console.log(`     ${elements.length} estabelecimentos encontrados`);
      for (const el of elements) {
        const name = tagOf(el, 'name');
        if (!name) continue; // sem nome nao serve pra leads
        all.push({
          cidade: city.name,
          nome: name,
          tipo: typeLabel(el),
          endereco: buildAddress(el),
          telefone: tagOf(el, 'phone') || tagOf(el, 'contact:phone'),
          whatsapp: tagOf(el, 'contact:whatsapp'),
          site: tagOf(el, 'website') || tagOf(el, 'contact:website'),
          instagram: tagOf(el, 'contact:instagram'),
        });
      }
      await new Promise(r => setTimeout(r, 1500)); // respeitar rate limit do Overpass
    } catch (e) {
      console.log(`     ERRO ${city.name}: ${e.message}`);
    }
  }

  // Estatisticas
  const total = all.length;
  const comTel = all.filter(l => l.telefone || l.whatsapp).length;
  const comEnd = all.filter(l => l.endereco).length;
  console.log(`\n=== Total: ${total} estabelecimentos ===`);
  console.log(`     com telefone: ${comTel} (${Math.round(comTel/total*100)}%)`);
  console.log(`     com endereco: ${comEnd} (${Math.round(comEnd/total*100)}%)\n`);

  // Por cidade
  for (const c of CITIES) {
    const n = all.filter(l => l.cidade === c.name).length;
    const t = all.filter(l => l.cidade === c.name && (l.telefone || l.whatsapp)).length;
    console.log(`  ${c.name}: ${n} (${t} com tel)`);
  }

  // CSV
  const headers = ['Cidade','Nome','Tipo','Endereco','Telefone','WhatsApp','Site','Instagram'];
  const rows = [headers.join(';')];
  for (const l of all) {
    rows.push([l.cidade,l.nome,l.tipo,l.endereco,l.telefone,l.whatsapp,l.site,l.instagram].map(csvEscape).join(';'));
  }
  const out = 'leads-frios-of.csv';
  fs.writeFileSync(out, '\uFEFF' + rows.join('\n'), 'utf8'); // BOM pro Excel abrir UTF-8
  console.log(`\nSalvo em: ${out}`);

  // Tambem versao so com telefone, ordenada por cidade
  const ativos = all.filter(l => l.telefone || l.whatsapp).sort((a,b) =>
    a.cidade.localeCompare(b.cidade) || a.nome.localeCompare(b.nome));
  const rowsAtivos = [headers.join(';')];
  for (const l of ativos) {
    rowsAtivos.push([l.cidade,l.nome,l.tipo,l.endereco,l.telefone,l.whatsapp,l.site,l.instagram].map(csvEscape).join(';'));
  }
  fs.writeFileSync('leads-com-telefone.csv', '\uFEFF' + rowsAtivos.join('\n'), 'utf8');
  console.log(`Salvo em: leads-com-telefone.csv (${ativos.length} com contato)\n`);
})();
