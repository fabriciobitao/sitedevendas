// ============================================================
// Motor de busca/scoring para o catalogo (PT-BR)
// Sem dependencias externas, sem IA, sem APIs.
// ------------------------------------------------------------
// Camadas:
//  1. Normalizacao ortografica (acentos, pontuacao, lowercase)
//  2. Sinonimos / correcoes de dominio (catupiri->catupiry, macain->mccain)
//  3. Tokenizacao com fronteira de palavra (\b token \b)
//  4. Chave fonetica PT-BR (mc/mac/me, ph/f, lh/ly, nh/ny, ch/x->sh)
//  5. Levenshtein como ultimo recurso (tolerancia por comprimento)
//  6. Scoring multi-campo ponderado (name>desc>sub>category)
// ============================================================

// ---------- Normalizacao ----------
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

// ---------- Levenshtein ----------
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

function tolerance(len) {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 8) return 2;
  return 3;
}

// ---------- Sinonimos / correcoes de dominio ----------
// Mapeamento token -> token canonico (ja normalizado, sem acento).
// Usado token a token apos normalize(). Cobre marcas e palavras
// que a Web Speech API costuma transcrever de forma errada em pt-BR.
const SYNONYMS = {
  // Catupiry (marca registrada — usuario fala "catupiri")
  catupiri: 'catupiry',
  katupiri: 'catupiry',
  katupiry: 'catupiry',
  katupire: 'catupiry',
  // McCain (marca estrangeira pronunciada "macain"/"mecain")
  macain: 'mccain',
  mecain: 'mccain',
  mcain: 'mccain',
  makain: 'mccain',
  mekain: 'mccain',
  mecan: 'mccain',
  macan: 'mccain',
  mckein: 'mccain',
  mekkein: 'mccain',
  // Heineken (pronuncia anglo/germanica varia muito no Web Speech pt-BR)
  heinequen: 'heineken',
  ainequen: 'heineken',
  ainekem: 'heineken',
  aineken: 'heineken',
  ranequem: 'heineken',
  rainequem: 'heineken',
  heinekem: 'heineken',
  rainequen: 'heineken',
  // Achocolatados
  nescal: 'nescau',
  nescaw: 'nescau',
  nescou: 'nescau',
  tody: 'toddy',
  todi: 'toddy',
  todie: 'toddy',
  // D'Allora (apostrofo vira espaco no normalize, mas usuario pode falar "dalora")
  dalora: 'dallora',
  alora: 'dallora',
  dalhora: 'dallora',
  // Variacoes de "requeijao"
  requeijon: 'requeijao',
  requeijam: 'requeijao',
  requeija: 'requeijao',
  // Outras marcas cuja transcricao costuma errar
  perdigal: 'perdigao',
  perdigou: 'perdigao',
  sadial: 'sadia',
  scalla: 'scala',
  ancala: 'scala',
  italaque: 'italac',
  italaqui: 'italac',
  nestli: 'nestle',
};

function applySynonyms(token) {
  return SYNONYMS[token] || token;
}

// ---------- Chave fonetica PT-BR leve ----------
// Reduz variacoes ortograficas/foneticas para uma chave canonica.
// Exemplos: "mccain"/"macain"/"mecain" -> "mkn", "phpharmacia"/"farmacia" -> "frmc"
export function phoneticKey(word) {
  if (!word) return '';
  let w = word.toLowerCase();
  // Prefixo mc/mac/me/ma vira "mc" para casar mccain/macain/mecain
  w = w.replace(/^m[ae]?c+/, 'mc');
  // Substituicoes
  w = w
    .replace(/ph/g, 'f')
    .replace(/ch/g, 'x')   // chave -> xave (junto com x abaixo)
    .replace(/lh/g, 'ly')
    .replace(/nh/g, 'ny')
    .replace(/qu/g, 'k')
    .replace(/ç/g, 's')
    .replace(/c([eiy])/g, 's$1')
    .replace(/c/g, 'k')
    .replace(/x/g, 'x')   // ja mapeado
    .replace(/w/g, 'u')
    .replace(/y/g, 'i')
    .replace(/z/g, 's')
    .replace(/ss/g, 's')
    .replace(/[h]/g, '');
  // Colapsa consoantes duplas
  w = w.replace(/([bcdfgjklmnpqrstvxz])\1+/g, '$1');
  // Remove vogais (mantendo a primeira) — gera chave consonantal estavel
  if (w.length > 1) {
    w = w[0] + w.slice(1).replace(/[aeiou]/g, '');
  }
  return w;
}

