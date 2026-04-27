const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
initializeApp({ credential: cert(serviceAccount), projectId: 'friosof' });
const db = getFirestore();

(async () => {
  // login_index uses phone digits as doc id - direct lookup, 1 read
  const candidates = ['35992031944', '992031944', '3599203194'];
  for (const k of candidates) {
    const snap = await db.collection('login_index').doc(k).get();
    console.log(`login_index/${k}: ${snap.exists ? 'EXISTS' : 'not found'}`);
    if (snap.exists) console.log(JSON.stringify(snap.data(), null, 2));
  }
  process.exit(0);
})();
