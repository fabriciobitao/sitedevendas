// ============================================================
// Seed: 2 anos de pedidos simulados para fabiomenezes@gmail.com
// ~48 pedidos (1 a cada ~15 dias) de Abril/2024 a Abril/2026
// Padrao de restaurante: produtos frequentes com variacao
// ============================================================

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Usa credenciais de aplicacao padrao (gcloud auth)
initializeApp({ projectId: 'friosof' });
const db = getFirestore();

const CUSTOMER_ID = '3oVW4rml3Iagfv3b0L6Oca5WMXH3';
const CUSTOMER_NAME = 'Fábio Menezes';
const CUSTOMER_DOC = '';

// Produtos do catalogo com frequencia de pedido (peso)
// peso alto = pedido quase sempre, peso baixo = esporadico
const CATALOG = [
  { id: 1,  name: 'Açúcar Refinado União 10/1kg', price: 48.50, unit: 'fardo', weight: 90, qtyRange: [2, 8] },
  { id: 4,  name: 'Alho Frito 500g',               price: null,  unit: 'un',    weight: 70, qtyRange: [3, 10] },
  { id: 5,  name: 'Alho Triturado',                price: null,  unit: 'un',    weight: 60, qtyRange: [2, 6] },
  { id: 6,  name: 'Atum Ralado Chicharro 410g',    price: null,  unit: 'un',    weight: 30, qtyRange: [5, 20] },
  { id: 8,  name: 'Azeitona Chileninha',            price: null,  unit: 'un',    weight: 40, qtyRange: [2, 8] },
  { id: 9,  name: 'Azeitona de Fita',               price: null,  unit: 'un',    weight: 35, qtyRange: [1, 5] },
  { id: 10, name: 'Azeitona Ecodil Balde',          price: null,  unit: 'un',    weight: 50, qtyRange: [1, 3] },
  { id: 11, name: 'Azeitona Fatiada',               price: null,  unit: 'un',    weight: 65, qtyRange: [2, 6] },
  { id: 12, name: 'Azeitona Preta Fatiada',         price: null,  unit: 'un',    weight: 45, qtyRange: [1, 4] },
  { id: 14, name: 'Azeitona Verde sem Caroço',      price: null,  unit: 'un',    weight: 55, qtyRange: [2, 8] },
  { id: 16, name: 'Batata Palha',                   price: null,  unit: 'un',    weight: 75, qtyRange: [5, 15] },
  { id: 17, name: 'Catchup',                        price: null,  unit: 'un',    weight: 80, qtyRange: [2, 6] },
  { id: 18, name: 'Catchup Cepera',                 price: null,  unit: 'un',    weight: 25, qtyRange: [1, 4] },
  { id: 20, name: 'Champignon Fatiado Balde',       price: null,  unit: 'un',    weight: 20, qtyRange: [1, 3] },
  { id: 21, name: 'Ervilha 2kg',                    price: null,  unit: 'un',    weight: 50, qtyRange: [1, 4] },
  { id: 22, name: 'Ervilha 200g Predilecta',        price: null,  unit: 'un',    weight: 40, qtyRange: [6, 24] },
  { id: 23, name: 'Gordura Vegetal 15kg Coamo',     price: null,  unit: 'un',    weight: 60, qtyRange: [1, 2] },
  { id: 24, name: 'Farinha de Trigo Coamo',         price: null,  unit: 'un',    weight: 85, qtyRange: [3, 10] },
  { id: 25, name: 'Leite Condensado 395g Italac',   price: null,  unit: 'un',    weight: 55, qtyRange: [6, 24] },
  { id: 27, name: 'Leite Integral Cooper Rita',     price: null,  unit: 'un',    weight: 70, qtyRange: [10, 30] },
  { id: 29, name: 'Maionese Balde Saúde',           price: null,  unit: 'un',    weight: 65, qtyRange: [1, 3] },
  { id: 32, name: "Maionese Hellmann's 500g",       price: null,  unit: 'un',    weight: 50, qtyRange: [3, 10] },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrder(date) {
  // Selecionar produtos: cada produto entra com probabilidade = weight%
  const items = [];
  for (const prod of CATALOG) {
    if (Math.random() * 100 < prod.weight) {
      const qty = rand(prod.qtyRange[0], prod.qtyRange[1]);
      items.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        unit: prod.unit,
        quantity: qty,
        subtotal: prod.price ? prod.price * qty : null,
      });
    }
  }

  // Garantir pelo menos 3 itens
  while (items.length < 3) {
    const prod = CATALOG[rand(0, CATALOG.length - 1)];
    if (!items.find(i => i.productId === prod.id)) {
      const qty = rand(prod.qtyRange[0], prod.qtyRange[1]);
      items.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        unit: prod.unit,
        quantity: qty,
        subtotal: prod.price ? prod.price * qty : null,
      });
    }
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.subtotal || 0), 0);
  const hasItemsWithoutPrice = items.some(i => i.price == null);

  return {
    customerId: CUSTOMER_ID,
    customerName: CUSTOMER_NAME,
    customerCnpj: CUSTOMER_DOC,
    items,
    totalItems,
    totalPrice,
    hasItemsWithoutPrice,
    status: 'enviado',
    whatsappSent: true,
    createdAt: Timestamp.fromDate(date),
  };
}

async function seed() {
  const startDate = new Date('2024-04-10T10:00:00');
  const endDate = new Date('2026-04-10T18:00:00');
  const intervalDays = 15;

  const orders = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    // Variacao de +/- 3 dias para parecer natural
    const jitter = rand(-3, 3);
    const orderDate = new Date(current);
    orderDate.setDate(orderDate.getDate() + jitter);

    // Hora aleatoria entre 8h e 18h
    orderDate.setHours(rand(8, 18), rand(0, 59), rand(0, 59));

    orders.push(generateOrder(orderDate));

    current.setDate(current.getDate() + intervalDays);
  }

  console.log(`Gerando ${orders.length} pedidos...`);
  console.log(`Periodo: ${startDate.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`);

  // Batch write (max 500 por batch no Firestore)
  const batch = db.batch();
  for (const order of orders) {
    const ref = db.collection('orders').doc();
    batch.set(ref, order);
  }

  await batch.commit();
  console.log(`${orders.length} pedidos inseridos com sucesso!`);

  // Estatisticas
  const totalItens = orders.reduce((s, o) => s + o.totalItems, 0);
  const avgItems = (totalItens / orders.length).toFixed(1);
  console.log(`Media de ${avgItems} itens por pedido`);
  console.log(`Total de itens movimentados: ${totalItens}`);
}

seed().catch(console.error);
