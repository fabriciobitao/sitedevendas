// ============================================================
// Catálogo de Produtos — Frios Ouro Fino
// Distribuidora atacado de alimentos
// 210+ produtos | 3 categorias | preços realistas BRL atacado
// ============================================================

export const categories = [
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
  {
    id: 'secos',
    name: 'Secos',
    icon: '📦',
    color: '#E8AB1D',
    description: 'Bebidas, mercearia e produtos de longa validade',
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
  ],
};

export const products = [
  // ============================================================
  //  RESFRIADOS (75 produtos)
  // ============================================================

  // --- Presuntos ---
  { id: 1, name: 'Presunto Cozido Sadia', category: 'Resfriados', subcategory: 'Presuntos', price: 27.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto cozido fatiado da marca Sadia, ideal para lanches e sanduíches' },
  { id: 2, name: 'Presunto Cozido Perdigão', category: 'Resfriados', subcategory: 'Presuntos', price: 26.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto cozido Perdigão, sabor tradicional para o dia a dia' },
  { id: 3, name: 'Presunto Cozido Seara', category: 'Resfriados', subcategory: 'Presuntos', price: 25.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto cozido Seara com qualidade e sabor garantidos' },
  { id: 4, name: 'Presunto Cozido Aurora', category: 'Resfriados', subcategory: 'Presuntos', price: 24.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto cozido Aurora, excelente custo-benefício' },
  { id: 5, name: 'Presunto Parma Sadia', category: 'Resfriados', subcategory: 'Presuntos', price: 34.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto tipo Parma Sadia, curado e saboroso' },
  { id: 6, name: 'Presunto Royale Perdigão', category: 'Resfriados', subcategory: 'Presuntos', price: 32.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto premium Royale Perdigão, linha especial' },

  // --- Queijos ---
  { id: 7, name: 'Muçarela Fatiada Vigor', category: 'Resfriados', subcategory: 'Queijos', price: 38.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Muçarela fatiada Vigor, ideal para pizzarias e lanchonetes' },
  { id: 8, name: 'Muçarela Peça Polenghi', category: 'Resfriados', subcategory: 'Queijos', price: 36.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Muçarela em peça Polenghi para fatiar no estabelecimento' },
  { id: 9, name: 'Muçarela Fatiada Presidente', category: 'Resfriados', subcategory: 'Queijos', price: 35.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Muçarela fatiada Président, textura macia e sabor suave' },
  { id: 10, name: 'Queijo Prato Fatiado Vigor', category: 'Resfriados', subcategory: 'Queijos', price: 42.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo prato fatiado Vigor, perfeito para sanduíches quentes' },
  { id: 11, name: 'Queijo Prato Peça Tirolez', category: 'Resfriados', subcategory: 'Queijos', price: 40.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo prato em peça Tirolez, qualidade mineira' },
  { id: 12, name: 'Queijo Provolone Tirolez', category: 'Resfriados', subcategory: 'Queijos', price: 55.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo provolone defumado Tirolez, sabor marcante' },
  { id: 13, name: 'Queijo Parmesão Vigor', category: 'Resfriados', subcategory: 'Queijos', price: 68.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo parmesão maturado Vigor, ideal para gratinar' },
  { id: 14, name: 'Queijo Minas Frescal Tirolez', category: 'Resfriados', subcategory: 'Queijos', price: 29.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo minas frescal Tirolez, leve e saudável' },
  { id: 15, name: 'Queijo Coalho Vigor', category: 'Resfriados', subcategory: 'Queijos', price: 35.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo coalho Vigor, ideal para churrascos e grelhados' },
  { id: 16, name: 'Queijo Cheddar Polenghi', category: 'Resfriados', subcategory: 'Queijos', price: 44.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo cheddar fatiado Polenghi, sabor intenso' },
  { id: 17, name: 'Queijo Ricota Tirolez', category: 'Resfriados', subcategory: 'Queijos', price: 22.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Ricota fresca Tirolez, opção leve para dietas' },

  // --- Mortadelas ---
  { id: 18, name: 'Mortadela Bologna Sadia', category: 'Resfriados', subcategory: 'Mortadelas', price: 15.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1766844751605-08be4874fe52?w=400&h=400&fit=crop&q=80', description: 'Mortadela Bologna Sadia, a mais vendida do Brasil' },
  { id: 19, name: 'Mortadela Ouro Perdigão', category: 'Resfriados', subcategory: 'Mortadelas', price: 14.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1766844751605-08be4874fe52?w=400&h=400&fit=crop&q=80', description: 'Mortadela Ouro Perdigão, sabor clássico brasileiro' },
  { id: 20, name: 'Mortadela Seara', category: 'Resfriados', subcategory: 'Mortadelas', price: 13.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1766844751605-08be4874fe52?w=400&h=400&fit=crop&q=80', description: 'Mortadela Seara com pedaços de gordura selecionados' },
  { id: 21, name: 'Mortadela Defumada Sadia', category: 'Resfriados', subcategory: 'Mortadelas', price: 18.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1766844751605-08be4874fe52?w=400&h=400&fit=crop&q=80', description: 'Mortadela defumada Sadia, sabor especial para sanduíches' },
  { id: 22, name: 'Mortadela com Azeitona Perdigão', category: 'Resfriados', subcategory: 'Mortadelas', price: 17.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1766844751605-08be4874fe52?w=400&h=400&fit=crop&q=80', description: 'Mortadela com azeitonas Perdigão, combinação perfeita' },

  // --- Apresuntados ---
  { id: 23, name: 'Apresuntado Sadia', category: 'Resfriados', subcategory: 'Apresuntados', price: 18.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1666014314497-c98c063d0f5a?w=400&h=400&fit=crop&q=80', description: 'Apresuntado Sadia, opção econômica para o dia a dia' },
  { id: 24, name: 'Apresuntado Perdigão', category: 'Resfriados', subcategory: 'Apresuntados', price: 17.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1666014314497-c98c063d0f5a?w=400&h=400&fit=crop&q=80', description: 'Apresuntado Perdigão, sabor suave e versátil' },

  // --- Peito de Peru ---
  { id: 25, name: 'Peito de Peru Defumado Sadia', category: 'Resfriados', subcategory: 'Peito de Peru', price: 42.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1734570007722-9fcb334a0974?w=400&h=400&fit=crop&q=80', description: 'Peito de peru defumado Sadia, leve e saboroso' },
  { id: 26, name: 'Peito de Peru Perdigão', category: 'Resfriados', subcategory: 'Peito de Peru', price: 40.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1734570007722-9fcb334a0974?w=400&h=400&fit=crop&q=80', description: 'Peito de peru Perdigão, opção saudável para lanches' },
  { id: 27, name: 'Blanquet de Peru Sadia', category: 'Resfriados', subcategory: 'Peito de Peru', price: 45.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1734570007722-9fcb334a0974?w=400&h=400&fit=crop&q=80', description: 'Blanquet de peru Sadia, corte nobre e premium' },

  // --- Salames e Embutidos ---
  { id: 28, name: 'Salame Italiano Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 52.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Salame tipo italiano Sadia, curado e saboroso' },
  { id: 29, name: 'Salame Milano Perdigão', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 49.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Salame tipo Milano Perdigão, textura fina' },
  { id: 30, name: 'Salsicha Hot Dog Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 12.90, unit: 'pct 500g', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Salsicha para cachorro-quente Sadia, pacote com 12 unidades' },
  { id: 31, name: 'Salsicha Hot Dog Perdigão', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 11.90, unit: 'pct 500g', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Salsicha Perdigão para cachorro-quente, sabor clássico' },
  { id: 32, name: 'Calabresa Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 22.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Linguiça calabresa defumada Sadia, versátil na cozinha' },
  { id: 33, name: 'Calabresa Perdigão', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 21.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Calabresa Perdigão defumada, ótima para pizzas e massas' },
  { id: 34, name: 'Bacon Fatiado Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 38.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Bacon fatiado Sadia, defumado com sabor marcante' },
  { id: 35, name: 'Bacon Manta Perdigão', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 35.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Bacon em manta Perdigão para fatiar conforme necessidade' },

  // --- Iogurtes ---
  { id: 36, name: 'Iogurte Natural Nestlé', category: 'Resfriados', subcategory: 'Iogurtes', price: 8.90, unit: 'pct 170g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Iogurte natural integral Nestlé, cremoso e saudável' },
  { id: 37, name: 'Iogurte Grego Vigor', category: 'Resfriados', subcategory: 'Iogurtes', price: 5.90, unit: 'un 100g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Iogurte grego tradicional Vigor, textura cremosa' },
  { id: 38, name: 'Iogurte Morango Danone', category: 'Resfriados', subcategory: 'Iogurtes', price: 7.50, unit: 'pct 510g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Iogurte sabor morango Danone, família inteira aprova' },
  { id: 39, name: 'Iogurte Bandeja Batavo', category: 'Resfriados', subcategory: 'Iogurtes', price: 6.90, unit: 'pct 540g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Iogurte Batavo polpa, disponível em vários sabores' },
  { id: 40, name: 'Danoninho Bandeja 320g', category: 'Resfriados', subcategory: 'Iogurtes', price: 9.90, unit: 'pct 320g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Petit suisse Danoninho, favorito da garotada' },
  { id: 41, name: 'Activia Natural Danone', category: 'Resfriados', subcategory: 'Iogurtes', price: 8.50, unit: 'pct 600g', image: 'https://images.unsplash.com/photo-1719077519310-ecc29df7fad5?w=400&h=400&fit=crop&q=80', description: 'Iogurte Activia natural com probióticos para saúde intestinal' },

  // --- Requeijão ---
  { id: 42, name: 'Requeijão Cremoso Catupiry', category: 'Resfriados', subcategory: 'Requeijão', price: 12.90, unit: 'pote 200g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Requeijão cremoso original Catupiry, receita tradicional' },
  { id: 43, name: 'Requeijão Cremoso Vigor', category: 'Resfriados', subcategory: 'Requeijão', price: 8.90, unit: 'pote 200g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Requeijão cremoso Vigor, ótimo custo-benefício' },
  { id: 44, name: 'Requeijão Cremoso Polenghi', category: 'Resfriados', subcategory: 'Requeijão', price: 9.50, unit: 'pote 200g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Requeijão cremoso Polenghi, textura aveludada' },
  { id: 45, name: 'Catupiry Profissional 1kg', category: 'Resfriados', subcategory: 'Requeijão', price: 42.90, unit: 'pote 1kg', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Catupiry profissional balde 1kg, ideal para pizzarias' },

  // --- Manteiga e Margarina ---
  { id: 46, name: 'Manteiga com Sal Aviação', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 39.90, unit: 'pct 200g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Manteiga extra com sal Aviação, qualidade superior' },
  { id: 47, name: 'Manteiga sem Sal Président', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 14.90, unit: 'pct 200g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Manteiga extra sem sal Président, ideal para confeitaria' },
  { id: 48, name: 'Margarina Qualy 500g', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 8.90, unit: 'pote 500g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Margarina Qualy cremosa com sal, a mais querida do Brasil' },
  { id: 49, name: 'Margarina Doriana 500g', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 7.50, unit: 'pote 500g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Margarina Doriana cremosa, tradição na mesa do brasileiro' },
  { id: 50, name: 'Margarina Primor 500g', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 6.90, unit: 'pote 500g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Margarina Primor, econômica e versátil para o dia a dia' },
  { id: 51, name: 'Manteiga Itambé Tablete 200g', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: 12.50, unit: 'pct 200g', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&q=80', description: 'Manteiga Itambé com sal, qualidade mineira' },

  // --- Cream Cheese ---
  { id: 52, name: 'Cream Cheese Philadelphia', category: 'Resfriados', subcategory: 'Cream Cheese', price: 14.90, unit: 'pote 150g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Cream cheese original Philadelphia, referência mundial' },
  { id: 53, name: 'Cream Cheese Polenghi', category: 'Resfriados', subcategory: 'Cream Cheese', price: 11.90, unit: 'pote 150g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Cream cheese Polenghi, textura lisa e cremosa' },
  { id: 54, name: 'Cream Cheese Vigor 1kg', category: 'Resfriados', subcategory: 'Cream Cheese', price: 38.90, unit: 'pote 1kg', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Cream cheese Vigor profissional 1kg para food service' },

  // --- Leite ---
  { id: 55, name: 'Leite Integral Itambé 1L', category: 'Resfriados', subcategory: 'Leite', price: 5.90, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=400&h=400&fit=crop&q=80', description: 'Leite integral UHT Itambé, qualidade do campo à mesa' },
  { id: 56, name: 'Leite Integral Parmalat 1L', category: 'Resfriados', subcategory: 'Leite', price: 5.50, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=400&h=400&fit=crop&q=80', description: 'Leite integral UHT Parmalat, marca tradicional' },
  { id: 57, name: 'Leite Desnatado Piracanjuba 1L', category: 'Resfriados', subcategory: 'Leite', price: 5.70, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=400&h=400&fit=crop&q=80', description: 'Leite desnatado Piracanjuba, menos gordura, mesmo sabor' },
  { id: 58, name: 'Leite Integral Tirol 1L', category: 'Resfriados', subcategory: 'Leite', price: 5.30, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=400&h=400&fit=crop&q=80', description: 'Leite integral UHT Tirol, frescor do Sul do Brasil' },
  { id: 59, name: 'Leite Integral Elegê cx 12un', category: 'Resfriados', subcategory: 'Leite', price: 59.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=400&h=400&fit=crop&q=80', description: 'Caixa com 12 litros de leite integral Elegê' },

  // --- Bebida Láctea ---
  { id: 60, name: 'Bebida Láctea Nestlé Morango 1L', category: 'Resfriados', subcategory: 'Bebida Láctea', price: 6.90, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1621458472871-d8b6a409aba1?w=400&h=400&fit=crop&q=80', description: 'Bebida láctea sabor morango Nestlé, refrescante e nutritiva' },
  { id: 61, name: 'Bebida Láctea Batavo Chocolate 1L', category: 'Resfriados', subcategory: 'Bebida Láctea', price: 6.50, unit: 'un 1L', image: 'https://images.unsplash.com/photo-1621458472871-d8b6a409aba1?w=400&h=400&fit=crop&q=80', description: 'Bebida láctea sabor chocolate Batavo, irresistível' },
  { id: 62, name: 'Toddynho 200ml cx 27un', category: 'Resfriados', subcategory: 'Bebida Láctea', price: 42.90, unit: 'cx 27un', image: 'https://images.unsplash.com/photo-1621458472871-d8b6a409aba1?w=400&h=400&fit=crop&q=80', description: 'Achocolatado Toddynho caixa com 27 unidades de 200ml' },
  { id: 63, name: 'Nescau Prontinho 200ml cx 27un', category: 'Resfriados', subcategory: 'Bebida Láctea', price: 45.90, unit: 'cx 27un', image: 'https://images.unsplash.com/photo-1621458472871-d8b6a409aba1?w=400&h=400&fit=crop&q=80', description: 'Achocolatado Nescau Prontinho caixa com 27 unidades' },

  // --- Creme de Leite ---
  { id: 64, name: 'Creme de Leite Nestlé 200g', category: 'Resfriados', subcategory: 'Creme de Leite', price: 4.90, unit: 'un 200g', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Creme de leite Nestlé em caixinha, base para receitas' },
  { id: 65, name: 'Creme de Leite Piracanjuba 200g', category: 'Resfriados', subcategory: 'Creme de Leite', price: 4.50, unit: 'un 200g', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Creme de leite Piracanjuba, cremoso e versátil' },
  { id: 66, name: 'Creme de Leite Italac 200g', category: 'Resfriados', subcategory: 'Creme de Leite', price: 3.90, unit: 'un 200g', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Creme de leite Italac, opção econômica de qualidade' },
  { id: 67, name: 'Chantilly Vigor 250ml', category: 'Resfriados', subcategory: 'Creme de Leite', price: 12.90, unit: 'un 250ml', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Creme chantilly spray Vigor, pronto para usar' },

  // --- Mais queijos e frios ---
  { id: 68, name: 'Queijo Muçarela Ralada Sadia 500g', category: 'Resfriados', subcategory: 'Queijos', price: 22.90, unit: 'pct 500g', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Muçarela ralada Sadia, prática para pizzas e gratinados' },
  { id: 69, name: 'Queijo Brie Président', category: 'Resfriados', subcategory: 'Queijos', price: 89.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo brie francês Président, cremoso e sofisticado' },
  { id: 70, name: 'Queijo Gorgonzola Tirolez', category: 'Resfriados', subcategory: 'Queijos', price: 62.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=400&h=400&fit=crop&q=80', description: 'Queijo gorgonzola Tirolez, sabor forte e marcante' },
  { id: 71, name: 'Lombo Canadense Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: 48.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1768758922609-fd805f703507?w=400&h=400&fit=crop&q=80', description: 'Lombo canadense defumado Sadia, corte nobre' },
  { id: 72, name: 'Presunto Magro Peru Sadia', category: 'Resfriados', subcategory: 'Presuntos', price: 38.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1587316925366-326c1ca7b29e?w=400&h=400&fit=crop&q=80', description: 'Presunto de peru magro Sadia, opção leve e saborosa' },
  { id: 73, name: 'Leite Condensado Moça 395g', category: 'Resfriados', subcategory: 'Creme de Leite', price: 7.90, unit: 'un 395g', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Leite condensado Moça Nestlé, essencial para sobremesas' },
  { id: 74, name: 'Leite Condensado Italac 395g', category: 'Resfriados', subcategory: 'Creme de Leite', price: 5.90, unit: 'un 395g', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?w=400&h=400&fit=crop&q=80', description: 'Leite condensado Italac, excelente custo-benefício' },
  { id: 75, name: 'Requeijão Light Vigor', category: 'Resfriados', subcategory: 'Requeijão', price: 9.90, unit: 'pote 200g', image: 'https://images.unsplash.com/photo-1663447170676-99f1ec83931a?w=400&h=400&fit=crop&q=80', description: 'Requeijão light Vigor, menos gordura com mesmo sabor' },

  // ============================================================
  //  CONGELADOS (75 produtos)
  // ============================================================

  // --- Aves ---
  { id: 76, name: 'Frango Inteiro Congelado Sadia', category: 'Congelados', subcategory: 'Aves', price: 9.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Frango inteiro congelado Sadia, qualidade de granja' },
  { id: 77, name: 'Frango Inteiro Congelado Perdigão', category: 'Congelados', subcategory: 'Aves', price: 9.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Frango inteiro congelado Perdigão, sabor garantido' },
  { id: 78, name: 'Frango Inteiro Congelado Aurora', category: 'Congelados', subcategory: 'Aves', price: 8.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Frango inteiro congelado Aurora, econômico e saboroso' },
  { id: 79, name: 'Peito de Frango Congelado Sadia', category: 'Congelados', subcategory: 'Aves', price: 16.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Peito de frango congelado sem osso Sadia' },
  { id: 80, name: 'Peito de Frango Seara', category: 'Congelados', subcategory: 'Aves', price: 15.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Peito de frango congelado Seara, corte limpo' },
  { id: 81, name: 'Coxa de Frango Congelada Sadia', category: 'Congelados', subcategory: 'Aves', price: 11.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Coxa de frango congelada Sadia, suculenta e saborosa' },
  { id: 82, name: 'Sobrecoxa de Frango Perdigão', category: 'Congelados', subcategory: 'Aves', price: 13.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Sobrecoxa de frango congelada Perdigão, ideal para grelhar' },
  { id: 83, name: 'Asa de Frango Congelada Sadia', category: 'Congelados', subcategory: 'Aves', price: 12.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Asa de frango congelada Sadia, ótima para petiscos' },
  { id: 84, name: 'Coxa e Sobrecoxa Sadia', category: 'Congelados', subcategory: 'Aves', price: 12.50, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Coxa com sobrecoxa congelada Sadia, praticidade no preparo' },
  { id: 85, name: 'Filé de Frango Sassami Seara', category: 'Congelados', subcategory: 'Aves', price: 19.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Filé sassami de frango Seara, corte magro e proteico' },
  { id: 86, name: 'Meio da Asa Sadia', category: 'Congelados', subcategory: 'Aves', price: 14.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Meio da asa de frango Sadia, perfeito para aperitivos' },
  { id: 87, name: 'Coração de Frango Sadia', category: 'Congelados', subcategory: 'Aves', price: 18.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1642102903996-cdad15f5dcdd?w=400&h=400&fit=crop&q=80', description: 'Coração de frango Sadia, tradição no churrasco brasileiro' },

  // --- Bovinos ---
  { id: 88, name: 'Picanha Bovina Congelada', category: 'Congelados', subcategory: 'Bovinos', price: 59.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Picanha bovina congelada, rainha do churrasco brasileiro' },
  { id: 89, name: 'Alcatra Bovina Congelada', category: 'Congelados', subcategory: 'Bovinos', price: 42.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Alcatra bovina congelada, corte versátil e saboroso' },
  { id: 90, name: 'Maminha Bovina Congelada', category: 'Congelados', subcategory: 'Bovinos', price: 48.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Maminha bovina congelada, macia e suculenta' },
  { id: 91, name: 'Patinho Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 35.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Patinho bovino congelado, corte magro para diversas receitas' },
  { id: 92, name: 'Acém Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 32.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Acém bovino congelado, excelente para cozidos e ensopados' },
  { id: 93, name: 'Costela Bovina Congelada', category: 'Congelados', subcategory: 'Bovinos', price: 29.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Costela bovina congelada, perfeita para churrasco lento' },
  { id: 94, name: 'Cupim Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 34.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Cupim bovino congelado, derrete na boca quando bem assado' },
  { id: 95, name: 'Fraldinha Bovina Congelada', category: 'Congelados', subcategory: 'Bovinos', price: 44.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Fraldinha bovina congelada, sabor intenso no churrasco' },
  { id: 96, name: 'Coxão Mole Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 38.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Coxão mole bovino congelado, ideal para bifes e escalopes' },
  { id: 97, name: 'Coxão Duro Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 33.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Coxão duro bovino congelado, ótimo para carnes de panela' },
  { id: 98, name: 'Músculo Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 28.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Músculo bovino congelado, base para sopas e cozidos' },
  { id: 99, name: 'Contrafilé Bovino Congelado', category: 'Congelados', subcategory: 'Bovinos', price: 46.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80', description: 'Contrafilé bovino congelado, corte nobre para grelhar' },

  // --- Suínos ---
  { id: 100, name: 'Pernil Suíno Congelado Sadia', category: 'Congelados', subcategory: 'Suínos', price: 14.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1690983325551-b922137727be?w=400&h=400&fit=crop&q=80', description: 'Pernil suíno congelado Sadia, ideal para festas e eventos' },
  { id: 101, name: 'Lombo Suíno Congelado Seara', category: 'Congelados', subcategory: 'Suínos', price: 18.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1690983325551-b922137727be?w=400&h=400&fit=crop&q=80', description: 'Lombo suíno congelado Seara, corte magro e versátil' },
  { id: 102, name: 'Costela Suína Congelada', category: 'Congelados', subcategory: 'Suínos', price: 16.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1690983325551-b922137727be?w=400&h=400&fit=crop&q=80', description: 'Costela suína congelada, perfeita para assados e defumados' },
  { id: 103, name: 'Paleta Suína Congelada', category: 'Congelados', subcategory: 'Suínos', price: 12.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1690983325551-b922137727be?w=400&h=400&fit=crop&q=80', description: 'Paleta suína congelada, ótima para desfiados e cozidos' },

  // --- Linguiças ---
  { id: 104, name: 'Linguiça Toscana Sadia 1kg', category: 'Congelados', subcategory: 'Linguiças', price: 18.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça toscana Sadia, sucesso garantido no churrasco' },
  { id: 105, name: 'Linguiça Toscana Perdigão 1kg', category: 'Congelados', subcategory: 'Linguiças', price: 17.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça toscana Perdigão, tempero marcante' },
  { id: 106, name: 'Linguiça Toscana Seara 1kg', category: 'Congelados', subcategory: 'Linguiças', price: 16.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça toscana Seara congelada, pronta para assar' },
  { id: 107, name: 'Linguiça de Frango Sadia 1kg', category: 'Congelados', subcategory: 'Linguiças', price: 14.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça de frango Sadia, opção mais leve para o churrasco' },
  { id: 108, name: 'Linguiça Calabresa Congelada Aurora', category: 'Congelados', subcategory: 'Linguiças', price: 19.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça calabresa Aurora congelada, sabor intenso' },
  { id: 109, name: 'Linguiça Cuiabana Perdigão 1kg', category: 'Congelados', subcategory: 'Linguiças', price: 15.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1602619025673-46cf8479d258?w=400&h=400&fit=crop&q=80', description: 'Linguiça cuiabana Perdigão, temperada com pimenta' },

  // --- Hambúrguer ---
  { id: 110, name: 'Hambúrguer Bovino Sadia cx 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: 49.90, unit: 'cx 36un', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', description: 'Hambúrguer bovino Sadia caixa 36 unidades, food service' },
  { id: 111, name: 'Hambúrguer Bovino Perdigão cx 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: 47.90, unit: 'cx 36un', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', description: 'Hambúrguer bovino Perdigão, ideal para lanchonetes' },
  { id: 112, name: 'Hambúrguer Bovino Seara cx 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: 45.90, unit: 'cx 36un', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', description: 'Hambúrguer bovino Seara, sabor caseiro' },
  { id: 113, name: 'Hambúrguer de Frango Sadia cx 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: 39.90, unit: 'cx 36un', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', description: 'Hambúrguer de frango Sadia, opção mais leve' },
  { id: 114, name: 'Hambúrguer Picanha Seara cx 12un', category: 'Congelados', subcategory: 'Hambúrguer', price: 29.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', description: 'Hambúrguer sabor picanha Seara, premium' },

  // --- Empanados ---
  { id: 115, name: 'Nuggets Frango Sadia 300g', category: 'Congelados', subcategory: 'Empanados', price: 12.90, unit: 'pct 300g', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Nuggets de frango Sadia, crocantes por fora e macios por dentro' },
  { id: 116, name: 'Nuggets Frango Perdigão 300g', category: 'Congelados', subcategory: 'Empanados', price: 11.90, unit: 'pct 300g', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Nuggets de frango Perdigão, rápido e prático' },
  { id: 117, name: 'Nuggets Frango Seara 300g', category: 'Congelados', subcategory: 'Empanados', price: 10.90, unit: 'pct 300g', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Nuggets de frango Seara, crocância irresistível' },
  { id: 118, name: 'Empanado Frango Sadia 1kg', category: 'Congelados', subcategory: 'Empanados', price: 28.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Empanado de frango Sadia pacote família 1kg' },
  { id: 119, name: 'Steak de Frango Perdigão 1kg', category: 'Congelados', subcategory: 'Empanados', price: 26.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Steak empanado de frango Perdigão, prático e saboroso' },
  { id: 120, name: 'Tirinhas de Frango Sadia 300g', category: 'Congelados', subcategory: 'Empanados', price: 14.90, unit: 'pct 300g', image: 'https://images.unsplash.com/photo-1608202196454-9ab2cf862a44?w=400&h=400&fit=crop&q=80', description: 'Tirinhas empanadas de frango Sadia, snack perfeito' },

  // --- Peixes e Frutos do Mar ---
  { id: 121, name: 'Filé de Tilápia Congelado', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: 32.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop&q=80', description: 'Filé de tilápia congelado, peixe de água doce suave' },
  { id: 122, name: 'Filé de Merluza Congelado', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: 28.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop&q=80', description: 'Filé de merluza congelado, versátil na cozinha' },
  { id: 123, name: 'Camarão Cinza Congelado 400g', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: 39.90, unit: 'pct 400g', image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop&q=80', description: 'Camarão cinza congelado descascado, pronto para preparo' },
  { id: 124, name: 'Sardinha Inteira Congelada', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: 15.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop&q=80', description: 'Sardinha inteira congelada, rica em ômega 3' },
  { id: 125, name: 'Filé de Salmão Congelado', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: 69.90, unit: 'kg', image: 'https://images.unsplash.com/photo-1559058789-672da06263d8?w=400&h=400&fit=crop&q=80', description: 'Filé de salmão congelado, corte premium importado' },

  // --- Pizzas ---
  { id: 126, name: 'Pizza Congelada Muçarela Sadia', category: 'Congelados', subcategory: 'Pizzas', price: 14.90, unit: 'un 440g', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80', description: 'Pizza congelada sabor muçarela Sadia, prática e saborosa' },
  { id: 127, name: 'Pizza Congelada Calabresa Seara', category: 'Congelados', subcategory: 'Pizzas', price: 13.90, unit: 'un 440g', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80', description: 'Pizza congelada sabor calabresa Seara, sabor brasileiro' },
  { id: 128, name: 'Pizza Congelada 4 Queijos Sadia', category: 'Congelados', subcategory: 'Pizzas', price: 16.90, unit: 'un 440g', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80', description: 'Pizza congelada quatro queijos Sadia, para os amantes de queijo' },
  { id: 129, name: 'Pizza Congelada Portuguesa Perdigão', category: 'Congelados', subcategory: 'Pizzas', price: 15.90, unit: 'un 440g', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80', description: 'Pizza congelada portuguesa Perdigão, recheio generoso' },

  // --- Batatas Congeladas ---
  { id: 130, name: 'Batata Frita Congelada McCain 1kg', category: 'Congelados', subcategory: 'Batatas Congeladas', price: 18.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&q=80', description: 'Batata frita congelada McCain, crocância profissional' },
  { id: 131, name: 'Batata Frita Congelada McCain 2,5kg', category: 'Congelados', subcategory: 'Batatas Congeladas', price: 39.90, unit: 'pct 2,5kg', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&q=80', description: 'Batata frita congelada McCain pacotão para food service' },
  { id: 132, name: 'Batata Rústica Congelada McCain 1kg', category: 'Congelados', subcategory: 'Batatas Congeladas', price: 21.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&q=80', description: 'Batata rústica congelada McCain com casca, sabor do campo' },
  { id: 133, name: 'Batata Smile McCain 300g', category: 'Congelados', subcategory: 'Batatas Congeladas', price: 12.90, unit: 'pct 300g', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&q=80', description: 'Batata carinha feliz McCain, a favorita das crianças' },

  // --- Polpas de Fruta ---
  { id: 134, name: 'Polpa de Açaí 1kg', category: 'Congelados', subcategory: 'Polpas de Fruta', price: 24.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=400&fit=crop&q=80', description: 'Polpa de açaí congelada pura, energia da Amazônia' },
  { id: 135, name: 'Polpa de Morango 1kg', category: 'Congelados', subcategory: 'Polpas de Fruta', price: 16.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=400&fit=crop&q=80', description: 'Polpa de morango congelada, natural e sem conservantes' },
  { id: 136, name: 'Polpa de Maracujá 1kg', category: 'Congelados', subcategory: 'Polpas de Fruta', price: 14.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=400&fit=crop&q=80', description: 'Polpa de maracujá congelada, sabor tropical intenso' },
  { id: 137, name: 'Polpa de Goiaba 1kg', category: 'Congelados', subcategory: 'Polpas de Fruta', price: 13.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=400&fit=crop&q=80', description: 'Polpa de goiaba congelada, rica em vitamina C' },
  { id: 138, name: 'Polpa de Manga 1kg', category: 'Congelados', subcategory: 'Polpas de Fruta', price: 15.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=400&fit=crop&q=80', description: 'Polpa de manga congelada, doce e aromática' },

  // --- Sorvetes ---
  { id: 139, name: 'Sorvete Kibon Napolitano 2L', category: 'Congelados', subcategory: 'Sorvetes', price: 24.90, unit: 'pote 2L', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80', description: 'Sorvete Kibon napolitano, três sabores clássicos em um' },
  { id: 140, name: 'Sorvete Nestlé Flocos 2L', category: 'Congelados', subcategory: 'Sorvetes', price: 26.90, unit: 'pote 2L', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80', description: 'Sorvete Nestlé sabor flocos, cremoso e irresistível' },
  { id: 141, name: 'Picolé Kibon Fruttare cx 24un', category: 'Congelados', subcategory: 'Sorvetes', price: 52.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80', description: 'Picolé Fruttare de frutas Kibon, caixa para revenda' },
  { id: 142, name: 'Picolé Kibon Chicabon cx 22un', category: 'Congelados', subcategory: 'Sorvetes', price: 58.90, unit: 'cx 22un', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80', description: 'Picolé Chicabon Kibon chocolate, clássico brasileiro' },
  { id: 143, name: 'Sorvete Kibon Magnum Pote 1,5L', category: 'Congelados', subcategory: 'Sorvetes', price: 34.90, unit: 'pote 1,5L', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80', description: 'Sorvete Magnum Kibon em pote, experiência premium' },

  // --- Açaí ---
  { id: 144, name: 'Açaí Tradicional Balde 3,6kg', category: 'Congelados', subcategory: 'Açaí', price: 59.90, unit: 'balde 3,6kg', image: 'https://images.unsplash.com/photo-1534533783939-127a70e7babe?w=400&h=400&fit=crop&q=80', description: 'Açaí em balde para revenda, pronto para servir' },
  { id: 145, name: 'Açaí Premium Pote 1,5kg', category: 'Congelados', subcategory: 'Açaí', price: 32.90, unit: 'pote 1,5kg', image: 'https://images.unsplash.com/photo-1534533783939-127a70e7babe?w=400&h=400&fit=crop&q=80', description: 'Açaí premium com polpa concentrada, sabor do Pará' },
  { id: 146, name: 'Açaí com Banana Pote 500g', category: 'Congelados', subcategory: 'Açaí', price: 14.90, unit: 'pote 500g', image: 'https://images.unsplash.com/photo-1534533783939-127a70e7babe?w=400&h=400&fit=crop&q=80', description: 'Açaí com banana congelado, combinação perfeita' },

  // --- Vegetais Congelados ---
  { id: 147, name: 'Seleta de Legumes Congelada 1kg', category: 'Congelados', subcategory: 'Vegetais Congelados', price: 12.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511996946289-f0c071823341?w=400&h=400&fit=crop&q=80', description: 'Seleta de legumes congelada, praticidade no dia a dia' },
  { id: 148, name: 'Brócolis Congelado 1kg', category: 'Congelados', subcategory: 'Vegetais Congelados', price: 14.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511996946289-f0c071823341?w=400&h=400&fit=crop&q=80', description: 'Brócolis congelado em floretes, pronto para cozinhar' },
  { id: 149, name: 'Milho Verde Congelado 1kg', category: 'Congelados', subcategory: 'Vegetais Congelados', price: 10.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511996946289-f0c071823341?w=400&h=400&fit=crop&q=80', description: 'Milho verde em grãos congelado, doce e crocante' },
  { id: 150, name: 'Ervilha Congelada 1kg', category: 'Congelados', subcategory: 'Vegetais Congelados', price: 11.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1511996946289-f0c071823341?w=400&h=400&fit=crop&q=80', description: 'Ervilha congelada, mantém frescor e nutrientes' },

  // ============================================================
  //  SECOS (75 produtos)
  // ============================================================

  // --- Cervejas ---
  { id: 151, name: 'Cerveja Brahma Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 55.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Brahma Chopp lata 350ml, número 1 do Brasil' },
  { id: 152, name: 'Cerveja Skol Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 54.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Skol lata 350ml, a que desce redondo' },
  { id: 153, name: 'Cerveja Antarctica Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 53.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Antarctica Original lata 350ml, tradição brasileira' },
  { id: 154, name: 'Cerveja Heineken Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 79.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Heineken puro malte lata 350ml, premium importada' },
  { id: 155, name: 'Cerveja Budweiser Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 62.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Budweiser lata 350ml, king of beers' },
  { id: 156, name: 'Cerveja Bohemia Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 64.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Bohemia Puro Malte lata 350ml, qualidade artesanal' },
  { id: 157, name: 'Cerveja Stella Artois Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 76.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Stella Artois lata 350ml, sofisticação belga' },
  { id: 158, name: 'Cerveja Corona Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 82.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Corona Extra lata 350ml, sabor refrescante' },
  { id: 159, name: 'Cerveja Itaipava Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 48.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Itaipava lata 350ml, 100% brasileira' },
  { id: 160, name: 'Cerveja Original Garrafa 600ml cx 12un', category: 'Secos', subcategory: 'Cervejas', price: 89.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Original garrafa 600ml caixa, a pilsen de verdade' },
  { id: 161, name: 'Cerveja Spaten Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 66.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Spaten Puro Malte lata 350ml, tradição alemã' },
  { id: 162, name: 'Cerveja Beck\'s Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Cervejas', price: 59.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=400&fit=crop&q=80', description: 'Cerveja Beck\'s lata 350ml, puro malte alemã' },

  // --- Refrigerantes ---
  { id: 163, name: 'Coca-Cola 2L Fardo 6un', category: 'Secos', subcategory: 'Refrigerantes', price: 42.90, unit: 'fardo 6un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Coca-Cola original 2 litros, fardo com 6 garrafas' },
  { id: 164, name: 'Coca-Cola Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Refrigerantes', price: 35.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Coca-Cola lata 350ml fardo com 12, gelada é melhor' },
  { id: 165, name: 'Guaraná Antarctica 2L Fardo 6un', category: 'Secos', subcategory: 'Refrigerantes', price: 36.90, unit: 'fardo 6un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Guaraná Antarctica 2 litros, sabor original da Amazônia' },
  { id: 166, name: 'Guaraná Antarctica Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Refrigerantes', price: 29.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Guaraná Antarctica lata 350ml fardo com 12 unidades' },
  { id: 167, name: 'Fanta Laranja 2L Fardo 6un', category: 'Secos', subcategory: 'Refrigerantes', price: 36.90, unit: 'fardo 6un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Fanta Laranja 2 litros, fardo com 6 garrafas' },
  { id: 168, name: 'Sprite 2L Fardo 6un', category: 'Secos', subcategory: 'Refrigerantes', price: 36.90, unit: 'fardo 6un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Sprite limão 2 litros, refrescância com limão' },
  { id: 169, name: 'Coca-Cola Zero Lata 350ml Fardo 12un', category: 'Secos', subcategory: 'Refrigerantes', price: 37.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1554169360-f86ef83314ec?w=400&h=400&fit=crop&q=80', description: 'Coca-Cola Zero Açúcar lata 350ml fardo, mesmo sabor sem açúcar' },

  // --- Sucos ---
  { id: 170, name: 'Suco Del Valle Uva 1L cx 12un', category: 'Secos', subcategory: 'Sucos', price: 52.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop&q=80', description: 'Suco Del Valle uva integral 1 litro, caixa com 12' },
  { id: 171, name: 'Suco Del Valle Laranja 1L cx 12un', category: 'Secos', subcategory: 'Sucos', price: 49.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop&q=80', description: 'Néctar Del Valle laranja 1 litro, caixa com 12' },
  { id: 172, name: 'Suco Maguary Maracujá 1L cx 12un', category: 'Secos', subcategory: 'Sucos', price: 42.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop&q=80', description: 'Suco Maguary maracujá concentrado, faz até 4 litros' },
  { id: 173, name: 'Suco Tang Laranja pct 25g cx 15un', category: 'Secos', subcategory: 'Sucos', price: 14.90, unit: 'cx 15un', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=400&fit=crop&q=80', description: 'Suco em pó Tang sabor laranja, faz 1 litro cada' },

  // --- Águas ---
  { id: 174, name: 'Água Mineral Crystal 500ml Fardo 12un', category: 'Secos', subcategory: 'Águas', price: 14.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80', description: 'Água mineral Crystal sem gás 500ml fardo com 12' },
  { id: 175, name: 'Água Mineral Minalba 500ml Fardo 12un', category: 'Secos', subcategory: 'Águas', price: 16.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80', description: 'Água mineral Minalba sem gás 500ml fardo com 12' },
  { id: 176, name: 'Água Mineral 20L Galão', category: 'Secos', subcategory: 'Águas', price: 12.90, unit: 'galão 20L', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80', description: 'Galão de água mineral 20 litros para dispensers' },
  { id: 177, name: 'Água com Gás Crystal 500ml Fardo 12un', category: 'Secos', subcategory: 'Águas', price: 18.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80', description: 'Água mineral com gás Crystal 500ml fardo com 12' },

  // --- Energéticos ---
  { id: 178, name: 'Red Bull Energy Drink 250ml cx 24un', category: 'Secos', subcategory: 'Energéticos', price: 199.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?w=400&h=400&fit=crop&q=80', description: 'Red Bull energético 250ml caixa com 24 latas' },
  { id: 179, name: 'Monster Energy 473ml cx 6un', category: 'Secos', subcategory: 'Energéticos', price: 49.90, unit: 'cx 6un', image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?w=400&h=400&fit=crop&q=80', description: 'Monster Energy lata 473ml caixa com 6, energia extra' },
  { id: 180, name: 'TNT Energy 269ml Fardo 12un', category: 'Secos', subcategory: 'Energéticos', price: 39.90, unit: 'fardo 12un', image: 'https://images.unsplash.com/photo-1560689189-65b6ed6228e7?w=400&h=400&fit=crop&q=80', description: 'TNT Energy Drink lata 269ml fardo com 12, alto rendimento' },

  // --- Biscoitos ---
  { id: 181, name: 'Biscoito Cream Cracker Piraquê 200g cx 20un', category: 'Secos', subcategory: 'Biscoitos', price: 62.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', description: 'Biscoito cream cracker Piraquê caixa 20 pacotes' },
  { id: 182, name: 'Biscoito Água e Sal Marilan 400g cx 20un', category: 'Secos', subcategory: 'Biscoitos', price: 55.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', description: 'Biscoito água e sal Marilan caixa com 20 pacotes' },
  { id: 183, name: 'Biscoito Recheado Oreo 90g cx 48un', category: 'Secos', subcategory: 'Biscoitos', price: 89.90, unit: 'cx 48un', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', description: 'Biscoito recheado Oreo caixa com 48 unidades para revenda' },
  { id: 184, name: 'Biscoito Recheado Trakinas 126g cx 40un', category: 'Secos', subcategory: 'Biscoitos', price: 79.90, unit: 'cx 40un', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', description: 'Biscoito recheado Trakinas morango caixa com 40 unidades' },
  { id: 185, name: 'Biscoito Maizena Vitarella 400g cx 20un', category: 'Secos', subcategory: 'Biscoitos', price: 49.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', description: 'Biscoito de maisena Vitarella, delicado e tradicional' },

  // --- Macarrão ---
  { id: 186, name: 'Macarrão Espaguete Barilla 500g cx 20un', category: 'Secos', subcategory: 'Macarrão', price: 89.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop&q=80', description: 'Macarrão espaguete Barilla nº5 caixa com 20 pacotes' },
  { id: 187, name: 'Macarrão Espaguete Renata 500g cx 20un', category: 'Secos', subcategory: 'Macarrão', price: 59.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop&q=80', description: 'Macarrão espaguete Renata sêmola caixa com 20 pacotes' },
  { id: 188, name: 'Macarrão Parafuso Adria 500g cx 20un', category: 'Secos', subcategory: 'Macarrão', price: 65.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop&q=80', description: 'Macarrão parafuso Adria caixa com 20 pacotes' },
  { id: 189, name: 'Macarrão Instantâneo Miojo 85g cx 50un', category: 'Secos', subcategory: 'Macarrão', price: 69.90, unit: 'cx 50un', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop&q=80', description: 'Macarrão instantâneo Nissin sabor galinha caixa 50 unidades' },

  // --- Arroz ---
  { id: 190, name: 'Arroz Branco Camil Tipo 1 5kg', category: 'Secos', subcategory: 'Arroz', price: 27.90, unit: 'pct 5kg', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop&q=80', description: 'Arroz branco tipo 1 Camil, grão longo e solto' },
  { id: 191, name: 'Arroz Branco Tio João Tipo 1 5kg', category: 'Secos', subcategory: 'Arroz', price: 29.90, unit: 'pct 5kg', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop&q=80', description: 'Arroz branco tipo 1 Tio João, tradição em qualidade' },
  { id: 192, name: 'Arroz Parboilizado Camil 5kg', category: 'Secos', subcategory: 'Arroz', price: 24.90, unit: 'pct 5kg', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop&q=80', description: 'Arroz parboilizado Camil, mais nutritivo e solto' },

  // --- Feijão ---
  { id: 193, name: 'Feijão Carioca Camil 1kg', category: 'Secos', subcategory: 'Feijão', price: 8.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1551723382-048c615c0b70?w=400&h=400&fit=crop&q=80', description: 'Feijão carioca Camil tipo 1, base do prato brasileiro' },
  { id: 194, name: 'Feijão Preto Camil 1kg', category: 'Secos', subcategory: 'Feijão', price: 9.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1551723382-048c615c0b70?w=400&h=400&fit=crop&q=80', description: 'Feijão preto Camil tipo 1, essencial para feijoada' },
  { id: 195, name: 'Feijão Carioca Kicaldo 1kg', category: 'Secos', subcategory: 'Feijão', price: 7.90, unit: 'pct 1kg', image: 'https://images.unsplash.com/photo-1551723382-048c615c0b70?w=400&h=400&fit=crop&q=80', description: 'Feijão carioca Kicaldo, cozimento rápido e uniforme' },

  // --- Óleos ---
  { id: 196, name: 'Óleo de Soja Soya 900ml cx 20un', category: 'Secos', subcategory: 'Óleos', price: 109.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80', description: 'Óleo de soja Soya caixa com 20 garrafas de 900ml' },
  { id: 197, name: 'Óleo de Soja Liza 900ml cx 20un', category: 'Secos', subcategory: 'Óleos', price: 104.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80', description: 'Óleo de soja Liza caixa com 20 garrafas de 900ml' },
  { id: 198, name: 'Azeite de Oliva Gallo 500ml', category: 'Secos', subcategory: 'Óleos', price: 29.90, unit: 'un 500ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80', description: 'Azeite de oliva extra virgem Gallo, importado de Portugal' },

  // --- Farinhas ---
  { id: 199, name: 'Farinha de Trigo Dona Benta 1kg cx 10un', category: 'Secos', subcategory: 'Farinhas', price: 54.90, unit: 'cx 10un', image: 'https://images.unsplash.com/photo-1586514442943-9454b2d644d8?w=400&h=400&fit=crop&q=80', description: 'Farinha de trigo Dona Benta especial caixa com 10 pacotes' },
  { id: 200, name: 'Farinha de Mandioca Yoki 500g cx 12un', category: 'Secos', subcategory: 'Farinhas', price: 39.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1586514442943-9454b2d644d8?w=400&h=400&fit=crop&q=80', description: 'Farinha de mandioca torrada Yoki caixa com 12 pacotes' },
  { id: 201, name: 'Farofa Pronta Yoki 500g cx 12un', category: 'Secos', subcategory: 'Farinhas', price: 45.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1586514442943-9454b2d644d8?w=400&h=400&fit=crop&q=80', description: 'Farofa pronta temperada Yoki caixa com 12 pacotes' },

  // --- Açúcar ---
  { id: 202, name: 'Açúcar Refinado União 1kg cx 10un', category: 'Secos', subcategory: 'Açúcar', price: 49.90, unit: 'cx 10un', image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=400&fit=crop&q=80', description: 'Açúcar refinado União caixa com 10 pacotes de 1kg' },
  { id: 203, name: 'Açúcar Cristal Caravelas 5kg', category: 'Secos', subcategory: 'Açúcar', price: 19.90, unit: 'pct 5kg', image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=400&fit=crop&q=80', description: 'Açúcar cristal Caravelas pacote 5kg, econômico' },

  // --- Café ---
  { id: 204, name: 'Café Pilão Tradicional 500g cx 10un', category: 'Secos', subcategory: 'Café', price: 79.90, unit: 'cx 10un', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&q=80', description: 'Café torrado e moído Pilão caixa com 10 pacotes' },
  { id: 205, name: 'Café Melitta Tradicional 500g cx 10un', category: 'Secos', subcategory: 'Café', price: 84.90, unit: 'cx 10un', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&q=80', description: 'Café torrado e moído Melitta caixa com 10 pacotes' },
  { id: 206, name: 'Café 3 Corações Extraforte 500g cx 10un', category: 'Secos', subcategory: 'Café', price: 74.90, unit: 'cx 10un', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&q=80', description: 'Café 3 Corações extraforte caixa com 10 pacotes' },
  { id: 207, name: 'Nescafé Tradição 200g cx 12un', category: 'Secos', subcategory: 'Café', price: 119.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&q=80', description: 'Café solúvel Nescafé Tradição caixa com 12 vidros' },

  // --- Leite em Pó ---
  { id: 208, name: 'Leite em Pó Integral Ninho 400g cx 20un', category: 'Secos', subcategory: 'Leite em Pó', price: 219.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1590163326027-e224f3a0983e?w=400&h=400&fit=crop&q=80', description: 'Leite em pó integral Ninho caixa com 20 latas de 400g' },
  { id: 209, name: 'Leite em Pó Integral Itambé 400g cx 20un', category: 'Secos', subcategory: 'Leite em Pó', price: 179.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1590163326027-e224f3a0983e?w=400&h=400&fit=crop&q=80', description: 'Leite em pó integral Itambé caixa com 20 pacotes' },
  { id: 210, name: 'Leite em Pó Integral Piracanjuba 400g cx 20un', category: 'Secos', subcategory: 'Leite em Pó', price: 169.90, unit: 'cx 20un', image: 'https://images.unsplash.com/photo-1590163326027-e224f3a0983e?w=400&h=400&fit=crop&q=80', description: 'Leite em pó integral Piracanjuba caixa com 20 pacotes' },

  // --- Molhos e Condimentos ---
  { id: 211, name: 'Extrato de Tomate Elefante 340g cx 24un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 89.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Extrato de tomate Elefante caixa com 24 latas' },
  { id: 212, name: 'Molho de Tomate Heinz 340g cx 24un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 95.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Molho de tomate Heinz caixa com 24 sachês' },
  { id: 213, name: 'Maionese Hellmanns 500g cx 12un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 89.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Maionese Hellmann\'s tradicional caixa com 12 potes' },
  { id: 214, name: 'Catchup Heinz 397g cx 12un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 69.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Ketchup Heinz tradicional caixa com 12 frascos' },
  { id: 215, name: 'Mostarda Heinz 215g cx 16un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 59.90, unit: 'cx 16un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Mostarda amarela Heinz caixa com 16 frascos' },
  { id: 216, name: 'Molho Shoyu Sakura 500ml cx 12un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 49.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Molho de soja Sakura caixa com 12 garrafas' },
  { id: 217, name: 'Vinagre Castelo 750ml cx 12un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 32.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Vinagre de álcool Castelo caixa com 12 garrafas' },
  { id: 218, name: 'Maionese Hellmanns Balde 3kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 42.90, unit: 'balde 3kg', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Maionese Hellmann\'s balde 3kg, ideal para food service' },

  // --- Enlatados ---
  { id: 219, name: 'Milho Verde Lata Bonduelle 200g cx 24un', category: 'Secos', subcategory: 'Enlatados', price: 72.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Milho verde em conserva Bonduelle caixa com 24 latas' },
  { id: 220, name: 'Ervilha Lata Bonduelle 200g cx 24un', category: 'Secos', subcategory: 'Enlatados', price: 74.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Ervilha em conserva Bonduelle caixa com 24 latas' },
  { id: 221, name: 'Atum Ralado Gomes da Costa 170g cx 24un', category: 'Secos', subcategory: 'Enlatados', price: 119.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Atum ralado em óleo Gomes da Costa caixa com 24 latas' },
  { id: 222, name: 'Sardinha Lata Gomes da Costa 125g cx 50un', category: 'Secos', subcategory: 'Enlatados', price: 149.90, unit: 'cx 50un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Sardinha em óleo Gomes da Costa caixa com 50 latas' },
  { id: 223, name: 'Azeitona Verde Gallo 200g cx 24un', category: 'Secos', subcategory: 'Enlatados', price: 95.90, unit: 'cx 24un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Azeitona verde com caroço Gallo caixa com 24 vidros' },
  { id: 224, name: 'Palmito Pupunha Hemmer 300g cx 12un', category: 'Secos', subcategory: 'Enlatados', price: 89.90, unit: 'cx 12un', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&h=400&fit=crop&q=80', description: 'Palmito pupunha em conserva Hemmer caixa com 12 vidros' },
  { id: 225, name: 'Sal Refinado Cisne 1kg cx 30un', category: 'Secos', subcategory: 'Molhos e Condimentos', price: 42.90, unit: 'cx 30un', image: 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop&q=80', description: 'Sal refinado iodado Cisne caixa com 30 pacotes de 1kg' },
];
