import { normalize, scoreMatch } from './searchMatch';

const NUMBER_WORDS = {
  um: 1, uma: 1, 'um ': 1,
  dois: 2, duas: 2,
  tres: 3, 'três': 3,
  quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
  onze: 11, doze: 12, treze: 13, quatorze: 14, catorze: 14, quinze: 15,
  dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20,
  meio: 0.5, meia: 0.5, 'meia duzia': 6, 'meia dúzia': 6, duzia: 12, 'dúzia': 12,
};

const UNIT_WORDS = [
  'kg', 'quilo', 'quilos', 'quilograma', 'quilogramas',
  'g', 'grama', 'gramas',
  'l', 'litro', 'litros', 'ml',
  'pacote', 'pacotes', 'pct',
  'caixa', 'caixas', 'cx',
  'unidade', 'unidades', 'un', 'und',
  'duzia', 'dúzia', 'duzias', 'dúzias',
  'peca', 'peça', 'pecas', 'peças',
  'fatia', 'fatias',
  'saco', 'sacos', 'sache', 'sachê', 'saches', 'sachês',
  'garrafa', 'garrafas', 'lata', 'latas',
  'bandeja', 'bandejas', 'pote', 'potes',
];

function stripFiller(text) {
  return text
    .replace(/^(por favor|quero|queria|preciso|me da|me dá|me ve|me vê|me manda|pega|pegar|comprar|coloca|adiciona)\s+/g, '')
    .replace(/\s+(por favor|tambem|também)\s*$/g, '')
    .replace(/\bpor favor\b/g, '')
    .trim();
}

function splitItems(transcript) {
  const cleaned = transcript.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  return cleaned
    .split(/\s*(?:,|;| e | mais | depois | tambem | também |\be\b |\.)\s*/i)
    .map(s => s.trim())
    .filter(Boolean);
}

function extractQuantity(chunk) {
  const normalized = normalize(chunk);
  const parts = normalized.split(' ');
  if (!parts.length) return { qty: 1, rest: normalized };

  const first = parts[0];
  const firstTwo = parts.slice(0, 2).join(' ');

  // "meia duzia"
  if (NUMBER_WORDS[firstTwo] != null) {
    return { qty: NUMBER_WORDS[firstTwo], rest: parts.slice(2).join(' ') };
  }
  // número arábico "2" ou "2.5"
  const numMatch = first.match(/^(\d+(?:[.,]\d+)?)$/);
  if (numMatch) {
    return { qty: parseFloat(numMatch[1].replace(',', '.')), rest: parts.slice(1).join(' ') };
  }
  // número por extenso "dois"
  if (NUMBER_WORDS[first] != null) {
    return { qty: NUMBER_WORDS[first], rest: parts.slice(1).join(' ') };
  }
  return { qty: 1, rest: normalized };
}

function extractUnit(rest) {
  const parts = rest.split(' ');
  if (!parts.length) return { unit: null, rest };
  const first = parts[0];
  if (UNIT_WORDS.includes(first)) {
    let remainder = parts.slice(1).join(' ');
    remainder = remainder.replace(/^(de|do|da|dos|das)\s+/, '');
    return { unit: first, rest: remainder };
  }
  return { unit: null, rest };
}

function matchProduct(name, products) {
  if (!name || !products || products.length === 0) return null;
  const term = normalize(name);
  if (!term) return null;

  let best = null;
  let bestScore = 0;
  for (const p of products) {
    const score = scoreMatch(p, term);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore > 0 ? { product: best, score: bestScore } : null;
}

// Retorna array de { raw, qty, unit, query, match: { product, score } | null }
export function parseShoppingList(transcript, products) {
  const cleanTranscript = stripFiller(transcript || '');
  const chunks = splitItems(cleanTranscript);
  const items = [];
  for (const raw of chunks) {
    const cleanedChunk = stripFiller(raw);
    const { qty, rest: afterQty } = extractQuantity(cleanedChunk);
    const { unit, rest: afterUnit } = extractUnit(afterQty);
    const query = afterUnit.replace(/^(de|do|da|dos|das)\s+/, '').trim();
    if (!query) continue;
    const match = matchProduct(query, products);
    items.push({ raw, qty, unit, query, match });
  }
  return items;
}
