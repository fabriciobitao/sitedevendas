#!/usr/bin/env node
// Agrega pedidos e escreve ranking em config/topProducts.
// Uso: node scripts/compute-top-products.cjs [--limit 10]

const admin = require('firebase-admin');
const path = require('path');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
const key = require(keyPath);

admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  if (i >= 0 && args[i + 1]) return args[i + 1];
  return fallback;
};

const LIMIT = parseInt(getArg('--limit', '10'), 10);

(async () => {
  console.log('Lendo pedidos...');
  const snap = await db.collection('orders').get();
  console.log(`${snap.size} pedidos encontrados.`);

  const counter = new Map();

  for (const doc of snap.docs) {
    const data = doc.data();
    if (!Array.isArray(data.items)) continue;
    for (const item of data.items) {
      if (!item?.productId) continue;
      const key = String(item.productId);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const existing = counter.get(key) || { productId: item.productId, name: item.name, orders: 0, totalQty: 0 };
      existing.orders += 1;
      existing.totalQty += qty;
      existing.name = item.name || existing.name;
      counter.set(key, existing);
    }
  }

  const ranked = Array.from(counter.values())
    .sort((a, b) => b.orders - a.orders || b.totalQty - a.totalQty)
    .slice(0, LIMIT)
    .map((p, idx) => ({ ...p, rank: idx + 1 }));

  console.log(`\nTop ${LIMIT} produtos:`);
  ranked.forEach((p) => {
    console.log(`  ${p.rank}. ${p.name} — ${p.orders} pedidos, ${p.totalQty} unidades`);
  });

  await db.collection('config').doc('topProducts').set({
    items: ranked,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    totalOrders: snap.size,
  });

  console.log('\n✅ Gravado em config/topProducts');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
