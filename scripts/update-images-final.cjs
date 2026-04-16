/**
 * Script final para atualizar imagens de produtos no Firestore.
 *
 * Acoes:
 * 1. Corrigir Queijo Mussarela Salvador (base64 -> /images/salvador.webp)
 * 2. Migrar 13 produtos de /produtos/ para /images/
 * 3. Criar produto novo: Petisco de Tilapia CVale 500g
 *
 * NUNCA deleta documentos. Apenas UPDATE e ADD.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function main() {
  const batch = db.batch();
  let updateCount = 0;
  let createCount = 0;

  // =====================================================
  // 1. FIX: Queijo Mussarela Salvador - base64 -> local
  // =====================================================
  const salvadorRef = db.collection('products').doc('mNV20OyxZ0mEpnAlshFU');
  batch.update(salvadorRef, { image: '/images/salvador.webp' });
  updateCount++;
  console.log('UPDATE: Queijo Mussarela Salvador -> /images/salvador.webp');

  // =====================================================
  // 2. MIGRATE: /produtos/ paths -> /images/ paths
  // =====================================================
  const produtosMigrations = [
    { id: 'TsMZPNpUJmdKHes9ODXT', name: 'Alho Frito 500g', newImage: '/images/alho-frito.jpeg' },
    { id: '9s4c6Khi5EHR2Jpevstn', name: 'Alho Triturado Balde', newImage: '/images/alho-triturado-balde.webp' },
    { id: '8N3mxsHLozkqJYbm7Qk5', name: 'Atum Ralado Chicharro lata 410g Randy', newImage: '/images/atum-chicharro.jpg' },
    { id: '1r7aUQHvHjjyFmhuUo1R', name: 'Azeitona Verde sem Caroco Balde 2kg', newImage: '/images/azeitona-sem-caroco.webp' },
    { id: 'NM45t25ApLBi2EteJDvy', name: 'Azeitona com Caroco Grauda Balde 2kg', newImage: '/images/azeitona-com-caroco.webp' },
    { id: '92JdKwogWnTcs3xU9OWF', name: 'Azeitona com Caroco Miuda Balde 2kg', newImage: '/images/azeitona-com-caroco.webp' },
    { id: '7X6CqjHl6gukE1zbaIVd', name: 'Azeitona Preta Fatiada Balde 2kg', newImage: '/images/azeitona-preta-fatiada.webp' },
    { id: 'SIMGRp3EM3vR1aBJw3eU', name: 'Azeitona Fatiada Balde 2kg', newImage: '/images/azeitona-fatiada.webp' },
    { id: 'j0xJmkJQwQYbd9QqeXxo', name: 'Azeitona de Fita Cart. 10un', newImage: '/images/azeitona-de-fita.webp' },
    { id: '9Ao3j5b2OMCawJDp2TiX', name: 'Batata Palha', newImage: '/images/batata-palha.jpg' },
    { id: 'RICxvxtWMVEVm5SHGJLi', name: 'Ketchup Galao Cepera', newImage: '/images/ketchup-cepera.webp' },
    { id: 'hUWrhYuwclPf8TOPEm4e', name: 'Ketchup Galao Predilecta', newImage: '/images/ketchup-predilecta.webp' },
    { id: 'htPSjqH2xjmjFXfkaO0O', name: 'Champignon Fatiado Balde', newImage: '/images/champignon-fatiado.jpg' },
  ];

  for (const m of produtosMigrations) {
    const ref = db.collection('products').doc(m.id);
    batch.update(ref, { image: m.newImage });
    updateCount++;
    console.log(`UPDATE: ${m.name} -> ${m.newImage}`);
  }

  // =====================================================
  // 3. CREATE: Petisco de Tilapia CVale 500g
  // =====================================================
  const newProductRef = db.collection('products').doc();
  batch.set(newProductRef, {
    name: 'Petisco de Tilapia CVale 500g',
    category: 'Congelados',
    subcategory: 'Peixes e Frutos do Mar',
    image: '/images/isca-tilapia.png',
    unit: 'un',
    description: 'Petisco de tilapia CVale congelado, pacote 500g — pratico e saboroso',
    price: null,
    active: true
  });
  createCount++;
  console.log('CREATE: Petisco de Tilapia CVale 500g -> /images/isca-tilapia.png');

  // =====================================================
  // COMMIT
  // =====================================================
  console.log(`\nCommitting batch: ${updateCount} updates + ${createCount} creates...`);
  await batch.commit();
  console.log('Batch committed successfully!');

  // =====================================================
  // VERIFY
  // =====================================================
  console.log('\n=== VERIFICATION ===');
  const snapshot = await db.collection('products').get();
  let total = 0;
  let withLocalImage = 0;
  let withExternalUrl = 0;
  let withBase64 = 0;
  let withOldPath = 0;
  let noImage = 0;

  snapshot.forEach(doc => {
    total++;
    const img = doc.data().image || '';
    if (!img || img.length === 0) noImage++;
    else if (img.startsWith('data:')) withBase64++;
    else if (img.startsWith('/produtos/')) withOldPath++;
    else if (img.startsWith('/images/')) withLocalImage++;
    else if (img.startsWith('http')) withExternalUrl++;
  });

  console.log(`Total products: ${total}`);
  console.log(`Local /images/: ${withLocalImage}`);
  console.log(`External URLs: ${withExternalUrl}`);
  console.log(`Base64: ${withBase64}`);
  console.log(`Old /produtos/: ${withOldPath}`);
  console.log(`No image: ${noImage}`);

  // List any remaining issues
  if (withBase64 > 0 || withOldPath > 0 || noImage > 0) {
    console.log('\n=== REMAINING ISSUES ===');
    snapshot.forEach(doc => {
      const d = doc.data();
      const img = d.image || '';
      if (!img || img.startsWith('data:') || img.startsWith('/produtos/')) {
        console.log(`  ${doc.id} | ${d.name} | image: ${img ? img.substring(0, 50) : 'NONE'}`);
      }
    });
  }
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
