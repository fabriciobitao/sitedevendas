// Deleta um cliente (Auth + Firestore) pelo nome ou email
// Uso: GOOGLE_APPLICATION_CREDENTIALS=scripts/serviceAccountKey.json node scripts/delete-customer.cjs "Luana"

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'friosof',
});

const db = getFirestore();
const auth = getAuth();

async function findAndDelete(query) {
  const snap = await db.collection('customers').get();
  const matches = [];
  snap.forEach(doc => {
    const d = doc.data();
    const nome = (d.nomeResponsavel || d.nomeFantasia || '').toLowerCase();
    const email = (d.email || '').toLowerCase();
    const q = query.toLowerCase();
    if (nome.includes(q) || email.includes(q)) {
      matches.push({ uid: doc.id, email: d.email, nome: d.nomeResponsavel || d.nomeFantasia });
    }
  });

  if (matches.length === 0) {
    console.log(`Nenhum cliente encontrado com "${query}"`);
    process.exit(1);
  }

  console.log(`Clientes encontrados (${matches.length}):`);
  matches.forEach(m => console.log(`  - ${m.nome} / ${m.email} / uid=${m.uid}`));

  for (const m of matches) {
    try {
      await db.collection('customers').doc(m.uid).delete();
      console.log(`  Firestore deletado: ${m.uid}`);
    } catch (e) {
      console.log(`  Falha Firestore ${m.uid}:`, e.message);
    }
    try {
      await auth.deleteUser(m.uid);
      console.log(`  Auth deletado: ${m.uid}`);
    } catch (e) {
      console.log(`  Falha Auth ${m.uid}:`, e.message);
    }
  }

  console.log('Concluido.');
}

const query = process.argv[2];
if (!query) {
  console.error('Uso: node scripts/delete-customer.cjs "nome ou email"');
  process.exit(1);
}

findAndDelete(query).then(() => process.exit(0));
