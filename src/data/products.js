// ============================================================
// Catálogo de Produtos — Frios Ouro Fino
// Distribuidora atacado de alimentos
// ============================================================

export const categories = [
  {
    id: 'secos',
    name: 'Secos',
    icon: '📦',
    color: '#E8AB1D',
    description: 'Bebidas, mercearia e produtos de longa validade',
  },
  {
    id: 'resfriados',
    name: 'Resfriados',
    icon: '❄️',
    color: '#D44D2D',
    description: 'Frios, laticínios e produtos refrigerados com qualidade garantida',
  },
  {
    id: 'congelados',
    name: 'Congelados',
    icon: '🧊',
    color: '#2D7DD4',
    description: 'Carnes, aves, peixes e alimentos congelados para seu negócio',
  },
];

export const subcategories = {
  Resfriados: [
    'Presuntos',
    'Queijos',
    'Mortadelas',
    'Apresuntados',
    'Iogurtes',
    'Requeijão',
    'Manteiga e Margarina',
    'Cream Cheese',
    'Leite',
    'Bebida Láctea',
    'Salames e Embutidos',
    'Peito de Peru',
    'Creme de Leite',
  ],
  Congelados: [
    'Aves',
    'Bovinos',
    'Suínos',
    'Linguiças',
    'Hambúrguer',
    'Empanados',
    'Peixes e Frutos do Mar',
    'Pizzas',
    'Batatas Congeladas',
    'Polpas de Fruta',
    'Sorvetes',
    'Açaí',
    'Vegetais Congelados',
  ],
  Secos: [
    'Cervejas',
    'Refrigerantes',
    'Sucos',
    'Águas',
    'Energéticos',
    'Biscoitos',
    'Macarrão',
    'Arroz',
    'Feijão',
    'Óleos',
    'Farinhas',
    'Açúcar',
    'Café',
    'Leite em Pó',
    'Molhos e Condimentos',
    'Enlatados',
    'Conservas',
    'Snacks',
    'Carnes Secas',
  ],
};

export const products = [
  // ============================================================
  //  SECOS
  // ============================================================

  // --- Açúcar ---
  { id: 1, name: 'Açúcar Refinado União 10/1kg', category: 'Secos', subcategory: 'Açúcar', price: 48.50, unit: 'fardo', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1140918/g.jpg?v=639076962153600000', description: 'Fardo com 10 pacotes de 1kg' },

  // --- Molhos e Condimentos ---
  { id: 4, name: 'Alho Frito 500g', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1615477550927-6ec8445b6985?w=400&h=400&fit=crop&q=80', description: 'Alho frito crocante, pacote 500g' },
  { id: 5, name: 'Alho Triturado', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1615477550927-6ec8445b6985?w=400&h=400&fit=crop&q=80', description: 'Alho triturado pronto para uso, pote' },

  // --- Enlatados ---
  { id: 6, name: 'Atum Ralado Chicharro lata 410g Randy', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&h=400&fit=crop&q=80', description: 'Atum ralado tipo chicharro, lata 410g marca Randy' },

  // --- Conservas (Azeitonas) ---
  { id: 8, name: 'Azeitona Chileninha', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona chileninha preta, tipo portuguesa' },
  { id: 9, name: 'Azeitona de Fita', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona verde de fita em conserva' },
  { id: 10, name: 'Azeitona Ecodil Balde', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona verde Ecodil, balde grande para atacado' },
  { id: 11, name: 'Azeitona Fatiada', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona verde fatiada, pronta para uso em pizzas e saladas' },
  { id: 12, name: 'Azeitona Preta Fatiada', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona preta fatiada em conserva' },
  { id: 14, name: 'Azeitona Verde sem Caroço', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80', description: 'Azeitona verde sem caroço em conserva' },

  // --- Snacks ---
  { id: 16, name: 'Batata Palha', category: 'Secos', subcategory: 'Snacks', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=400&fit=crop&q=80', description: 'Batata palha crocante e saborosa' },

  // --- Molhos e Condimentos (continuação) ---
  { id: 17, name: 'Catchup', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0a7e6?w=400&h=400&fit=crop&q=80', description: 'Catchup galão, tamanho institucional' },
  { id: 18, name: 'Catchup Cepera', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0a7e6?w=400&h=400&fit=crop&q=80', description: 'Catchup Cepera, garrafa tradicional' },

  // --- Conservas (continuação) ---
  { id: 20, name: 'Champignon Fatiado Balde', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400&h=400&fit=crop&q=80', description: 'Cogumelos champignon fatiados em conserva, balde' },
  { id: 21, name: 'Ervilha 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80', description: 'Ervilha em conserva Predilecta, balde 2kg' },
  { id: 22, name: 'Ervilha 200g Predilecta', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80', description: 'Ervilha em conserva Predilecta, lata 200g' },

  // --- Óleos (continuação) ---
  { id: 23, name: 'Gordura Vegetal 15kg Coamo', category: 'Secos', subcategory: 'Óleos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80', description: 'Gordura vegetal Coamo Fry, balde 15kg' },

  // --- Farinhas ---
  { id: 24, name: 'Farinha de Trigo Coamo', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&q=80', description: 'Farinha de trigo Coamo, pacote' },

  // --- Enlatados (continuação) ---
  { id: 25, name: 'Leite Condensado 395g Italac', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80', description: 'Leite condensado Italac, lata 395g' },
  // --- Leite em Pó ---
  { id: 27, name: 'Leite Integral Cooper Rita', category: 'Secos', subcategory: 'Leite em Pó', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80', description: 'Leite integral UHT Cooper Rita, caixa 1 litro' },

  // --- Molhos e Condimentos (maioneses) ---
  { id: 29, name: 'Maionese Balde Saúde', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Maionese Saúde, balde tamanho institucional' },
  { id: 32, name: "Maionese Hellmann's 500g", category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: "Maionese Hellmann's tradicional, pote 500g" },
];
