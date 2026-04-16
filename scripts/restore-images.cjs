// Script to update ALL Firestore product image fields to local paths
// and fix the Queijo Mussarela Salvador base64 monstrosity
const admin = require('firebase-admin');
const sa = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();

  console.log(`Found ${snapshot.size} products in Firestore`);

  // Map of product names/IDs to their correct local image paths
  // This covers ALL products that should have local images
  const imageUpdates = {
    // === BOVINOS ===
    'Acem': '/images/acem.jpg',
    'Acem cx ~20kg': '/images/acem.jpg',
    'Contra File': '/images/contra-file.jpeg',
    'Contra File cx ~20kg': '/images/contra-file.jpeg',
    'Costela Desfiada Bovina pct 1kg': '/images/costela-desfiada-quali.jpg',
    'Costela Minga': '/images/costela-minga.png',
    'Costela Minga cx ~20kg': '/images/costela-minga.png',
    'Cubos Bovinos pct 2kg': '/images/cubos-bovino.jpeg',
    'Cubos Bovinos Frasao': '/images/cubos-frasao.png',
    'Cupim': '/images/cupim.png',
    'Cupim cx ~20kg': '/images/cupim.png',
    'Figado Bovino': '/images/figado-bovino.png',
    'Figado Bovino cx ~20kg': '/images/figado-bovino.png',
    'File Mignon': '/images/file-mignon.png',
    'File Mignon cx ~20kg': '/images/file-mignon.png',
    'Fraldinha': '/images/fraldinha.webp',
    'Fraldinha cx ~20kg': '/images/fraldinha.webp',
    'Lagarto': '/images/lagarto.webp',
    'Lagarto cx ~20kg': '/images/lagarto.webp',
    'Carne Moida': '/images/carne-moida.png',
    'Carne Moida cx ~20kg': '/images/carne-moida.png',
    'Ponta de Peito': '/images/ponta-de-peito.webp',
    'Ponta de Peito cx ~20kg': '/images/ponta-de-peito.webp',
    'Costelinha de Porco': '/images/costelinha-porco.jpg',

    // === AVES ===
    'Asa de Frango cx 20kg': '/images/asa-frango-cx20kg.jpg',
    'Coxa e Sobrecoxa de Frango cx 20kg': '/images/coxa-sobrecoxa-cx20kg.webp',
    'File de Peito de Frango cx 20kg': '/images/file-peito-cx20kg.webp',
    'Meio da Asa (Tulipa) cx 20kg': '/images/meio-asa-tulipa-cx20kg.jpg',
    'Peito de Frango com Osso cx 20kg': '/images/peito-com-osso-cx20kg.jpg',
    'Filezinho Sassami IQF pct 1kg': '/images/filezinho-sassami-cvale.png',
    'File de Coxa e Sobrecoxa': '/images/file-coxa-sobrecoxa.png',
    'Frango Congelado Inteiro': '/images/frango-inteiro.webp',

    // === EMPANADOS ===
    'Chicken Cvale pct 2,5kg': '/images/chicken-cvale-2-5kg.png',
    'File Empanado Cvale pct 2,5kg': '/images/file-empanado-cvale-2-5kg.png',
    'Steak Empanado': '/images/steak.jpg',
    'Salsicha Hot Dog Perdigao pct 5kg': '/images/salsicha-hotdog-perdigao.png',

    // === SUINOS ===
    'Bacon Fatiado': '/images/bacon-fatiado.jpg',
    'Lombo de Porco': '/images/lombo-porco.avif',
    'Pernil sem Osso': '/images/pernil.jpg',

    // === LINGUICAS ===
    'Linguica Toscana de Pernil': '/images/linguica-saudali.png',
    'Linguica Toscana Nobre pct 700g': '/images/toscana-nobre.webp',
    'Linguica Toscana Na Brasa Perdigao 5kg': '/images/na-brasa.jpg',

    // === PEIXES ===
    'File de Tilapia': '/images/tilapia.png',
    'File de Tilapia Cvale 800g': '/images/tilapia-cvale.jpg',
    'Peixe Panga': '/images/panga.jpg',

    // === HAMBURGER ===
    'Hamburger Aurora 56g cx com 36un': '/images/hamburger-aurora.webp',
    'Hamburger Fast Burger Bovino 56g cx com 36un': '/images/hamburger-fast-burger.jpg',

    // === QUEIJOS ===
    'Queijo Mussarela Salvador': '/images/salvador.webp',
    'Mussarela Nova Esperança - Peça': '/images/mussarela.jpeg',

    // === CONFEITARIA ===
    'Recheio Forneavel Chocolate ao Leite Harald Confeiteiro 1,010kg': '/images/confeiteiro-chocolate-ao-leite.webp',
    'Recheio Forneavel Chocolate Branco Harald Confeiteiro 1,010kg': '/images/confeiteiro-chocolate-branco.webp',

    // === REQUEIJAO ===
    'Requeijao Coper': '/images/requeijao-coper.png',
  };

  // Batch update
  let batch = db.batch();
  let updateCount = 0;
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const name = data.name;

    if (imageUpdates[name]) {
      const currentImage = data.image;
      const newImage = imageUpdates[name];

      // Only update if the image path is different
      if (currentImage !== newImage) {
        batch.update(doc.ref, { image: newImage });
        updateCount++;
        console.log(`UPDATE: "${name}" | ${currentImage ? currentImage.substring(0, 60) : 'null'} -> ${newImage}`);

        // Firestore batches limited to 500 ops
        if (updateCount % 400 === 0) {
          await batch.commit();
          batchCount++;
          console.log(`--- Batch ${batchCount} committed (${updateCount} updates so far) ---`);
          batch = db.batch();
        }
      } else {
        // Already correct
      }
    }
  }

  // Commit remaining
  if (updateCount % 400 !== 0 || updateCount === 0) {
    await batch.commit();
    batchCount++;
  }

  console.log(`\n=== DONE ===`);
  console.log(`Total products: ${snapshot.size}`);
  console.log(`Updated: ${updateCount}`);
  console.log(`Batches: ${batchCount}`);

  // Now verify - count products with local images
  const snap2 = await productsRef.get();
  let localCount = 0;
  let externalCount = 0;
  let base64Count = 0;
  let missingCount = 0;

  for (const doc of snap2.docs) {
    const img = doc.data().image;
    if (!img) {
      missingCount++;
      console.log(`MISSING IMAGE: ${doc.data().name}`);
    } else if (img.startsWith('data:')) {
      base64Count++;
      console.log(`BASE64 IMAGE (should fix): ${doc.data().name}`);
    } else if (img.startsWith('/images/')) {
      localCount++;
    } else if (img.startsWith('/produtos/')) {
      // Old static data path - these may not work
      console.log(`OLD PATH: ${doc.data().name} -> ${img}`);
      externalCount++;
    } else {
      externalCount++;
    }
  }

  console.log(`\n=== IMAGE STATS ===`);
  console.log(`Local (/images/): ${localCount}`);
  console.log(`External URLs: ${externalCount}`);
  console.log(`Base64 embedded: ${base64Count}`);
  console.log(`Missing: ${missingCount}`);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
