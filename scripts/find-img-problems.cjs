const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('products').get();
  const matches = [];
  snap.forEach((doc) => {
    const p = doc.data();
    const name = (p.name || '').toLowerCase();
    if (name.includes('sacola') || name.includes('farinha')) {
      matches.push({ id: doc.id, name: p.name, image: p.image });
    }
  });
  console.log(`\n=== PRODUTOS SACOLA/FARINHA (${matches.length}) ===`);
  matches.forEach((m) => {
    console.log(`\n${m.name}`);
    console.log(`  image: ${m.image?.substring(0, 130)}${m.image?.length > 130 ? '...' : ''}`);
    console.log(`  length: ${m.image?.length || 0}`);
    console.log(`  kind: ${m.image?.startsWith('data:') ? 'base64' : m.image?.startsWith('/') ? 'local' : m.image?.startsWith('http') ? 'external' : 'unknown'}`);
  });
  process.exit(0);
})();