// ---------- Tokenizacao ----------
// Divide a string normalizada em tokens, aplica sinonimos.
function tokenize(s) {
  if (!s) return [];
  return normalize(s)
    .split(' ')
    .filter(Boolean)
    .map(applySynonyms);
}

// Conjunto de stopwords irrelevantes para matching (preposicoes, artigos).
const STOPWORDS = new Set([
  'de', 'do', 'da', 'dos', 'das', 'a', 'o', 'as', 'os',
  'e', 'em', 'no', 'na', 'nos', 'nas',
  'um', 'uma', 'uns', 'umas',
  'para', 'pra', 'pro', 'por', 'com',
]);

// ---------- Indice por produto (cache lazy via WeakMap) ----------
// Para cada produto guardamos as formas pre-processadas dos campos.
// O catalogo vem de Firestore em runtime, entao calculamos sob demanda
// na primeira chamada de scoreMatch e reusamos.
const PRODUCT_INDEX = new WeakMap();

function buildIndex(product) {
  const fields = {
    name: normalize(product.name),
    description: normalize(product.description),
    subcategory: normalize(product.subcategory),
    category: normalize(product.category),
  };
  const index = {};
  for (const [field, raw] of Object.entries(fields)) {
    const tokens = raw.split(' ').filter(Boolean).map(applySynonyms);
    index[field] = {
      raw,                                 // string normalizada (com sinonimos NAO aplicados — usado p/ regex word-boundary)
      tokens,                              // array de tokens (ja com sinonimos)
      tokenSet: new Set(tokens),           // lookup O(1) de palavra exata
      phonetics: tokens.map(phoneticKey),  // chave fonetica por token
      phoneticSet: new Set(tokens.map(phoneticKey)),
    };
  }
  return index;
}

function getIndex(product) {
  if (!product || typeof product !== 'object') return null;
  let idx = PRODUCT_INDEX.get(product);
  if (!idx) {
    idx = buildIndex(product);
    PRODUCT_INDEX.set(product, idx);
  }
  return idx;
}

// ---------- Matching de UM token contra UM campo ----------
// Retorna nivel de confianca: 1.0 exato, 0.8 prefixo, 0.6 fonetico, 0.4 levenshtein, 0 nada.
// REGRA CRITICA: tokens >=4 chars exigem fronteira de palavra. Isso e o que impede
// "presunto" de casar com "apresuntado" (que CONTEM a substring "presunto").
// Tokens curtos (<=3) toleram prefixo de palavra (ex: "uva", "kg").
function tokenMatchLevel(token, fieldIndex) {
  if (!token || !fieldIndex) return 0;
  const { tokens, tokenSet, phoneticSet } = fieldIndex;
  // 1. exato (palavra inteira)
  if (tokenSet.has(token)) return 1.0;
  // Plural/singular trivial: token termina em 's' e palavra existe sem 's', ou vice-versa
  if (token.endsWith('s') && tokenSet.has(token.slice(0, -1))) return 0.95;
  if (tokenSet.has(token + 's')) return 0.95;
  // 2. prefixo (apenas para tokens curtos OU quando >=4 chars e prefixa palavra >=5 chars)
  if (token.length >= 4) {
    for (const w of tokens) {
      if (w !== token && w.startsWith(token) && w.length >= token.length + 1 && w.length >= 5) {
        // prefixo legitimo de palavra inteira (ex: "presunt" prefixa "presunto" mas NAO casa "apresuntado")
        return 0.8;
      }
    }
  } else if (token.length >= 2) {
    // tokens muito curtos (2-3): aceita prefixo de qualquer palavra
    for (const w of tokens) {
      if (w.startsWith(token)) return 0.7;
    }
  }
  // 3. fonetica (so para tokens >=4 — evita casamentos espurios em token curto)
  if (token.length >= 4) {
    const pk = phoneticKey(token);
    if (pk && phoneticSet.has(pk)) return 0.6;
  }
  // 4. levenshtein (ultimo recurso — palavra inteira vs palavra inteira)
  // Diferenca de tamanho deve ser pequena: permitir no maximo 1 char de diff.
  // Isso impede que "apresuntado" (11) e "presunto" (8) casem por lev=3 — caso
  // o critico de fronteira de palavra que precisamos resolver.
  const tol = tolerance(token.length);
  if (tol > 0) {
    for (const w of tokens) {
      const lenDiff = Math.abs(w.length - token.length);
      if (lenDiff > 1) continue;
      if (lenDiff > tol) continue;
      if (levenshtein(w, token) <= tol) return 0.4;
    }
  }
  return 0;
}

