// Inspeciona produtos relevantes para debug da busca por voz
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
initializeApp({ credential: cert(serviceAccount), projectId: 'friosof' });
const db = getFirestore();

(async () => {
  const snap = await db.collection('products').get();
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`Total produtos: ${all.length}\n`);

  const terms = ['scala', 'catupiry', 'catupiri', 'requeijao', 'requeijão', 'parmesao', 'parmesão'];
  for (const t of terms) {
    const tLower = t.toLowerCase();
    const hits = all.filter(p =>
      (p.name || '').toLowerCase().includes(tLower) ||
      (p.description || '').toLowerCase().includes(tLower) ||
      (p.subcategory || '').toLowerCase().includes(tLower)
    );
    console.log(`\n=== "${t}" (${hits.length} produtos) ===`);
    hits.forEach(p => {
      console.log(`  name="${p.name}" | sub="${p.subcategory}" | desc="${(p.description || '').slice(0, 80)}"`);
    });
  }
  process.exit(0);
})();
