const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
initializeApp({ credential: cert(serviceAccount), projectId: 'friosof' });
const db = getFirestore();

(async () => {
  const snap = await db.collection('customers').get();
  console.log(`Total customers: ${snap.size}`);
  snap.forEach(d => {
    const x = d.data();
    console.log(`  ${x.codigoCliente || '????'} - ${x.nomeResponsavel || x.nomeFantasia || '—'} (${x.email})`);
  });
  process.exit(0);
})();