// ---------- API publica de fuzzy ----------
// Mantida para compatibilidade. Agora respeita fronteira de palavra.
export function fuzzyIncludes(haystack, needle) {
  if (!needle) return false;
  const fakeIdx = (() => {
    const tokens = haystack.split(' ').filter(Boolean).map(applySynonyms);
    return {
      raw: haystack,
      tokens,
      tokenSet: new Set(tokens),
      phonetics: tokens.map(phoneticKey),
      phoneticSet: new Set(tokens.map(phoneticKey)),
    };
  })();
  const t = applySynonyms(needle);
  return tokenMatchLevel(t, fakeIdx) > 0;
}

// ---------- Scoring multi-campo ----------
// Pesos por campo. Um token que casa em "name" vale mais do que em "description".
const FIELD_WEIGHTS = {
  name: 1.0,
  description: 0.6,
  subcategory: 0.5,
  category: 0.3,
};

// Score por token: maior nivel de confianca encontrado em qualquer campo,
// ponderado pelo peso do campo.
function scoreToken(token, idx) {
  let best = 0;
  for (const field of ['name', 'description', 'subcategory', 'category']) {
    const lvl = tokenMatchLevel(token, idx[field]);
    if (lvl === 0) continue;
    const score = lvl * FIELD_WEIGHTS[field];
    if (score > best) best = score;
  }
  return best;
}

// scoreMatch(product, term) — assinatura mantida para compatibilidade.
// Retorna number >=0. 0 = nao casa.
export function scoreMatch(product, term) {
  if (!term || !product) return 0;
  const idx = getIndex(product);
  if (!idx) return 0;

  // Tokeniza query (com sinonimos), descartando stopwords e tokens vazios.
  const allTokens = tokenize(term);
  const tokens = allTokens.filter(t => t && !STOPWORDS.has(t));
  if (!tokens.length) return 0;

  // Score por token. Para queries com >=2 tokens significativos, exigimos
  // que TODOS casem em algum campo — evita "scala" sozinho arrastar produtos
  // de marca compartilhada (regra de desambiguacao).
  let total = 0;
  let matched = 0;
  let nameMatchedTokens = 0;
  for (const t of tokens) {
    const s = scoreToken(t, idx);
    if (s > 0) {
      matched += 1;
      total += s;
      // Bonus extra se casou no name como palavra inteira
      const nameLvl = tokenMatchLevel(t, idx.name);
      if (nameLvl >= 0.95) nameMatchedTokens += 1;
    }
  }

  if (tokens.length >= 2 && matched < tokens.length) return 0;
  if (matched === 0) return 0;

  // Bonus de sequencia: se a query inteira (concatenada) aparece como
  // substring do name (apos normalizar), reforca o score.
  const joined = tokens.join(' ');
  if (idx.name.raw.includes(joined)) total += 1.0;

  // Bonus por todos os tokens caindo no name como palavra inteira
  if (nameMatchedTokens === tokens.length) total += 0.5;

  // Bonus se name COMECA com o primeiro token (ranqueia "Presunto Cozido Sadia"
  // acima de "Apresuntado Sadia" — ainda que ambos passassem, o que comeca com
  // "presunto" ganha).
  if (idx.name.tokens[0] === tokens[0]) total += 0.6;

  return total;
}
