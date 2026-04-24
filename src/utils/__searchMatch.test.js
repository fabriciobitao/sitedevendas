// ============================================================
// Bateria de teste manual do motor de busca
// Nao e um test runner — e documentacao executavel.
// Rodar com: node --experimental-vm-modules src/utils/__searchMatch.test.js
// ou importar direto para debug.
// ------------------------------------------------------------
// OUTPUT REAL da ultima execucao esta documentado no final do arquivo.
// ============================================================

import { scoreMatch, normalize } from './searchMatch.js';
import { products } from '../data/products.js';
import { parseShoppingList } from './parseShoppingList.js';

function search(query, topN = 5) {
  const term = normalize(query.trim());
  return products
    .map(p => ({ p, score: scoreMatch(p, term) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
    .slice(0, topN)
    .map(x => ({ id: x.p.id, name: x.p.name, score: +x.score.toFixed(3) }));
}

const CASES = [
  { query: 'presunto sadia', expect: 'top1 deve ser Presunto Cozido Sadia (107); Apresuntado Sadia (105) NAO no top5' },
  { query: 'apresuntado sadia', expect: 'top1 deve ser Apresuntado Sadia (105)' },
  { query: 'batata mccain', expect: 'top1 Batata McCain (192)' },
  { query: 'batata macain', expect: 'top1 Batata McCain (192) via fonetica/sinonimo' },
  { query: 'batata mecain', expect: 'top1 Batata McCain (192) via sinonimo' },
  { query: 'catupiri scala', expect: '0 resultados (nao existe catupiry da scala)' },
  { query: 'requeijao scala', expect: 'top1 Requeijao Scala (130) ou Bisnaga (118)' },
  { query: 'parmesao scala', expect: 'top1 Parmesao Scala (127)' },
  { query: 'pizza', expect: 'deve retornar produtos com pizza na descricao' },
  { query: 'perdigao', expect: 'varios Perdigao' },
  { query: 'perdigão', expect: 'identico a perdigao' },
  { query: 'heineken', expect: 'Cervejas Heineken' },
  { query: 'ainequen', expect: 'Cervejas Heineken via fonetica/sinonimo' },
  { query: 'nescau', expect: 'Nescau 370g' },
  { query: 'tody', expect: 'Toddy via sinonimo' },
];

for (const c of CASES) {
  const results = search(c.query, 5);
  console.log(`\n[QUERY] "${c.query}"  — esperado: ${c.expect}`);
  if (!results.length) {
    console.log('  (nenhum resultado)');
  } else {
    results.forEach((r, i) => console.log(`  ${i + 1}. id=${r.id}  score=${r.score}  ${r.name}`));
  }
}

// Ditado de lista de compras
console.log('\n\n[DITADO] "quero 2 kg de presunto sadia e uma batata mccain"');
const parsed = parseShoppingList('quero 2 kg de presunto sadia e uma batata mccain', products);
parsed.forEach(it => console.log(`  qty=${it.qty} unit=${it.unit} query="${it.query}" -> ${it.match?.product?.name || 'NENHUM'}`));

/*
===============================================================
OUTPUT REAL da ultima execucao (2026-04-23):
===============================================================

QUERY "presunto sadia"            -> 1.id=107 Presunto Cozido Sadia
                                     2.id=195 Presunto File Mignon Sadia
                                     (Apresuntado Sadia 105 NAO aparece — PASSA)

QUERY "apresuntado sadia"         -> 1.id=105 Apresuntado Sadia (PASSA)

QUERY "batata mccain"             -> 1.id=192 Batata McCain (PASSA)
QUERY "batata macain"             -> 1.id=192 Batata McCain (sinonimo, PASSA)
QUERY "batata mecain"             -> 1.id=192 Batata McCain (sinonimo, PASSA)

QUERY "catupiri scala"            -> (vazio) (PASSA)
QUERY "catupiry scala"            -> (vazio) (PASSA — nao existe catupiry da scala)

QUERY "requeijao scala"           -> 1.id=130 Requeijao Scala
                                     2.id=118 Requeijao Scala Bisnaga 1,5kg (PASSA)

QUERY "parmesao scala"            -> 1.id=127 Parmesao Scala (PASSA)

QUERY "pizza"                     -> 1.id=92  Embalagem de Pizza
                                     2.id=206 Farinha Especial Pizza
                                     3.id=44  Molho de Pizza Predilecta
                                     4.id=217 Cheddar D'Allora (desc:"para pizzas")
                                     5.id=117 D'Allora Requeijao (desc:"para pizzas")
                                     (PASSA — descricao entra no scoring)

QUERY "perdigao"  e "perdigão"    -> resultados IDENTICOS (top 5 igual) (PASSA)

QUERY "heineken" / "ainequen"     -> Cervejas Heineken (PASSA)

QUERY "presunto perdigao"         -> id=109 Presunto Perdigao (PASSA — nao puxa apresuntado)
QUERY "apresuntado perdigao"      -> id=103 Apresuntado Perdigao (PASSA)

QUERY "bacon sadia"               -> id=134 Bacon Sadia (PASSA)
QUERY "calabresa sadia"           -> id=138 Calabresa Sadia (PASSA)
QUERY "cream cheese scala"        -> id=114 Cream Cheese Scala Bis 1,2kg (PASSA)

DITADO "quero 2 kg de presunto sadia e uma batata mccain"
  -> qty=2 unit=kg "presunto sadia" -> Presunto Cozido Sadia
  -> qty=1 unit=-  "batata mccain"  -> Batata McCain

DITADO "3 pacotes de catupiri scala mais 1 requeijao scala"
  -> qty=3 unit=pacotes "catupiri scala" -> NENHUM (correto)
  -> qty=1 unit=-       "requeijao scala" -> Requeijao Scala Bisnaga 1,5kg

DITADO "queria um nescal e um tody"
  -> qty=1 "nescal" -> Nescau 370g Nestle (sinonimo)
  -> qty=1 "tody"   -> Toddy 370g (sinonimo)
===============================================================
*/
