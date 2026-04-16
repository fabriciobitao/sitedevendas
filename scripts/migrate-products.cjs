/**
 * Migra produtos de src/data/products.js para Firestore (colecao 'products')
 *
 * Uso: node scripts/migrate-products.cjs
 *
 * Requer: firebase-admin instalado (ja esta no package.json)
 * Requer: Service account key em scripts/serviceAccountKey.json
 *   -> Baixar de: Firebase Console > Project Settings > Service Accounts > Generate New Private Key
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// --- Carregar service account ---
const saPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(saPath)) {
  console.error('\n  ERRO: Arquivo serviceAccountKey.json nao encontrado em scripts/');
  console.error('  Baixe de: Firebase Console > Project Settings > Service Accounts > Generate New Private Key');
  console.error('  Salve como: scripts/serviceAccountKey.json\n');
  process.exit(1);
}

const serviceAccount = require(saPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// --- Carregar produtos do arquivo estatico ---
// products.js usa export const, precisamos extrair manualmente
const productsFilePath = path.join(__dirname, '..', 'src', 'data', 'products.js');
const fileContent = fs.readFileSync(productsFilePath, 'utf-8');

// Extrair o array de products
const productsMatch = fileContent.match(/export const products\s*=\s*\[([\s\S]*?)\n\];/);
if (!productsMatch) {
  console.error('ERRO: Nao foi possivel encontrar "export const products" no arquivo');
  process.exit(1);
}

// Extrair categories tambem
const categoriesMatch = fileContent.match(/export const categories\s*=\s*\[([\s\S]*?)\n\];/);

// Extrair subcategories
const subcategoriesMatch = fileContent.match(/export const subcategories\s*=\s*\{([\s\S]*?)\n\};/);

// Avaliar os dados usando Function constructor (mais seguro que eval)
let products, categories, subcategories;

try {
  // Remover comentarios de linha do conteudo dos products
  const cleanProductsContent = productsMatch[1]
    .replace(/\/\/.*$/gm, '') // remover comentarios //
    .replace(/,\s*$/, '');     // remover virgula final

  products = new Function(`return [${cleanProductsContent}]`)();
  console.log(`  Encontrados ${products.length} produtos no arquivo estatico`);
} catch (e) {
  console.error('ERRO ao parsear produtos:', e.message);
  process.exit(1);
}

try {
  if (categoriesMatch) {
    const cleanCatContent = categoriesMatch[1].replace(/\/\/.*$/gm, '');
    categories = new Function(`return [${cleanCatContent}]`)();
    console.log(`  Encontradas ${categories.length} categorias`);
  }
} catch (e) {
  console.warn('AVISO: Nao foi possivel parsear categorias:', e.message);
}

try {
  if (subcategoriesMatch) {
    const cleanSubContent = subcategoriesMatch[1].replace(/\/\/.*$/gm, '');
    subcategories = new Function(`return {${cleanSubContent}}`)();
    console.log(`  Encontradas subcategorias para: ${Object.keys(subcategories).join(', ')}`);
  }
} catch (e) {
  console.warn('AVISO: Nao foi possivel parsear subcategorias:', e.message);
}

// --- Migrar para Firestore ---
async function migrate() {
  console.log('\n  Iniciando migracao...\n');

  const batch = db.batch();
  const productsRef = db.collection('products');

  // Primeiro, verificar se ja existem produtos
  const existingSnap = await productsRef.limit(1).get();
  if (!existingSnap.empty) {
    console.log('  AVISO: Colecao "products" ja contem documentos.');
    console.log('  Deseja limpar e recriar? (os dados existentes serao apagados)');
    console.log('  Para confirmar, rode: node scripts/migrate-products.cjs --force\n');

    if (!process.argv.includes('--force')) {
      process.exit(0);
    }

    // Limpar colecao existente
    console.log('  Limpando colecao existente...');
    const allDocs = await productsRef.get();
    const deleteBatch = db.batch();
    allDocs.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log(`  ${allDocs.size} documentos removidos.\n`);
  }

  // Inserir produtos com campo order baseado na posicao no array
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const docRef = productsRef.doc(); // auto-generated ID

    const productData = {
      name: product.name,
      description: product.description || '',
      category: product.category,
      subcategory: product.subcategory,
      price: product.price !== null && product.price !== undefined ? product.price : null,
      unit: product.unit || 'un',
      image: product.image || '',
      order: i, // posicao no array original
      legacyId: product.id, // manter referencia ao ID antigo
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, productData);

    // Firestore batch suporta max 500 operacoes
    if ((i + 1) % 450 === 0) {
      await batch.commit();
      console.log(`  ... ${i + 1} produtos migrados`);
    }
  }

  // Commit batch final
  await batch.commit();
  console.log(`\n  SUCESSO! ${products.length} produtos migrados para Firestore.`);

  // Salvar categorias e subcategorias como documento de metadata
  if (categories || subcategories) {
    const metaRef = db.collection('config').doc('catalog');
    await metaRef.set({
      categories: categories || [],
      subcategories: subcategories || {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('  Metadata de categorias/subcategorias salva em config/catalog');
  }

  console.log('\n  Migracao concluida!\n');
  process.exit(0);
}

migrate().catch(err => {
  console.error('ERRO na migracao:', err);
  process.exit(1);
});
