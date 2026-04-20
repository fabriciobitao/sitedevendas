/**
 * Busca produtos com "leite" no nome e mostra categoria/subcategoria.
 * Uso: node scripts/find-leite-coperita.cjs
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('products').get();
  const leites = [];
  const subSet = new Set();
  snap.forEach((doc) => {
    const p = doc.data();
    if (/leite/i.test(p.name || '')) {
      leites.push({ id: doc.id, name: p.name, category: p.category, subcategory: p.subcategory });
    }
    subSet.add(`${p.category} > ${p.subcategory}`);
  });
  console.log('\n=== PRODUTOS COM "LEITE" NO NOME ===');
  leites.sort((a, b) => (a.subcategory || '').localeCompare(b.subcategory || ''));
  leites.forEach((p) => {
    console.log(`[${p.category} / ${p.subcategory}]  ${p.name}  (id: ${p.id})`);
  });

  console.log('\n=== TODAS AS SUBCATEGORIAS EXISTENTES ===');
  [...subSet].sort().forEach((s) => console.log(' -', s));

  process.exit(0);
})();
