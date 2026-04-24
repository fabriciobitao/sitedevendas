// Popula a colecao login_index a partir de customers existentes.
// Cada cliente ganha 2 docs (codigoCliente + telefone) apontando para { email, uid }.
// Uso: GOOGLE_APPLICATION_CREDENTIALS=scripts/serviceAccountKey.json node scripts/seed-login-index.cjs

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
initializeApp({ credential: cert(serviceAccount), projectId: 'friosof' });
const db = getFirestore();

const digitsOnly = (s) => String(s || '').replace(/\D/g, '');

(async () => {
  const snap = await db.collection('customers').get();
  console.log(`Customers encontrados: ${snap.size}`);

  let created = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const c = doc.data();
    const uid = doc.id;
    const email = c.email;
    if (!email) {
      console.log(`  [SKIP] ${uid} sem email`);
      skipped++;
      continue;
    }

    const payload = { email, uid, updatedAt: new Date() };

    if (c.codigoCliente) {
      const codKey = String(c.codigoCliente).padStart(4, '0');
      await db.collection('login_index').doc(codKey).set(payload, { merge: true });
      console.log(`  codigo ${codKey} -> ${email}`);
      created++;
    }

    if (c.telefone) {
      const telKey = digitsOnly(c.telefone);
      if (telKey.length >= 10) {
        await db.collection('login_index').doc(telKey).set(payload, { merge: true });
        console.log(`  telefone ${telKey} -> ${email}`);
        created++;
      }
    }
  }

  console.log(`\nConcluido. docs criados: ${created}, skipped: ${skipped}`);
  process.exit(0);
})();
