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
    'Bacalhau',
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
    'Margarinas',
    'Achocolatados',
    'Embalagens',
    'Descartáveis',
    'Destilados',
  ],
};

export const products = [
  // ============================================================
  //  SECOS
  // ============================================================

  // --- Açúcar ---
  { id: 1, name: 'Açúcar Refinado União 10/1kg', category: 'Secos', subcategory: 'Açúcar', price: 48.50, unit: 'fardo', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1140918/g.jpg?v=639076962153600000', description: 'Fardo com 10 pacotes de 1kg' },

  // --- Molhos e Condimentos ---
  { id: 4, name: 'Alho Frito 500g', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/alho frito.jpeg', description: 'Alho frito crocante, pacote 500g' },
  { id: 5, name: 'Alho Triturado Balde', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/alho balde triturado.webp', description: 'Alho triturado pronto para uso, balde' },

  // --- Enlatados ---
  { id: 6, name: 'Atum Ralado Chicharro lata 410g Randy', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: '/produtos/atum chicharro.jpg', description: 'Atum ralado tipo chicharro, lata 410g marca Randy' },

  // --- Conservas (Azeitonas) ---
  { id: 8, name: 'Azeitona Chileninha', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona com caroco.webp', description: 'Azeitona chileninha preta, tipo portuguesa' },
  { id: 9, name: 'Azeitona de Fita', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona de fita.webp', description: 'Azeitona verde de fita em conserva' },
  { id: 33, name: 'Azeitona com Caroço Miúda', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona com caroco.webp', description: 'Azeitona verde com caroço, tamanho miúda, balde' },
  { id: 10, name: 'Azeitona com Caroço Graúda', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona com caroco.webp', description: 'Azeitona verde com caroço, tamanho graúda, balde' },
  { id: 11, name: 'Azeitona Fatiada', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona fatida.webp', description: 'Azeitona verde fatiada, pronta para uso em pizzas e saladas' },
  { id: 12, name: 'Azeitona Preta Fatiada', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona preta fatiada.webp', description: 'Azeitona preta fatiada em conserva' },
  { id: 14, name: 'Azeitona Verde sem Caroço', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona sem caroco.webp', description: 'Azeitona verde sem caroço em conserva' },

  // --- Snacks ---
  { id: 16, name: 'Batata Palha', category: 'Secos', subcategory: 'Snacks', price: null, unit: 'un', image: '/produtos/batata palha.jpg', description: 'Batata palha crocante e saborosa' },

  // --- Molhos e Condimentos (continuação) ---
  { id: 17, name: 'Ketchup Galão Cepera', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/catchup galao cepera.webp', description: 'Ketchup Cepera, galão tamanho institucional' },
  { id: 18, name: 'Ketchup Galão Predilecta', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/catchup galao predileta.webp', description: 'Ketchup Predilecta, galão tamanho institucional' },

  // --- Conservas (continuação) ---
  { id: 20, name: 'Champignon Fatiado Balde', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/champinhon fatiado.jpg', description: 'Cogumelos champignon fatiados em conserva, balde' },
  { id: 21, name: 'Ervilha 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1147595/m.jpg?v=639076996519730000', description: 'Ervilha em conserva Predilecta, balde 2kg' },
  { id: 22, name: 'Ervilha 200g Predilecta', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://megag.com.br/v21/wp-content/uploads/2021/07/arq_0Ervilha-Lata-Predilecta-200g.jpg', description: 'Ervilha em conserva Predilecta, lata 200g' },

  // --- Óleos (continuação) ---
  { id: 23, name: 'Gordura Vegetal 15kg Coamo', category: 'Secos', subcategory: 'Óleos', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/970643/p.jpg?v=639047113475230000', description: 'Gordura vegetal Coamo Fry, balde 15kg' },

  // --- Farinhas ---
  { id: 24, name: 'Farinha de Trigo Aniela 10/1kg', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'fardo', image: 'https://assets.instabuy.app.br/ib.item.image.large/l-b7c754c7e4da47b3aa2762438e95ecca.jpeg', description: 'Fardo com 10 pacotes de 1kg' },

  // --- Enlatados (continuação) ---
  { id: 25, name: 'Leite Condensado 395g Italac', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1141006/g.jpg?v=639076962610100000', description: 'Leite condensado Italac, lata 395g' },
  // --- Leite em Pó ---
  { id: 27, name: 'Leite Integral Cooper Rita', category: 'Secos', subcategory: 'Leite em Pó', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1220177/leite_uht_integral_1l_25_1_ddc37c4a6a4774a8dbc1961685816d76.jpg', description: 'Leite integral UHT Cooper Rita, caixa 1 litro' },

  // --- Molhos e Condimentos (maioneses) ---
  { id: 29, name: 'Maionese Balde Saúde', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://tfczuy.vtexassets.com/arquivos/ids/7973699/586459.jpg?v=639084590670370000', description: 'Maionese Saúde, balde tamanho institucional' },
  { id: 32, name: "Maionese Hellmann's 500g", category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://muffatosupermercados.vtexassets.com/arquivos/ids/417314/7894000050034_1.jpg?v=638963334320400000', description: "Maionese Hellmann's tradicional, pote 500g" },

  // --- Margarinas ---
  { id: 34, name: 'Margarina Coamo Fry Balde 15kg 50% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.allpan.com.br/407-large_default/margarina-50-lipidios-com-sal-145kg-coamo.jpg', description: 'Margarina Coamo Fry com sal, 50% lipídios, balde 15kg — ideal para frituras e uso profissional' },
  { id: 35, name: 'Margarina Coamo Cremosa Balde 15kg 80% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.allpan.com.br/409-large_default/margarina-80-lipidios-com-sal-145kg-coamo.jpg', description: 'Margarina Coamo Cremosa com sal, 80% lipídios, balde 15kg — textura macia para panificação e confeitaria' },
  { id: 36, name: 'Margarina Claybom 250g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/989015-11-07-2024-16-06-14-60.jpg', description: 'Margarina Claybom cremosa com sal, pote 250g' },
  { id: 37, name: 'Margarina Qualy 250g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://mercantilnovaera.vtexassets.com/arquivos/ids/217072-800-auto?v=638527804629800000&width=800&height=auto&aspect=true', description: 'Margarina Qualy com sal, pote 250g — sabor e cremosidade' },
  { id: 38, name: 'Margarina Qualy Cremosa 500g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://mercantilnovaera.vtexassets.com/arquivos/ids/217077-800-auto?v=638527812128230000&width=800&height=auto&aspect=true', description: 'Margarina Qualy Cremosa com sal, pote 500g — textura extra macia' },
  { id: 39, name: 'Margarina Coamo Sem Sal Balde 15kg 80% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.stampafood.com.br/2543-large_default/margarina-80-lipidios-sem-sal-balde-145-kg-coamo.webp', description: 'Margarina Coamo sem sal, 80% lipídios, balde 15kg — para receitas que pedem controle de sal' },
  { id: 40, name: 'Margarina Claybom 500g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://www.extrabom.com.br/media/produtos/350x350/4274_extrabom_margarinas_margarina-cremosa-com-sal-claybom-pote-500g.jpg_.jpeg', description: 'Margarina Claybom cremosa com sal, pote 500g' },

  // --- Conservas (milho) ---
  { id: 41, name: 'Milho Verde Quero 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://megag.com.br/v21/wp-content/uploads/2021/08/Milho-Verde-Quero.jpg', description: 'Milho verde em conserva Quero, lata 2kg — pronto para uso em receitas e saladas' },
  { id: 42, name: 'Milho Verde Só Fruta Lata 200g', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://images-food.ifcshop.com.br/produto/16718_0_20200423190640.jpg', description: 'Milho verde em conserva Só Fruta, lata 200g' },

  // --- Molhos e Condimentos (continuação) ---
  { id: 43, name: 'Molho de Pimenta 150ml', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://phygital-files.mercafacil.com/primato/uploads/produto/molho_pimenta_castelo_150ml_9eb7cfa4-9100-41ee-a16d-5822e9705007.png', description: 'Molho de pimenta tradicional, frasco 150ml — ardência na medida certa' },
  { id: 44, name: 'Molho de Pizza Predilecta', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.sondadelivery.com.br/Arquivos/ProdutosSku/1000042175/7896292334113_99_3_1200_72_RGB.jpg', description: 'Molho de pizza Predilecta, pronto para uso — sabor caseiro para suas pizzas' },
  { id: 45, name: 'Molho Barbecue Cepera Galão 3kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.cepera.com.br/cms/wp-content/uploads/2019/05/Barbecue-35kg.jpg', description: 'Molho barbecue Cepera, galão 3kg — tamanho institucional para churrascarias e food service' },
  { id: 46, name: 'Mostarda Cepera Galão', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.cepera.com.br/cms/wp-content/uploads/2019/05/Mostarda-amarela-33kg.jpg', description: 'Mostarda amarela Cepera, galão 3,3kg — ideal para lanchonetes e uso profissional' },

  // --- Enlatados (continuação) ---
  { id: 47, name: 'Mortadelinha Mini Tradição', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://www.perdigao.com.br/assets/_images/5659575eb46a8e2a5bb2bad42930a619856a78cc.png', description: 'Mortadelinha mini Tradição Perdigão — prática e saborosa, ideal para lanches rápidos' },

  // --- Achocolatados ---
  { id: 48, name: 'Nescau 400g Nestlé', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'un', image: 'https://drogal.vtexassets.com/arquivos/ids/246077/127059.jpg?v=638739838442770000', description: 'Achocolatado em pó Nescau Nestlé, lata 400g — o sabor clássico para seu leite' },
  { id: 49, name: 'Achocolatado Chocomil', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'un', image: '', description: 'Bebida láctea achocolatada Chocomil, caixinha — prática e saborosa' },

  // --- Conservas (palmitos) ---
  { id: 50, name: 'Palmito Inteiro Tolete 1,8kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '', description: 'Palmito inteiro em tolete, vidro 1,8kg — ideal para uso profissional' },
  { id: 51, name: 'Palmito Inteiro 300g', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '', description: 'Palmito inteiro em conserva, vidro 300g' },
  { id: 52, name: 'Palmito Lata Conquista', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '', description: 'Palmito em conserva Conquista, lata' },

  // --- Enlatados ---
  { id: 53, name: 'Creme de Leite Italac 200g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: '', description: 'Creme de leite UHT Italac, caixinha 200g' },

  // --- Águas ---
  { id: 54, name: 'Água Mineral Bioleve 510ml Garrafa Rosa', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '', description: 'Água mineral sem gás Bioleve, garrafa rosa 510ml' },
  { id: 55, name: 'Água Mineral Bioleve 510ml Com Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '', description: 'Água mineral com gás Bioleve, garrafa 510ml' },
  { id: 56, name: 'Água Mineral Bioleve 510ml Sem Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '', description: 'Água mineral sem gás Bioleve, garrafa azul 510ml' },

  // --- Refrigerantes ---
  { id: 57, name: 'H2O Bioleve Limão', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante H2O Bioleve sabor limão, garrafa PET' },
  { id: 58, name: 'H2O Bioleve Mexerica', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante H2O Bioleve sabor mexerica, garrafa PET' },
  { id: 59, name: 'H2O Bioleve Limão Zero', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante H2O Bioleve sabor limão zero açúcar, garrafa PET' },
  { id: 60, name: 'Guaraná Antártica Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante Guaraná Antártica, lata 350ml' },
  { id: 61, name: 'Sprite Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante Sprite limão, lata 350ml' },
  { id: 62, name: 'Fanta Laranja Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante Fanta sabor laranja, lata 350ml' },
  { id: 63, name: 'Fanta Uva Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante Fanta sabor uva, lata 350ml' },
  { id: 64, name: 'Coca-Cola Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '', description: 'Refrigerante Coca-Cola original, lata 350ml' },

  // --- Energéticos ---
  { id: 65, name: 'Energético Bioleve Energy Power cx 6un', category: 'Secos', subcategory: 'Energéticos', price: null, unit: 'cx', image: '', description: 'Energético Bioleve Energy Power, caixa com 6 unidades' },

  // --- Sucos ---
  { id: 66, name: 'Gatorade Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: '', description: 'Isotônico Gatorade, diversos sabores, garrafa 500ml' },
  { id: 67, name: 'Suco Bioleve Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: '', description: 'Suco Bioleve, diversos sabores naturais' },

  // --- Destilados ---
  { id: 68, name: 'Cachaça Costa Brava 500ml', category: 'Secos', subcategory: 'Destilados', price: null, unit: 'un', image: '', description: 'Cachaça Costa Brava, garrafa 500ml' },

  // --- Cervejas ---
  { id: 69, name: 'Cerveja Brahma Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: '', description: 'Cerveja Brahma Chopp pilsen, lata 350ml' },
  { id: 70, name: 'Cerveja Brahma Latão 550ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: '', description: 'Cerveja Brahma Chopp pilsen, latão 550ml' },
  { id: 71, name: 'Cerveja Skol Latão 500ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: '', description: 'Cerveja Skol pilsen, latão 500ml' },
  { id: 72, name: 'Cerveja Skol Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: '', description: 'Cerveja Skol pilsen, lata 350ml' },
  { id: 73, name: 'Cerveja Itaipava Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: '', description: 'Cerveja Itaipava pilsen, lata 350ml' },

  // --- Embalagens ---
  { id: 74, name: 'Bobina Picotada 20x30', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Bobina plástica picotada 20x30cm, rolo' },
  { id: 75, name: 'Saco para Lanche 22x17', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco de papel para lanche 22x17cm' },
  { id: 76, name: 'Saco para Lanche 24x19', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco de papel para lanche 24x19cm' },
  { id: 77, name: 'Embalagem para Frios', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco plástico estampado para embalar frios' },
  { id: 78, name: 'Saco Plástico 40x60', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco plástico transparente 40x60cm' },
  { id: 79, name: 'Saco Plástico 50x80', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco plástico transparente 50x80cm' },
  { id: 80, name: 'Sacola 38x48', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica branca 38x48cm' },
  { id: 81, name: 'Sacola 50x60 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica reciclada colorida 50x60cm' },
  { id: 82, name: 'Sacola 30x40', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica branca 30x40cm' },
  { id: 83, name: 'Sacola Colorida 30x40 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica colorida reciclada 30x40cm' },
  { id: 84, name: 'Sacola Colorida 40x50 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica colorida reciclada 40x50cm' },
  { id: 85, name: 'Sacola 30x40 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica branca reforçada 30x40cm' },
  { id: 86, name: 'Sacola 40x50 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica branca reforçada 40x50cm' },
  { id: 87, name: 'Sacola 50x60 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Sacola plástica branca reforçada 50x60cm' },
  { id: 88, name: 'Embalagem Frango Assado', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: '', description: 'Saco de papel térmico para frango assado, marca Pluma PackPel' },
  { id: 89, name: 'Guardanapo de Papel 13x14 pc 2000un', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'pc', image: '', description: 'Guardanapo de papel 13x14cm, pacote com 2000 unidades' },

  // --- Descartáveis ---
  { id: 90, name: 'Papel Toalha Interfolha 20x21 pc 800', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'pc', image: '', description: 'Papel toalha interfolha 20x21cm, pacote com 800 folhas' },
  { id: 91, name: 'Embalagem de Pizza Brotinho', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: '', description: 'Caixa octogonal para pizza brotinho' },
  { id: 92, name: 'Embalagem de Pizza Grande', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: '', description: 'Caixa octogonal para pizza grande' },
  { id: 93, name: 'Copo Plástico Copolar 200ml pc 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'pc', image: '', description: 'Copo plástico descartável Copolar 200ml, pacote com 100 unidades' },
  { id: 94, name: 'Marmitex nº8 cx 100un PT102', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: '', description: 'Marmitex isopor nº8 com tampa, caixa com 100 unidades, modelo PT102' },
  { id: 95, name: 'Marmitex nº9 cx 100un PT104', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: '', description: 'Marmitex isopor nº9 com tampa, caixa com 100 unidades, modelo PT104' },
  { id: 96, name: 'Marmitex PT100 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: '', description: 'Marmitex isopor redondo PT100 com tampa, caixa com 100 unidades' },
  { id: 97, name: 'Marmitex PT500', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: '', description: 'Marmitex isopor redondo PT500 com tampa, tamanho grande' },
  { id: 98, name: 'Hamburgueira CH2 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: '', description: 'Embalagem isopor para hambúrguer CH2 média, caixa com 100 unidades' },
  { id: 99, name: 'Hamburgueira CH3 cx 50un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: '', description: 'Embalagem isopor para hambúrguer CH3 grande, caixa com 50 unidades' },

  // ============================================================
  //  RESFRIADOS
  // ============================================================

  // --- Apresuntados ---
  { id: 100, name: 'Apresuntado Aurora', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Aurora, peça — fatiado na hora' },
  { id: 101, name: 'Apresuntado Fricor', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Fricor, peça — qualidade premium' },
  { id: 102, name: 'Apresuntado Pepery', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Pepery, peça — sabor tradicional' },
  { id: 103, name: 'Apresuntado Perdigão', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Perdigão, peça — marca líder de mercado' },
  { id: 104, name: 'Apresuntado Poços de Caldas', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Lanche de Carnes Poços de Caldas, peça' },
  { id: 105, name: 'Apresuntado Sadia', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: '', description: 'Apresuntado Sadia, peça — qualidade garantida' },

  // --- Presuntos ---
  { id: 106, name: 'Lombo Canadense Nobre', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: '', description: 'Lombo canadense defumado Nobre, peça' },
  { id: 107, name: 'Presunto Cozido Sadia', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: '', description: 'Presunto cozido Sadia, peça — para fatiar' },
  { id: 108, name: 'Presunto Rio Sul', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: '', description: 'Presunto cozido Rio Sul, peça' },
  { id: 109, name: 'Presunto Perdigão', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: '', description: 'Presunto cozido Perdigão, peça' },

  // --- Mortadelas ---
  { id: 110, name: 'Mortadela Frigossa 2kg', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'pc', image: '', description: 'Mortadela Frigossa, peça inteira 2kg' },
  { id: 111, name: 'Mortadela Marba', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: '', description: 'Mortadela Marba, peça — tradicional e saborosa' },
  { id: 112, name: 'Mortadela Ouro', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: '', description: 'Mortadela Ouro, peça — qualidade premium' },
  { id: 113, name: 'Bolonhela Perdigão', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: '', description: 'Mortadela tipo bologna Perdigão, peça' },

  // --- Cream Cheese ---
  { id: 114, name: 'Cream Cheese Scala', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '', description: 'Cream cheese Scala, embalagem bisnaga — cremoso e versátil' },
  { id: 115, name: 'Catupiry Milk Gold', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '', description: 'Requeijão cremoso tipo catupiry Milk Gold' },
  { id: 116, name: 'Catupiry Catiguá', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '', description: 'Requeijão cremoso tipo catupiry Catiguá' },
  { id: 117, name: 'Catupiri Dalora', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '', description: 'Requeijão cremoso tipo catupiry Dalora, bisnaga' },
  { id: 118, name: 'Catupiri Scala Bisnaga', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '', description: 'Requeijão cremoso tipo catupiry Scala, bisnaga' },

  // --- Queijos ---
  { id: 119, name: 'Cheddar Scala', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: '', description: 'Requeijão sabor cheddar Scala, bisnaga' },
  { id: 120, name: 'Queijo Provolone', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo provolone defumado, peça' },
  { id: 121, name: 'Queijo Crioulo', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: '', description: 'Queijo minas frescal Crioulo, pote' },
  { id: 122, name: 'Queijo Gorgonzola', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo gorgonzola, peça — sabor intenso e marcante' },
  { id: 123, name: 'Queijo Minas Padrão Nova Esperança', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo minas padrão Laticínio Nova Esperança, peça' },
  { id: 124, name: 'Mussarela Nova Esperança', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo mussarela Nova Esperança, peça — para fatiar' },
  { id: 125, name: 'Mussarela Roseira', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo mussarela Roseira, barra — qualidade e rendimento' },
  { id: 126, name: 'Queijo Prato', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '', description: 'Queijo prato, peça — ideal para sanduíches e lanches' },
  { id: 127, name: 'Parmesão Scala', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: '', description: 'Queijo parmesão Scala, embalagem — sabor intenso para gratinar e ralar' },
  { id: 128, name: 'Espeto de Queijo Coalho', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: '', description: 'Queijo coalho em espeto, pronto para assar — ideal para churrascos' },

  // --- Requeijão ---
  { id: 129, name: 'Requeijão Scala Light', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: '', description: 'Requeijão cremoso Scala light, copo — menos gordura, mesmo sabor' },
  { id: 130, name: 'Requeijão Scala', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: '', description: 'Requeijão cremoso Scala tradicional, copo' },

  // --- Manteiga e Margarina ---
  { id: 131, name: 'Manteiga Scala', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: null, unit: 'un', image: '', description: 'Manteiga Scala com sal, pote — sabor puro de manteiga' },

  // --- Salames e Embutidos ---
  { id: 132, name: 'Bacon Perdigão', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Bacon defumado Perdigão, peça — sabor defumado marcante' },
  { id: 133, name: 'Bacon Pernil Saudali', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Bacon de pernil Saudali, peça defumada' },
  { id: 134, name: 'Bacon Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Bacon defumado Sadia, peça' },
  { id: 135, name: 'Carne Seca Frisul', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Carne seca (charque) Frisul, peça — curada e saborosa' },
  { id: 136, name: 'Calabresa Frigonossa', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça calabresa defumada Frigonossa, peça' },
  { id: 137, name: 'Calabresa Reta Seara', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça calabresa reta defumada Seara, peça' },
  { id: 138, name: 'Calabresa Sadia', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça calabresa defumada Sadia, peça' },
  { id: 139, name: 'Salaminho Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Salame tipo italiano, peça inteira — curado e saboroso' },
  { id: 140, name: 'Linguiça Cuiabana Grande', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça tipo cuiabana fininha, peça grande' },
  { id: 141, name: 'Linguiça Gomo Grande', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça em gomos grande Churraskit, peça — ideal para churrasco' },
  { id: 142, name: 'Linguiça Mista Fina', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Linguiça mista fina Perdigão, peça' },
  { id: 143, name: 'Salsicha Amarrada', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Salsicha tipo amarrada artesanal, peça' },
  { id: 144, name: 'Salsicha Frigonossa', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: '', description: 'Salsicha Frigonossa, pacote — para hot dog e lanches' },
  { id: 145, name: 'Salsicha Perdigão Hot Dog', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'un', image: '', description: 'Salsicha Perdigão Hot Dog, pacote — a preferida do Brasil' },
  { id: 146, name: 'Torresmo', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'un', image: '', description: 'Torresmo de porco, pacote — crocante e saboroso' },

  // --- Bacalhau ---
  { id: 147, name: 'Bacalhau Desfiado', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'un', image: '', description: 'Bacalhau desfiado, embalagem — prático para receitas' },
  { id: 148, name: 'Bacalhau Saith', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'kg', image: '', description: 'Bacalhau tipo Saith salgado seco, peça inteira' },
  { id: 149, name: 'Bacalhau Porto Peça', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'kg', image: '', description: 'Bacalhau do Porto, lombo/peça — premium para receitas especiais' },

  // ============================================================
  //  CONGELADOS
  // ============================================================

  // --- Bovinos ---
  { id: 150, name: 'Acém Congelado', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Acém bovino congelado, peça — corte versátil para cozidos e ensopados' },
  { id: 151, name: 'Carne Lagarto', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Lagarto bovino congelado, peça — ideal para rosbife e carne de panela' },
  { id: 152, name: 'Carne Picanha', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Picanha bovina congelada, peça — o corte nobre do churrasco brasileiro' },
  { id: 153, name: 'Contra-Filé', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Contra-filé bovino congelado, peça — macio e saboroso para grelhar' },
  { id: 154, name: 'Cupim Friboi', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Cupim bovino congelado Friboi, peça — suculento para churrasco lento' },
  { id: 155, name: 'Carne Moída Congelada', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Carne moída bovina congelada, pacote — prática para o dia a dia' },
  { id: 156, name: 'Almôndega Congelada', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: '', description: 'Almôndega bovina congelada, pacote — pronta para preparar' },

  // --- Suínos ---
  { id: 157, name: 'Costelinha de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: '', description: 'Costelinha suína congelada, peça — ideal para churrasco e assados' },
  { id: 158, name: 'Lombo de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: '', description: 'Lombo suíno congelado, peça — corte magro e versátil' },
  { id: 159, name: 'Pernil sem Osso Pif Paf', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: '', description: 'Pernil suíno sem osso Pif Paf, peça congelada — prático para assar' },
  { id: 160, name: 'Bacon em Cubos Congelado', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: '', description: 'Bacon em cubos congelado, pacote — pronto para usar em receitas' },
  { id: 161, name: 'Bacon Fatiado Congelado', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: '', description: 'Bacon fatiado congelado, pacote — praticidade no preparo' },

  // --- Linguiças ---
  { id: 162, name: 'Linguiça Toscana Nobre', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: '', description: 'Linguiça toscana Nobre congelada — sabor de carne suína temperada' },
  { id: 163, name: 'Linguiça Toscana Aurora Churrasco', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: '', description: 'Linguiça toscana Aurora para churrasco, congelada' },
  { id: 164, name: 'Linguiça Toscana Saudali', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: '', description: 'Linguiça toscana de pernil Saudali, congelada' },
  { id: 165, name: 'Linguiça Uay', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: '', description: 'Linguiça de carne bovina Uay, congelada' },

  // --- Aves ---
  { id: 166, name: 'Frango Congelado Inteiro', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Frango inteiro congelado, embalagem — ave limpa e pronta para preparo' },
  { id: 167, name: 'Asa de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Asa de frango congelada, pacote' },
  { id: 168, name: 'Filé de Peito de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Filé de peito de frango congelado, pacote — corte magro e versátil' },
  { id: 169, name: 'Coxa e Sobrecoxa de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Coxa e sobrecoxa de frango congelada, pacote — suculenta e saborosa' },
  { id: 170, name: 'Filé de Peito Seara', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Filé de peito de frango Seara congelado, pacote' },
  { id: 171, name: 'Filé de Coxa e Sobrecoxa', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Filé de coxa e sobrecoxa sem osso congelado, pacote' },
  { id: 172, name: 'Peito de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Peito de frango inteiro congelado, pacote' },
  { id: 173, name: 'Coxinha da Asa C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Coxinha da asa de frango C.Vale congelada, pacote' },
  { id: 174, name: 'Meio da Asa (Tulipa)', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Meio da asa de frango (tulipa) congelado, pacote — ideal para aperitivos' },
  { id: 175, name: 'Filé de Peito C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Filé de peito de frango C.Vale congelado, pacote' },
  { id: 176, name: 'Coração de Frango Perdigão', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Coração de frango Perdigão congelado, pacote — clássico do churrasco' },
  { id: 177, name: 'Filé Empanado C.Vale', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '', description: 'Filé de frango empanado C.Vale congelado, pacote — prático e crocante' },
  { id: 178, name: 'Linguiça de Frango C.Vale', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: '', description: 'Linguiça de frango C.Vale congelada — opção mais leve para churrasco' },
  { id: 179, name: 'Fígado de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Fígado de frango congelado, pacote' },
  { id: 180, name: 'Filé Sassami C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Filé sassami de frango C.Vale congelado — corte magro e delicado' },
  { id: 181, name: 'Moela de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: '', description: 'Moela de frango congelada, pacote' },

  // --- Empanados ---
  { id: 182, name: 'Chicken C.Vale', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '', description: 'Empanado de frango tipo chicken C.Vale congelado, pacote' },
  { id: 183, name: 'Chicken Baita', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '', description: 'Empanado de frango tipo chicken Baita congelado, pacote' },
  { id: 184, name: 'Steak Perdigão', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '', description: 'Steak empanado de frango Perdigão congelado, pacote' },

  // --- Hambúrguer ---
  { id: 185, name: 'Hambúrguer Aurora', category: 'Congelados', subcategory: 'Hambúrguer', price: null, unit: 'un', image: '', description: 'Hambúrguer de carne bovina Aurora congelado, caixa' },

  // --- Vegetais Congelados ---
  { id: 186, name: 'Mandioca Congelada (pacote)', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: '', description: 'Mandioca cozida e congelada, pacote — prática para fritar ou cozinhar' },
  { id: 187, name: 'Mandioca Congelada (a granel)', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'kg', image: '', description: 'Mandioca congelada a granel — para uso em grande volume' },
  { id: 188, name: 'Brócolis Congelado', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: '', description: 'Brócolis congelado, pacote — mantém nutrientes e praticidade' },
  { id: 189, name: 'Polenta Congelada Palito', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: '', description: 'Polenta palito congelada Val Mar — pronta para fritar, crocante por fora' },

  // --- Peixes e Frutos do Mar ---
  { id: 190, name: 'Filé de Tilápia', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: '', description: 'Filé de tilápia congelado — peixe branco suave e versátil' },
  { id: 191, name: 'Peixe Panga', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: '', description: 'Filé de peixe panga congelado — sabor neutro, ótimo para empanar' },

  // --- Batatas Congeladas ---
  { id: 192, name: 'Batata McCain', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: '', description: 'Batata pré-frita congelada McCain, pacote 2,5kg — corte tradicional' },
  { id: 193, name: 'Batata Quality Fries Canoa', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: '', description: 'Batata pré-frita congelada Quality Fries corte canoa — rústica e crocante' },
  { id: 194, name: 'Batata Quality Fries', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: '', description: 'Batata pré-frita congelada Quality Fries, pacote — corte palito premium' },
];
