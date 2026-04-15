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
  Secos: [
    'Achocolatados',
    'Açúcar',
    'Águas',
    'Cervejas',
    'Conservas',
    'Enlatados',
    'Farinhas',
    'Leite em Pó',
    'Margarinas',
    'Molhos e Condimentos',
    'Óleos',
    'Refrigerantes',
    'Snacks',
    'Sucos',
    'Descartáveis',
    'Embalagens',
    'Confeitaria',
  ],
  Resfriados: [
    'Apresuntados',
    'Bacalhau',
    'Bacon',
    'Calabresas',
    'Cream Cheese',
    'Manteiga e Margarina',
    'Mortadelas',
    'Presuntos',
    'Queijos',
    'Requeijão',
    'Salsichas',
  ],
  Congelados: [
    'Aves',
    'Batatas Congeladas',
    'Bovinos',
    'Empanados',
    'Hambúrguer',
    'Linguiças',
    'Peixes e Frutos do Mar',
    'Suínos',
    'Vegetais Congelados',
  ],
};

export const products = [
  // ============================================================
  //  SECOS (produtos alimentícios primeiro, embalagens/descartáveis por último)
  // ============================================================

  // --- Achocolatados ---
  { id: 49, name: 'Achocolatado Chocomil 200ml cx 27un', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'cx', image: 'https://dcdn-us.mitiendanube.com/stores/005/951/679/products/41d64c8d5f66ad872a0bc56e2d64ed4f-86eb74bdca024d506517561226354387-1024-1024.webp', description: 'Achocolatado Chocomil 200ml, caixa fechada com 27 unidades' },
  { id: 48, name: 'Nescau 370g Nestlé', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'un', image: 'https://drogal.vtexassets.com/arquivos/ids/246077/127059.jpg?v=638739838442770000', description: 'Achocolatado em pó Nescau Nestlé, lata 370g' },
  { id: 202, name: 'Toddy 370g', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/193863201/achocolatado-em-po-original-toddy-370g-1.jpg?v=638877504790370000', description: 'Achocolatado em pó Toddy original, pacote 370g' },

  // --- Açúcar ---
  { id: 1, name: 'Açúcar Refinado União 10/1kg', category: 'Secos', subcategory: 'Açúcar', price: null, unit: 'fardo', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1140918/g.jpg?v=639076962153600000', description: 'Fardo com 10 pacotes de 1kg' },

  // --- Águas ---
  { id: 55, name: 'Água Mineral Bioleve 510ml Com Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/5268960/5775906_null_1_Zoom.jpg', description: 'Água mineral com gás Bioleve, garrafa 510ml' },
  { id: 56, name: 'Água Mineral Bioleve 510ml Sem Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '/images/agua-bioleve-sem-gas.webp', description: 'Água mineral sem gás Bioleve, garrafa azul 510ml' },
  // Serra de Minas
  { id: 209, name: 'Água Mineral Serra de Minas 510ml Com Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '/images/agua-serra-de-minas.jpeg', description: 'Água mineral com gás Serra de Minas, garrafa 510ml' },
  { id: 210, name: 'Água Mineral Serra de Minas 510ml Sem Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: '/images/agua-serra-de-minas.jpeg', description: 'Água mineral sem gás Serra de Minas, garrafa 510ml' },

  // --- Cervejas (organizado por marca) ---
  // Antarctica
  { id: 196, name: 'Cerveja Antarctica Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://choppbrahmaexpress.vtexassets.com/arquivos/ids/158290/Cerveja-Antarctica-Pilsen-350ml-Lata-Pack-C18.png?v=638520635032970000', description: 'Cerveja Antarctica pilsen, lata 350ml, caixa com 18 unidades' },
  // Brahma
  { id: 69, name: 'Cerveja Brahma Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/106436980/cerveja-pilsen-brahma-chopp-lata-350ml-1.jpg', description: 'Cerveja Brahma Chopp pilsen, lata 350ml' },
  { id: 197, name: 'Cerveja Brahma Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/211195/5474299_1.jpg', description: 'Cerveja Brahma Chopp pilsen, lata 350ml, caixa com 18 unidades' },
  { id: 70, name: 'Cerveja Brahma Latão 550ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/993610-1-18-04-2024-12-01-34-362.jpg', description: 'Cerveja Brahma Chopp pilsen, latão 550ml' },
  // Heineken
  { id: 198, name: 'Cerveja Heineken Lata 350ml Cx 12un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbr.vtexassets.com/arquivos/ids/189755264/image-0.jpg', description: 'Cerveja Heineken Lager, lata 350ml, caixa com 12 unidades' },
  { id: 199, name: 'Cerveja Heineken Long Neck 330ml Cx 24un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbr.vtexassets.com/arquivos/ids/189700272/image-0.jpg', description: 'Cerveja Heineken Lager, long neck 330ml, caixa com 24 unidades' },
  // Itaipava
  { id: 73, name: 'Cerveja Itaipava Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/191/32955191.png', description: 'Cerveja Itaipava pilsen, lata 350ml' },
  // Original
  { id: 200, name: 'Cerveja Original Lata 350ml Cx 12un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/216090/5699193_1.jpg', description: 'Cerveja Original, lata 350ml, caixa com 12 unidades' },
  // Skol
  { id: 72, name: 'Cerveja Skol Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/107629977/cerveja-skol-pilsen-lata-350ml-1.jpg', description: 'Cerveja Skol pilsen, lata 350ml' },
  { id: 201, name: 'Cerveja Skol Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/134558684/cerveja-skol-pilsen-350ml---18-unidades-1.jpg', description: 'Cerveja Skol pilsen, lata 350ml, caixa com 18 unidades' },
  { id: 71, name: 'Cerveja Skol Latão 500ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/107629978/cerveja-skol-pilsen-lata-473ml-1.jpg', description: 'Cerveja Skol pilsen, latão 500ml' },

  // --- Conservas (agrupado por família) ---
  // Azeitonas
  { id: 5, name: 'Alho Triturado Balde', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/alho balde triturado.webp', description: 'Alho triturado pronto para uso, balde' },
  { id: 8, name: 'Azeitona Chileninha Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/images/azeitona-chileninha.png', description: 'Azeitona chileninha preta, tipo portuguesa, balde 2kg' },
  { id: 10, name: 'Azeitona com Caroço Graúda Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona com caroco.webp', description: 'Azeitona verde com caroço, tamanho graúda, balde 2kg' },
  { id: 33, name: 'Azeitona com Caroço Miúda Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona com caroco.webp', description: 'Azeitona verde com caroço, tamanho miúda, balde 2kg' },
  { id: 9, name: 'Azeitona de Fita Cart. 10un', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona de fita.webp', description: 'Azeitona verde de fita em conserva, cartela com 10 unidades' },
  { id: 11, name: 'Azeitona Fatiada Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona fatida.webp', description: 'Azeitona verde fatiada, balde 2kg' },
  { id: 12, name: 'Azeitona Preta Fatiada Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona preta fatiada.webp', description: 'Azeitona preta fatiada em conserva, balde 2kg' },
  { id: 14, name: 'Azeitona Verde sem Caroço Balde 2kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/azeitona sem caroco.webp', description: 'Azeitona verde sem caroço em conserva, balde 2kg' },
  // Champignon
  { id: 20, name: 'Champignon Fatiado Balde', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/produtos/champinhon fatiado.jpg', description: 'Cogumelos champignon fatiados em conserva, balde' },
  // Ervilhas
  { id: 21, name: 'Ervilha Lata 1,7kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1147595/m.jpg?v=639076996519730000', description: 'Ervilha em conserva, lata 1,7kg' },
  // Milho Verde
  { id: 41, name: 'Milho Verde Lata 1,7kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://megag.com.br/v21/wp-content/uploads/2021/08/Milho-Verde-Quero.jpg', description: 'Milho verde em conserva, lata 1,7kg' },
  { id: 42, name: 'Milho Verde Lata 200g', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/images/milho-lata-200g.png', description: 'Milho verde em conserva, lata 200g' },
  // Palmitos
  { id: 51, name: 'Palmito Inteiro 300g', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: '/images/palmito-300g.webp', description: 'Palmito inteiro em conserva, vidro 300g' },
  { id: 50, name: 'Palmito Inteiro Tolete 1,8kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/977444/m.jpg?v=639047151340700000', description: 'Palmito inteiro em tolete, vidro 1,8kg — ideal para uso profissional' },

  // --- Enlatados ---
  { id: 6, name: 'Atum Ralado Chicharro lata 410g Randy', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: '/produtos/atum chicharro.jpg', description: 'Atum ralado tipo chicharro, lata 410g marca Randy' },
  { id: 53, name: 'Creme de Leite Italac 200g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/235/32987235.jpg', description: 'Creme de leite UHT Italac, caixinha 200g' },
  { id: 25, name: 'Leite Condensado 395g Italac', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1141006/g.jpg?v=639076962610100000', description: 'Leite condensado Italac, lata 395g' },

  // --- Confeitaria ---
  { id: 236, name: 'Recheio Forneavel Chocolate ao Leite Harald Confeiteiro 1,010kg', category: 'Secos', subcategory: 'Confeitaria', price: null, unit: 'un', image: '/images/confeiteiro-chocolate-ao-leite.webp', description: 'Recheio forneavel Harald Confeiteiro, sabor chocolate ao leite, 1,010kg — para pizzas, crepes, pasteis e tapiocas' },
  { id: 237, name: 'Recheio Forneavel Chocolate Branco Harald Confeiteiro 1,010kg', category: 'Secos', subcategory: 'Confeitaria', price: null, unit: 'un', image: '/images/confeiteiro-chocolate-branco.webp', description: 'Recheio forneavel Harald Confeiteiro, sabor chocolate branco, 1,010kg — para pizzas, crepes, pasteis e tapiocas' },
  { id: 47, name: 'Mortadela Mini Saudali 400g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://tdc0wy.vteximg.com.br/arquivos/ids/164754-1000-1000/MORTADELA-SAUDALI-TUBULAR-500G-SUINA.png?v=638615652480100000', description: 'Mortadela mini tubular Saudali, 400g — prática para lanches e sanduíches' },
  { id: 139, name: 'Salame Italiano - Peça', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'kg', image: '/images/salame-italiano-peca.webp', description: 'Salame tipo italiano Pamplona, peça inteira' },
  { id: 203, name: 'Salame Italiano Fatiado Cart. 100g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: '/images/salame-italiano-fatiado.jpg', description: 'Salame tipo italiano fatiado Pamplona, cartela 100g' },

  // --- Farinhas ---
  { id: 24, name: 'Farinha de Trigo Aniela 10/1kg', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'fardo', image: 'https://assets.instabuy.app.br/ib.item.image.large/l-b7c754c7e4da47b3aa2762438e95ecca.jpeg', description: 'Fardo com 10 pacotes de 1kg' },
  { id: 204, name: 'Farinha de Trigo Coamo Originale Purissima 10x1kg Fd 10kg', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'fardo', image: 'https://coamo-alimentos-production.s3.us-east-1.amazonaws.com/medias/a6989bfe-8af4-4f4a-a970-eeeb324f75be', description: 'Farinha de trigo Coamo Originale Purissima, fardo 10x1kg (10kg)' },
  { id: 205, name: 'Farinha de Trigo Coamo Especial Pastel 5x5kg Fd 25kg', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'fardo', image: 'https://coamo-alimentos-staging.s3-accelerate.amazonaws.com/medias/de46319ff2a2ef307cdbd93581a489b3', description: 'Farinha de trigo Coamo Especial Pastel, fardo 5x5kg (25kg)' },
  { id: 206, name: 'Farinha de Trigo Coamo Especial Pizza 5x5kg Fd 25kg', category: 'Secos', subcategory: 'Farinhas', price: null, unit: 'fardo', image: 'https://coamo-alimentos-staging.s3-accelerate.amazonaws.com/medias/12d8c790eb48170a46d152e73375ce43', description: 'Farinha de trigo Coamo Especial Pizza, fardo 5x5kg (25kg)' },

  // --- Leite em Pó ---
  { id: 27, name: 'Leite Integral Cooper Rita', category: 'Secos', subcategory: 'Leite em Pó', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1220177/leite_uht_integral_1l_25_1_ddc37c4a6a4774a8dbc1961685816d76.jpg', description: 'Leite integral UHT Cooper Rita, caixa 1 litro' },

  // --- Margarinas (agrupado por marca) ---
  // Claybom
  { id: 36, name: 'Margarina Claybom 250g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/989015-11-07-2024-16-06-14-60.jpg', description: 'Margarina Claybom cremosa com sal, pote 250g' },
  { id: 40, name: 'Margarina Claybom 500g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://www.extrabom.com.br/media/produtos/350x350/4274_extrabom_margarinas_margarina-cremosa-com-sal-claybom-pote-500g.jpg_.jpeg', description: 'Margarina Claybom cremosa com sal, pote 500g' },
  // Qualy
  { id: 37, name: 'Margarina Qualy 250g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://mercantilnovaera.vtexassets.com/arquivos/ids/217072-800-auto?v=638527804629800000&width=800&height=auto&aspect=true', description: 'Margarina Qualy com sal, pote 250g — sabor e cremosidade' },
  { id: 38, name: 'Margarina Qualy Cremosa 500g', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://mercantilnovaera.vtexassets.com/arquivos/ids/217077-800-auto?v=638527812128230000&width=800&height=auto&aspect=true', description: 'Margarina Qualy Cremosa com sal, pote 500g — textura extra macia' },
  // Coamo
  { id: 35, name: 'Margarina Coamo Cremosa Balde 15kg 80% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.allpan.com.br/409-large_default/margarina-80-lipidios-com-sal-145kg-coamo.jpg', description: 'Margarina Coamo Cremosa com sal, 80% lipídios, balde 15kg — textura macia para panificação e confeitaria' },
  { id: 34, name: 'Margarina Coamo Fry Balde 15kg 50% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.allpan.com.br/407-large_default/margarina-50-lipidios-com-sal-145kg-coamo.jpg', description: 'Margarina Coamo Fry com sal, 50% lipídios, balde 15kg — ideal para frituras e uso profissional' },
  { id: 39, name: 'Margarina Coamo Sem Sal Balde 15kg 80% Lipídios', category: 'Secos', subcategory: 'Margarinas', price: null, unit: 'un', image: 'https://loja.stampafood.com.br/2543-large_default/margarina-80-lipidios-sem-sal-balde-145-kg-coamo.webp', description: 'Margarina Coamo sem sal, 80% lipídios, balde 15kg — para receitas que pedem controle de sal' },

  // --- Molhos e Condimentos (agrupado por família) ---
  // Cepera (ketchup + mostarda juntos)
  { id: 17, name: 'Ketchup Galão Cepera', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/catchup galao cepera.webp', description: 'Ketchup Cepera, galão tamanho institucional' },
  { id: 46, name: 'Mostarda Cepera Galão', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.cepera.com.br/cms/wp-content/uploads/2019/05/Mostarda-amarela-33kg.jpg', description: 'Mostarda amarela Cepera, galão 3,3kg — ideal para lanchonetes e uso profissional' },
  // Predilecta (ketchup + mostarda juntos)
  { id: 18, name: 'Ketchup Galão Predilecta', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/catchup galao predileta.webp', description: 'Ketchup Predilecta, galão tamanho institucional' },
  { id: 207, name: 'Mostarda Galão Predilecta', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/images/mostarda-galao-predilecta.webp', description: 'Mostarda Predilecta, galão 3,3kg — tamanho institucional' },
  { id: 45, name: 'Molho Barbecue Predilecta Galão', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://ccndistribuidora.vtexassets.com/arquivos/ids/162003/MOLHO-BARBECUE-PREDILECTA-GALAO-35KG.jpg?v=638201288482730000', description: 'Molho barbecue Predilecta, galão 3,5kg — tamanho institucional para churrascarias e food service' },
  // Maionese
  { id: 29, name: 'Maionese Balde Mariana', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/962968-06-09-2024-11-43-57-541.jpg', description: 'Maionese Mariana, balde tamanho institucional — ideal para food service' },
  { id: 32, name: "Maionese Hellmann's 500g", category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://muffatosupermercados.vtexassets.com/arquivos/ids/417314/7894000050034_1.jpg?v=638963334320400000', description: "Maionese Hellmann's tradicional, pote 500g" },
  { id: 44, name: 'Molho de Pizza Predilecta Bag 4,1kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://gerenciadorpd.com.br/assets/images/produtos/7896292302341_234_Molho%20para%20Pizza_3,1%20kg_Bag_0263_4296.png', description: 'Molho para pizza Predilecta, bag 4,1kg — tamanho institucional para pizzarias e food service' },
  // Orégano
  { id: 208, name: 'Orégano Pacote 1kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/images/oregano-1kg.jpeg', description: 'Orégano desidratado, pacote 1kg' },
  // Alho
  { id: 4, name: 'Alho Frito 500g', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: '/produtos/alho frito.jpeg', description: 'Alho frito crocante, pacote 500g' },

  // --- Óleos ---
  { id: 231, name: 'Oleo de Soja Liza 900ml pct 6un', category: 'Secos', subcategory: 'Óleos', price: null, unit: 'pct', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/131582015/oleo-de-soja-liza-900ml-1.jpg?v=638319501126800000', description: 'Oleo de soja Liza 900ml, pacote com 6 unidades' },
  { id: 232, name: 'Oleo de Soja 900ml cx com 20un Soya/Vitaliv/Coamo', category: 'Secos', subcategory: 'Óleos', price: null, unit: 'cx', image: '/images/oleos-soja-3marcas.png', description: 'Oleo de soja 900ml, caixa com 20 unidades — marcas Soya, Vitaliv ou Coamo' },
  { id: 23, name: 'Gordura Vegetal 15kg Coamo', category: 'Secos', subcategory: 'Óleos', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/970643/p.jpg?v=639047113475230000', description: 'Gordura vegetal Coamo Fry, balde 15kg' },

  // --- Refrigerantes (agrupado por marca) ---
  // Coca-Cola
  { id: 64, name: 'Coca-Cola Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/59/33000059.png', description: 'Refrigerante Coca-Cola original, lata 350ml' },
  // Fanta
  { id: 62, name: 'Fanta Laranja Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/89/33022089.png', description: 'Refrigerante Fanta sabor laranja, lata 350ml' },
  { id: 63, name: 'Fanta Uva Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/147300954/fanta-uva-lata-350-ml-1.jpg', description: 'Refrigerante Fanta sabor uva, lata 350ml' },
  // Sprite
  { id: 61, name: 'Sprite Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/861/32993861.png', description: 'Refrigerante Sprite limão, lata 350ml' },
  // H2O
  { id: 57, name: 'H2O Bioleve Limão', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/24203350/5209447_1.jpg', description: 'Refrigerante H2O Bioleve sabor limão, garrafa PET' },
  { id: 59, name: 'H2O Bioleve Limoneto', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: '/images/h2o-limoneto.webp', description: 'Refrigerante H2O Bioleve sabor limoneto, garrafa PET' },

  // --- Snacks ---
  { id: 16, name: 'Batata Palha', category: 'Secos', subcategory: 'Snacks', price: null, unit: 'un', image: '/produtos/batata palha.jpg', description: 'Batata palha crocante e saborosa' },

  // --- Sucos ---
  { id: 66, name: 'Gatorade Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/106450199/gatorade-sabor-laranja-500ml-1.jpg', description: 'Isotônico Gatorade, diversos sabores, garrafa 500ml' },
  { id: 67, name: 'Suco Bioleve Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: 'https://agualibra.com.br/wp-content/uploads/2019/06/suco-bioleve-390-ml.jpg', description: 'Suco Bioleve, diversos sabores naturais' },

  // --- Descartáveis (por último) ---
  { id: 92, name: 'Embalagem de Pizza Grande Nº 35', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: '/images/caixa-pizza-grande.jpg', description: 'Caixa octogonal para pizza grande nº 35' },

  // --- Molhos e Condimentos (Temperos Sazon) ---
  { id: 234, name: 'Tempero Amaciante de Carnes Sazon 1,1kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.ajinomotofoodservice.com.br/wp/content/uploads/2025/06/amaciante-de-carne_food-service_1kg_ajinomoto.png', description: 'Tempero amaciante de carnes Sazon, pacote 1,1kg — uso profissional' },
  { id: 235, name: 'Caldo de Carne Sazon 1,1kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.ajinomotofoodservice.com.br/wp/content/uploads/2025/06/caldo_sazon_carne_11kg_ajinomoto.png', description: 'Caldo de carne Sazon, pacote 1,1kg — tempero profissional para caldos e sopas' },

  // Hamburgueiras
  { id: 98, name: 'Hamburgueira CH2 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x1000/446/446822/produto/126182413/shopping---2023-07-05t142524-699-rcvsly7tea.jpg', description: 'Embalagem isopor para hambúrguer CH2 média, caixa com 100 unidades' },
  { id: 99, name: 'Hamburgueira CH3 cx 50un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x1000/446/446822/produto/126180789/shopping---2023-07-05t142524-699-uyag22s2xh.jpg', description: 'Embalagem isopor para hambúrguer CH3 grande, caixa com 50 unidades' },
  // Marmitex
  { id: 94, name: 'Marmitex nº8 cx 100un PT102', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170127020_marmitex-isopor-n8-copobras-750-ml-100-unidades-7a5c87ec.jpg', description: 'Marmitex isopor nº8 com tampa, caixa com 100 unidades, modelo PT102' },
  { id: 95, name: 'Marmitex nº9 cx 100un PT104', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170170456_marmitex-isopor-n9-copobras-1100-ml-100-unidades-6de9ffec.jpg', description: 'Marmitex isopor nº9 com tampa, caixa com 100 unidades, modelo PT104' },
  { id: 96, name: 'Marmitex PT100 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x700/2074/2074852/produto/289077457/15170127035_marmitex-isopor-n7-copobras-500-ml-100-unidades-cc0febf9-8y8ib0juza.jpg', description: 'Marmitex isopor redondo PT100 com tampa, caixa com 100 unidades' },
  { id: 97, name: 'Marmitex PT500', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: 'https://eficazjf.com.br/wp-content/uploads/2019/02/pt500-ret.jpg', description: 'Marmitex isopor redondo PT500 com tampa, tamanho grande' },

  // --- Embalagens (por último) ---
  { id: 74, name: 'Bobina Picotada Good Roll 20x30', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://acdn-us.mitiendanube.com/stores/005/989/335/products/bobina-plastica-picotada-20x30cm-good-roll-500-unidades-dfbd08790596a7619817443015297151-1024-1024.webp', description: 'Bobina plástica picotada Good Roll 20x30cm, rolo' },
  { id: 211, name: 'Bobina Picotada Good Roll 30x40', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://acdn-us.mitiendanube.com/stores/005/989/335/products/bobina-plastica-picotada-30x40cm-good-roll-500-unidades-3b1e8a1594e6366bfc17443015316110-1024-1024.webp', description: 'Bobina plástica picotada Good Roll 30x40cm, rolo' },
  { id: 212, name: 'Bobina Picotada Good Roll 35x45', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/2500x2500/2476/2476561/produto/199891541/bobina-plastica-picotada-30x40cm-good-roll-500-unidades-jhwiqc.jpg', description: 'Bobina plástica picotada Good Roll 35x45cm, rolo' },
  { id: 213, name: 'Bobina Picotada Good Roll 40x60', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://acdn-us.mitiendanube.com/stores/005/989/335/products/bobina-plastica-picotada-40x60cm-good-roll-400-unidades-c98ed995bc1fd83f4d17443015315962-1024-1024.webp', description: 'Bobina plástica picotada Good Roll 40x60cm, rolo' },
  { id: 77, name: 'Embalagem para Frios - Papel Acoplado', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170170266_papel-acoplado-para-frios-embalefrios-400-nidades-a07d3dee.jpg', description: 'Papel acoplado para embalar frios' },
  // Sacos plásticos
  { id: 78, name: 'Saco Plástico 40x60', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/14048702708c2bc7da3.jpg', description: 'Saco plástico transparente 40x60cm' },
  { id: 79, name: 'Saco Plástico 50x80', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://biripelembalagens.com.br//controle/arquivo/saco-plastico-virgem-cesta-basica-50x80-altaplast-com-100-unidades.jpg', description: 'Saco plástico transparente 50x80cm' },
  { id: 75, name: 'Saco Plástico para Lanche 22x17', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1037887/saco_plastico_para_lanche_leitoso_22x17cm_pacote_1kg_105565_1_3f243dda948d14cf59e5c601a2dd1252.png', description: 'Saco plástico leitoso para lanche 22x17cm' },
  { id: 76, name: 'Saco Plástico para Lanche 24x19', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x1000/1027/1027618/produto/45978670/2be1242cf5.jpg', description: 'Saco plástico leitoso para lanche 24x19cm' },
  // Sacolas
  { id: 82, name: 'Sacola 30x40', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/56726937/f388eb1ac6.jpg', description: 'Sacola plástica branca 30x40cm' },
  { id: 85, name: 'Sacola 30x40 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/613137/sacola_plastica_branca_reforcada_30x40_pead_600un_3kg_extrusa_pack_631_1_20200824145703.jpg', description: 'Sacola plástica branca reforçada 30x40cm' },
  { id: 80, name: 'Sacola 38x48', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/56726931/13efadbe2f.jpg', description: 'Sacola plástica branca 38x48cm' },
  { id: 86, name: 'Sacola 40x50 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/613137/sacola_plastica_branca_reforcada_40x50_pead_350un_3kg_extrusa_pack_593_1_20200721160951.jpg', description: 'Sacola plástica branca reforçada 40x50cm' },
  { id: 87, name: 'Sacola 50x60 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1233279/sacola_plastica_leitosa_reforcada_50x60_c_3_kg_grande_123_1_b949259013ffdd81489fc3e7580f9f77.png', description: 'Sacola plástica branca reforçada 50x60cm' },
  { id: 83, name: 'Sacola Colorida 30x40 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://static.clickembalagens.com.br/product_images/1280x1280/b/996/161464-19-02-2025-anuncio-20sacola-20reciclada-20colorida-20-201-28488.png', description: 'Sacola plástica colorida reciclada 30x40cm' },
  { id: 84, name: 'Sacola Colorida 40x50 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x1000/1027/1027618/produto/45810663/b6721541ce.jpg', description: 'Sacola plástica colorida reciclada 40x50cm' },
  { id: 81, name: 'Sacola Colorida 50x60 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://www.sacariasafra.com.br/img/produtos/3fbb1d85ac082faea5c8f8ff40054044.jpg', description: 'Sacola plástica colorida reciclada 50x60cm' },

  // ============================================================
  //  RESFRIADOS (subcategorias em ordem alfabética, produtos agrupados por família)
  // ============================================================

  // --- Apresuntados ---
  { id: 100, name: 'Apresuntado Aurora - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://www.auroraalimentos.com.br/wp-content/uploads/2022/04/APRESUNTADO-AURORA-3.7-KG-517.png', description: '' },
  { id: 102, name: 'Apresuntado Nobre / Peperi - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://peperi.coop.br/wp-content/uploads/2022/05/520-Apresuntado-Peperi-flat-Nobre-Peperi.png', description: '' },
  { id: 103, name: 'Apresuntado Perdigão - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://apoioentrega.vteximg.com.br/arquivos/ids/464695-500-500/APRESUNTADO-PERDIGAO-KG-PECA.jpg?v=637439082532270000', description: '' },
  { id: 105, name: 'Apresuntado Sadia - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://images-food.ifcshop.com.br/produto/44708_0_20220103133041.jpg', description: '' },

  // --- Bacalhau ---
  { id: 106, name: 'Lombo Canadense Nobre - Peca', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://megag.com.br/v21/wp-content/uploads/2021/07/arq_973Lombo-Nobre-Tipo-Canadense-1Kg.jpg', description: 'Lombo canadense tipo Nobre, peca' },
  { id: 147, name: 'Bacalhau Desfiado Pct 1kg', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'un', image: '/images/bacalhau-desfiado.jpeg', description: 'Bacalhau desfiado Oceani, pacote 1kg' },
  { id: 149, name: 'Bacalhau Saithe - Caixa 25kg', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'cx', image: '/images/bacalhau-saithe-cx25kg.webp', description: 'Bacalhau salgado Saithe, caixa com 25kg' },
  { id: 148, name: 'Bacalhau Saithe - Peça', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'kg', image: '/images/bacalhau-saithe-peca.jpg', description: '' },

  // --- Cream Cheese (agrupado por marca) ---
  // Catupiry
  { id: 117, name: "D'Allora Requeijão 1,8kg", category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '/images/dallora-requeijao.png', description: "Mistura de leite e gordura vegetal e amido sabor requeijão D'Allora, 1,8kg — ideal para pizzas, salgados e lanches" },
  { id: 217, name: "Cheddar D'Allora Bis 1,8kg", category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '/images/cheddar-dallora.jpg', description: "Requeijão cremoso sabor cheddar D'Allora, bisnaga 1,2kg — ideal para pizzas, salgados e lanches" },
  // Scala
  { id: 118, name: 'Requeijao Scala Bisnaga 1,5kg', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: 'https://www.sondadelivery.com.br/img.aspx/sku/1212940/530/7898039680187.png', description: 'Requeijao Scala bisnaga, embalagem 1,5kg' },
  { id: 119, name: 'Cheddar Scala 1,5kg', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://www.scala.com.br/wp-content/uploads/2020/04/mockups-1000x1000_cheddar-400-g.png', description: 'Queijo tipo cheddar Scala, embalagem 1,5kg' },
  { id: 114, name: 'Cream Cheese Scala Bis 1,2kg', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: '/images/cream-cheese-scala.webp', description: 'Cream cheese queijo cremoso Scala, bisnaga 1,2kg' },

  // --- Manteiga e Margarina ---
  { id: 131, name: 'Manteiga Scala Pote 200g', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: null, unit: 'un', image: '/images/manteiga-scala-200g.webp', description: 'Manteiga de primeira qualidade com sal Scala, pote 200g' },

  // --- Mortadelas ---
  { id: 113, name: 'Mortadela Tradicional Perdigão - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: '/images/mortadela-perdigao.jpg', description: '' },
  { id: 110, name: 'Mortadela Frigossa 2kg - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'pc', image: '/images/mortadela-frigonossa.jpg', description: '' },
  { id: 111, name: 'Mortadela Marba - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: '/images/mortadela-marba.png', description: '' },
  { id: 112, name: 'Mortadela Ouro - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/4189-18-09-2023-11-03-25-806.jpg', description: '' },

  // --- Presuntos ---
  { id: 107, name: 'Presunto Cozido Sadia - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/assets/images/_/products/ce316db01279c02630a24352ab32bed99b881819.webp', description: '' },
  { id: 195, name: 'Presunto Filé Mignon Suíno Sadia - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://redemix.vteximg.com.br/arquivos/ids/218916-500-500/7435.png?v=638524206461000000', description: '' },
  { id: 109, name: 'Presunto Perdigão - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1272117/g.jpg.jpg?v=639098738599970000', description: '' },
  { id: 108, name: 'Presunto Rio Sul - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: '/images/presunto-rio-sul.jpg', description: '' },

  // --- Queijos (agrupado por família) ---
  { id: 128, name: 'Espeto de Queijo Coalho', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: 'https://www.vivaespetos.com.br/wp-content/uploads/2019/05/quijocoalho.jpg', description: '' },
  // Mussarela
  { id: 124, name: 'Mussarela Nova Esperança - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/mussarela-nova-esperanca.jpeg', description: '' },
  { id: 125, name: 'Mussarela Roseira - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/mussarela-roseira.jpeg', description: '' },
  // Parmesão
  { id: 127, name: 'Parmesão Scala', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: '/images/parmesao-scala.jpg', description: '' },
  { id: 216, name: 'Queijo Parmesão - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/parmesao-minas-mil.png', description: 'Queijo parmesão Minas Mil, peça inteira' },
  // Queijos diversos
  { id: 122, name: 'Queijo Gorgonzola - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/queijo-gorgonzola.jpg', description: '' },
  { id: 123, name: 'Queijo Minas Padrão Nova Esperança - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/queijo-minas-padrao.jpg', description: '' },
  { id: 126, name: 'Queijo Prato - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/queijo-prato.jpeg', description: '' },
  { id: 120, name: 'Queijo Provolone - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: '/images/queijo-provolone.jpeg', description: '' },

  // --- Requeijão ---
  { id: 130, name: 'Requeijão Scala', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: 'https://www.scala.com.br/wp-content/uploads/2020/06/mockups-1000x1000_requeijao-tradicional-200-g.png', description: '' },

  // --- Salames e Embutidos (agrupado por família) ---
  // Bacon
  { id: 132, name: 'Bacon Perdigão - Peça', category: 'Resfriados', subcategory: 'Bacon', price: null, unit: 'kg', image: '/images/bacon-perdigao.jpg', description: '' },
  { id: 133, name: 'Bacon Pernil Adeel - Peça', category: 'Resfriados', subcategory: 'Bacon', price: null, unit: 'kg', image: '/images/bacon-adeel.jpg', description: 'Bacon especial pernil Adeel, peça' },
  { id: 134, name: 'Bacon Sadia - Peça', category: 'Resfriados', subcategory: 'Bacon', price: null, unit: 'kg', image: '/images/bacon-sadia.jpg', description: '' },
  // Calabresa
  { id: 136, name: 'Calabresa Frigonossa - Peça', category: 'Resfriados', subcategory: 'Calabresas', price: null, unit: 'kg', image: 'https://www.friossemlimite.com.br/loja/src/uploads/produtos/a03c25b59d9cced43d1b59ced4b31ec1/20230227135030.jpg', description: '' },
  { id: 137, name: 'Calabresa Reta Seara - Peça', category: 'Resfriados', subcategory: 'Calabresas', price: null, unit: 'kg', image: 'https://megag.com.br/v21/wp-content/uploads/2025/07/686.jpg', description: '' },
  { id: 138, name: 'Calabresa Sadia Pct 2,5kg', category: 'Resfriados', subcategory: 'Calabresas', price: null, unit: 'un', image: '/images/calabresa-sadia.webp', description: 'Linguiça tipo calabresa Sadia, pacote 2,5kg' },
  { id: 214, name: 'Calabresa Reta Sadia Pct 2,5kg', category: 'Resfriados', subcategory: 'Calabresas', price: null, unit: 'un', image: '/images/calabresa-reta-sadia.jpg', description: 'Linguiça tipo calabresa reta Sadia Food Services, pacote 2,5kg' },
  { id: 215, name: 'Calabresa Perdigão Pct 2,5kg', category: 'Resfriados', subcategory: 'Calabresas', price: null, unit: 'un', image: '/images/calabresa-perdigao.png', description: 'Linguiça tipo calabresa Perdigão, pacote 2,5kg' },
  // Salsicha
  { id: 143, name: 'Salsicha Amarrada Salsichão - Peça', category: 'Resfriados', subcategory: 'Salsichas', price: null, unit: 'kg', image: '/images/salsicha-salsichao.jpeg', description: 'Salsicha amarrada tipo salsichão Frigonossa, peça' },

  // ============================================================
  //  CONGELADOS — Organizado: Aves (cx 20kg primeiro), Bovinos (alfabetico), demais
  // ============================================================

  // --- Aves — Caixa 20kg (ordem alfabetica) ---
  { id: 167, name: 'Asa de Frango cx 20kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: '/images/asa-frango-real.jpg', description: 'Asa de frango congelada, caixa 20kg' },
  { id: 169, name: 'Coxa e Sobrecoxa de Frango cx 20kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: '/images/coxa-sobrecoxa-real.webp', description: 'Coxa e sobrecoxa de frango congelada, caixa 20kg' },
  { id: 168, name: 'File de Peito de Frango cx 20kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: '/images/file-peito-cancao.webp', description: 'File de peito de frango congelado, sem osso e sem pele, caixa 20kg' },
  { id: 174, name: 'Meio da Asa (Tulipa) cx 20kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: '/images/meio-asa-levo.jpg', description: 'Meio da asa de frango (tulipa) congelado, caixa 20kg' },
  { id: 172, name: 'Peito de Frango com Osso cx 20kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: '/images/peito-frango-real.jpg', description: 'Peito de frango com osso congelado, caixa 20kg' },

  // --- Aves — Pacotes e outros (ordem alfabetica) ---
  { id: 173, name: 'Coxinha da Asa IQF Pioneiro cx 10,5kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'cx', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1143624/g.jpg?v=639076976496930000', description: 'Coxinha da asa de frango IQF Pioneiro congelada, caixa 10,5kg' },
  { id: 242, name: 'Coxinha da Asa Pioneiro pct', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1143624/g.jpg?v=639076976496930000', description: 'Coxinha da asa de frango Pioneiro congelada, pacote' },
  { id: 171, name: 'File de Coxa e Sobrecoxa', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/File-de-Coxa-e-Sobrecoxa-Seara-1kg.webp', description: 'File de coxa e sobrecoxa sem osso congelado, pacote' },
  { id: 180, name: 'Filezinho Sassami IQF pct 1kg', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'un', image: '/images/filezinho-sassami-cvale.png', description: 'Filezinho sassami de frango congelado IQF, pacote 1kg' },
  { id: 166, name: 'Frango Congelado Inteiro', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/Frango-Inteiro-com-Miudos-Seara.webp', description: 'Frango inteiro congelado — ave limpa e pronta para preparo' },

  // --- Bovinos (ordem alfabetica) ---
  { id: 150, name: 'Acem', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/30908275/5936527_1.jpg?v=637770235244900000', description: 'Acem bovino congelado — corte versatil para cozidos e ensopados' },
  { id: 153, name: 'Contra File', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/209437/5283655_1.jpg?v=637272509350000000', description: 'Contra file bovino congelado — macio e saboroso para grelhar' },
  { id: 219, name: 'Costela Desfiada Bovina pct 1kg', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'un', image: '/images/costela-desfiada-quali.jpg', description: 'Carne desfiada bovina costela congelada, pacote 1kg — pronta para uso' },
  { id: 223, name: 'Costela em Tiras', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://coopsp.vtexassets.com/arquivos/ids/234672-800-800?v=638337717002000000', description: 'Costela bovina em tiras congelada — ideal para churrasco' },
  { id: 224, name: 'Costela Minga', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://muffatosupermercados.vtexassets.com/arquivos/ids/391751/318136.png?v=638621946809470000', description: 'Costela minga bovina congelada — corte tradicional para cozinhar' },
  { id: 225, name: 'Coxao Duro', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://swiftbr.vteximg.com.br/arquivos/ids/215449/620155-bife-de-coxao-duro-bandeja_inn.jpg?v=639100772770230000', description: 'Coxao duro bovino congelado — ideal para bifes e carne de panela' },
  { id: 221, name: 'Cubos Bovinos pct 2kg', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/163245108/55e5280c45ec4f718f61b7b7ab33177c.jpg?v=638548057473930000', description: 'Carne bovina em cubos congelada, pacote 2kg — pratica para estrogonofe e espetinhos' },
  { id: 154, name: 'Cupim', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/206545333-200-auto/209104_1.jpg?v=638984627549530000', description: 'Cupim bovino congelado — suculento para churrasco lento' },
  { id: 226, name: 'Figado Bovino', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://swiftbr.vteximg.com.br/arquivos/ids/212831/616098-iscas-de-figado_inn.jpg?v=639005482425070000', description: 'Figado bovino congelado — rico em ferro, ideal para acebolado' },
  { id: 227, name: 'File Mignon', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://swiftbr.vteximg.com.br/arquivos/ids/214805/621390-bife-de-file-mignon_inn.jpg?v=639082345647870000', description: 'File mignon bovino congelado — corte premium, macio e suculento' },
  { id: 228, name: 'Fraldinha', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/288474/5870593_1.jpg?v=637272661125200000', description: 'Fraldinha bovina congelada — sabor intenso para churrasco' },
  { id: 151, name: 'Lagarto', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/206545356/295914_1.jpg?v=638984627687830000', description: 'Lagarto bovino congelado — ideal para rosbife e carne de panela' },
  { id: 155, name: 'Carne Moida', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/200417/9421769_1.jpg?v=637272446135900000', description: 'Carne moida bovina congelada, pacote — pratica para o dia a dia' },
  { id: 229, name: 'Patinho', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://swiftbr.vteximg.com.br/arquivos/ids/214239/618212-cubos-de-patinho_inn.jpg?v=639064132810270000', description: 'Patinho bovino congelado — corte magro, ideal para moer ou bifes' },
  { id: 152, name: 'Picanha', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/5706852/peca-de-picanha-bovina-congelada-carrefour-12kg-1.jpg?v=637327743915770000', description: 'Picanha bovina congelada — o corte nobre do churrasco brasileiro' },
  { id: 230, name: 'Ponta de Peito', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1275984/p.jpg.jpg?v=639098759773300000', description: 'Ponta de peito bovina congelada — corte suculento para churrasco e defumados' },

  // --- Batatas Congeladas ---
  { id: 192, name: 'Batata McCain', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: 'https://cdn.shopify.com/s/files/1/0579/9742/6861/files/image-removebg-preview-2024-06-03T172027.762.png?v=1717446094', description: 'Batata pre-frita congelada McCain, pacote 2,5kg — corte tradicional' },

  // --- Empanados ---
  { id: 218, name: 'Anel de Cebola McCain 1,05kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://gigavc.vtexassets.com/arquivos/ids/162439-800-auto?v=638971018245970000', description: 'Anel de cebola empanado McCain, pacote 1,05kg — pronto para fritar' },
  { id: 182, name: 'Chicken Cvale pct 1kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1006190/m.jpg?v=639047311322170000', description: 'Empanado de frango tipo chicken Cvale congelado, pacote 1kg' },
  { id: 240, name: 'Chicken Cvale pct 2,5kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '/images/chicken-cvale-2-5kg.png', description: 'Tirinhas de frango empanadas Cvale congeladas, pacote 2,5kg' },
  { id: 177, name: 'File Empanado pct 1kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/984197/m.jpg?v=639047189791330000', description: 'File de frango empanado congelado, pacote 1kg' },
  { id: 241, name: 'File Empanado Cvale pct 2,5kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '/images/file-empanado-cvale-2-5kg.png', description: 'Filezinho empanado de frango Cvale congelado, pacote 2,5kg' },
  { id: 145, name: 'Salsicha Hot Dog Perdigao pct 5kg', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: '/images/salsicha-hotdog-perdigao.png', description: 'Salsicha Hot Dog Perdigao congelada sem corante, pacote 5kg' },
  { id: 184, name: 'Steak Empanado', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1144319/m.jpg?v=639076979940300000', description: 'Steak empanado de frango congelado, pacote' },

  // --- Hamburger ---
  { id: 185, name: 'Hamburger Aurora 56g cx com 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: null, unit: 'cx', image: '/images/hamburger-aurora.webp', description: 'Hamburger Aurora 56g, caixa com 36 unidades' },
  { id: 238, name: 'Hamburger Fast Burger Bovino 56g cx com 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: null, unit: 'cx', image: '/images/hamburger-fast-burger.jpg', description: 'Hamburger de carne bovina Fast Burger 56g, caixa com 36 unidades' },
  { id: 239, name: 'Hamburger Fast Burger Bovino 90g cx com 36un', category: 'Congelados', subcategory: 'Hambúrguer', price: null, unit: 'cx', image: '/images/hamburger-fast-burger-aves.png', description: 'Hamburger de carne bovina Fast Burger 90g, caixa com 36 unidades' },

  // --- Linguicas ---
  { id: 178, name: 'Linguica de Frango', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1147626/p.jpg?v=639076996698230000', description: 'Linguica de frango congelada' },
  { id: 163, name: 'Linguica Toscana Churrasco', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/216849/5718023_1.jpg?v=637272523977170000', description: 'Linguica toscana para churrasco, congelada' },
  { id: 162, name: 'Linguica Toscana Nobre pct 700g', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1141213/p.jpg?v=639076963976870000', description: 'Linguica Toscana Nobre congelada, pacote 700g' },
  { id: 164, name: 'Linguica Toscana de Pernil', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://saudali.com.br/wp-content/uploads/2018/02/Linguica-de-Carne-Suina-1kg-Saudali-300x300.jpg', description: 'Linguica toscana de pernil, congelada' },

  // --- Peixes e Frutos do Mar ---
  { id: 190, name: 'File de Tilapia', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: 'https://mambodelivery.vtexassets.com/arquivos/ids/231336-800-auto?v=638810060653700000', description: 'File de tilapia congelado — peixe branco suave e versatil' },
  { id: 191, name: 'Peixe Panga', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: 'https://supernossoio.vtexassets.com/arquivos/ids/460658-800-auto?v=638575136391070000', description: 'File de peixe panga congelado — sabor neutro, otimo para empanar' },

  // --- Suinos ---
  { id: 160, name: 'Bacon em Cubos', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/182392256/3400808_1.jpg.jpg?v=638721074045730000', description: 'Bacon em cubos congelado, pacote — pronto para usar em receitas' },
  { id: 161, name: 'Bacon Fatiado', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/assets/images/_/products/19add854120bf278ddc9c87f6812e5584ef2c2c0.webp', description: 'Bacon fatiado congelado — praticidade no preparo' },
  { id: 157, name: 'Costelinha de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/37667216/costelinha-suina-sadia-cong-kg-1.jpg?v=637814111642370000', description: 'Costelinha suina congelada — ideal para churrasco e assados' },
  { id: 158, name: 'Lombo de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/214437/5608031_1.jpg?v=637272519057830000', description: 'Lombo suino congelado — corte magro e versatil' },
  { id: 159, name: 'Pernil sem Osso', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://www.pifpaf.com.br/wp-content/uploads/2024/11/00-060.545-PERNIL-SUINO-S-OSSO-TEMP.-CONG.-CX-18KG-1024x1024.png', description: 'Pernil suino sem osso congelado — pratico para assar' },

  // --- Vegetais Congelados ---
  { id: 188, name: 'Brocolis Congelado', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://mambodelivery.vtexassets.com/arquivos/ids/234191-800-auto?v=638862961980130000', description: 'Brocolis congelado, pacote — mantem nutrientes e praticidade' },
  { id: 186, name: 'Mandioca Congelada', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://www.seara.com.br/wp-content/uploads/2022/06/Mandioca-Supreme-Seara-Nature-600g.webp', description: 'Mandioca cozida e congelada, pacote — pratica para fritar ou cozinhar' },
  { id: 189, name: 'Polenta Congelada Palito', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://supernossoio.vtexassets.com/arquivos/ids/493386-800-auto?v=638756955561900000', description: 'Polenta palito congelada — pronta para fritar, crocante por fora' },

];
