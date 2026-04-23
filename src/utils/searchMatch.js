// Normaliza string para busca: remove acentos, apóstrofes/aspas/pontuação e lowercase.
// Mantém espaços (para preservar fronteiras de palavra) e alfanuméricos.
export function normalize(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['`´’‘"“”]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Distância de Levenshtein — mede edições (insert/delete/substitute) entre duas strings.
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    prev = curr;
  }
  return prev[n];
}

// Tolerância variável conforme o tamanho do termo.
function tolerance(len) {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 8) return 2;
  return 3;
}

// fuzzy: true se needle casa em haystack exatamente OU se alguma palavra do haystack
// tem distância de Levenshtein <= tolerância (ou o needle é substring de palavra ≥4).
export function fuzzyIncludes(haystack, needle) {
  if (!needle) return false;
  if (haystack.includes(needle)) return true;

  const tol = tolerance(needle.length);
  if (tol === 0) return false;

  const words = haystack.split(' ');
  for (const w of words) {
    if (!w) continue;
    if (w.includes(needle)) return true;
    if (needle.includes(w) && w.length >= 4) return true;
    if (Math.abs(w.length - needle.length) <= tol) {
      if (levenshtein(w, needle) <= tol) return true;
    }
    // também tenta distância contra substrings do tamanho do needle
    if (w.length > needle.length) {
      for (let i = 0; i + needle.length <= w.length; i++) {
        if (levenshtein(w.slice(i, i + needle.length), needle) <= tol) return true;
      }
    }
  }
  return false;
}

// Fração ponderada de palavras do termo que aparecem no alvo (0–1).
// Palavras longas pesam mais (são mais específicas — "catupiri" > "scala").
function tokenOverlap(haystack, term) {
  const tokens = term.split(' ').filter(t => t.length >= 2);
  if (!tokens.length) return 0;
  let total = 0;
  let matched = 0;
  for (const t of tokens) {
    const weight = t.length;
    total += weight;
    if (haystack.includes(t) || fuzzyIncludes(haystack, t)) {
      matched += weight;
    }
  }
  return total ? matched / total : 0;
}

// Score unificado para ranking em listas/buscas globais.
// Descrição tem peso comparável a subcategoria; termos com várias palavras
// recebem boost se a maioria das palavras aparece em name+description.
export function scoreMatch(product, term) {
  if (!term) return 0;
  const name = normalize(product.name);
  const sub = normalize(product.subcategory);
  const desc = normalize(product.description);
  const combined = `${name} ${desc} ${sub}`.trim();

  if (name.startsWith(term)) return 5;
  const words = name.split(' ');
  if (words.some(w => w.startsWith(term))) return 4;
  if (name.includes(term)) return 3.5;
  if (desc.includes(term)) return 3;
  if (sub.includes(term)) return 2.8;
  if (fuzzyIncludes(name, term)) return 2.6;
  if (fuzzyIncludes(desc, term)) return 2.2;
  if (fuzzyIncludes(sub, term)) return 1.8;

  // Múltiplas palavras: considera casamento parcial em name+desc combinados
  const overlap = tokenOverlap(combined, term);
  if (overlap >= 0.75) return 2.4;
  if (overlap >= 0.5) return 1.5;
  return 0;
}
