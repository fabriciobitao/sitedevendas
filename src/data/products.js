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
  { id: 29, name: 'Maionese Balde Mariana', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/962968-06-09-2024-11-43-57-541.jpg', description: 'Maionese Mariana, balde tamanho institucional — ideal para food service' },
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
  { id: 44, name: 'Molho de Pizza Predilecta Bag 4,1kg', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://gerenciadorpd.com.br/assets/images/produtos/7896292302341_234_Molho%20para%20Pizza_3,1%20kg_Bag_0263_4296.png', description: 'Molho para pizza Predilecta, bag 4,1kg — tamanho institucional para pizzarias e food service' },
  { id: 45, name: 'Molho Barbecue Predilecta Galão', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://ccndistribuidora.vtexassets.com/arquivos/ids/162003/MOLHO-BARBECUE-PREDILECTA-GALAO-35KG.jpg?v=638201288482730000', description: 'Molho barbecue Predilecta, galão 3,5kg — tamanho institucional para churrascarias e food service' },
  { id: 46, name: 'Mostarda Cepera Galão', category: 'Secos', subcategory: 'Molhos e Condimentos', price: null, unit: 'un', image: 'https://www.cepera.com.br/cms/wp-content/uploads/2019/05/Mostarda-amarela-33kg.jpg', description: 'Mostarda amarela Cepera, galão 3,3kg — ideal para lanchonetes e uso profissional' },

  // --- Enlatados (continuação) ---
  { id: 47, name: 'Mortadela Mini Saudali 400g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://tdc0wy.vteximg.com.br/arquivos/ids/164754-1000-1000/MORTADELA-SAUDALI-TUBULAR-500G-SUINA.png?v=638615652480100000', description: 'Mortadela mini tubular Saudali, 400g — prática para lanches e sanduíches' },

  // --- Achocolatados ---
  { id: 48, name: 'Nescau 400g Nestlé', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'un', image: 'https://drogal.vtexassets.com/arquivos/ids/246077/127059.jpg?v=638739838442770000', description: 'Achocolatado em pó Nescau Nestlé, lata 400g — o sabor clássico para seu leite' },
  { id: 49, name: 'Achocolatado Chocomil 200ml cx 27un', category: 'Secos', subcategory: 'Achocolatados', price: null, unit: 'cx', image: 'https://dcdn-us.mitiendanube.com/stores/005/951/679/products/41d64c8d5f66ad872a0bc56e2d64ed4f-86eb74bdca024d506517561226354387-1024-1024.webp', description: 'Achocolatado Chocomil 200ml, caixa fechada com 27 unidades' },

  // --- Conservas (palmitos) ---
  { id: 50, name: 'Palmito Inteiro Tolete 1,8kg', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/977444/m.jpg?v=639047151340700000', description: 'Palmito inteiro em tolete, vidro 1,8kg — ideal para uso profissional' },
  { id: 51, name: 'Palmito Inteiro 300g', category: 'Secos', subcategory: 'Conservas', price: null, unit: 'un', image: 'https://supernossoio.vtexassets.com/arquivos/ids/1529960-800-auto?v=638924482553930000', description: 'Palmito inteiro em conserva, vidro 300g' },

  // --- Enlatados ---
  { id: 53, name: 'Creme de Leite Italac 200g', category: 'Secos', subcategory: 'Enlatados', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/235/32987235.jpg', description: 'Creme de leite UHT Italac, caixinha 200g' },

  // --- Águas ---
  { id: 55, name: 'Água Mineral Bioleve 510ml Com Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/5268960/5775906_null_1_Zoom.jpg', description: 'Água mineral com gás Bioleve, garrafa 510ml' },
  { id: 56, name: 'Água Mineral Bioleve 510ml Sem Gás', category: 'Secos', subcategory: 'Águas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/5268965/5775914_null_1_Zoom.jpg', description: 'Água mineral sem gás Bioleve, garrafa azul 510ml' },

  // --- Refrigerantes ---
  { id: 57, name: 'H2O Bioleve Limão', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/24203350/5209447_1.jpg', description: 'Refrigerante H2O Bioleve sabor limão, garrafa PET' },
  { id: 59, name: 'H2O Bioleve Limoneto', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/107630153/refrigerante-h2oh-limao-garrafa-500ml-1.jpg', description: 'Refrigerante H2O Bioleve sabor limoneto, garrafa PET' },
  { id: 61, name: 'Sprite Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/861/32993861.png', description: 'Refrigerante Sprite limão, lata 350ml' },
  { id: 62, name: 'Fanta Laranja Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/89/33022089.png', description: 'Refrigerante Fanta sabor laranja, lata 350ml' },
  { id: 63, name: 'Fanta Uva Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/147300954/fanta-uva-lata-350-ml-1.jpg', description: 'Refrigerante Fanta sabor uva, lata 350ml' },
  { id: 64, name: 'Coca-Cola Lata 350ml', category: 'Secos', subcategory: 'Refrigerantes', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/59/33000059.png', description: 'Refrigerante Coca-Cola original, lata 350ml' },


  // --- Sucos ---
  { id: 66, name: 'Gatorade Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/106450199/gatorade-sabor-laranja-500ml-1.jpg', description: 'Isotônico Gatorade, diversos sabores, garrafa 500ml' },
  { id: 67, name: 'Suco Bioleve Sabores', category: 'Secos', subcategory: 'Sucos', price: null, unit: 'un', image: 'https://agualibra.com.br/wp-content/uploads/2019/06/suco-bioleve-390-ml.jpg', description: 'Suco Bioleve, diversos sabores naturais' },

  // --- Cervejas (organizado por marca) ---
  // Antarctica
  { id: 196, name: 'Cerveja Antarctica Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/106451995/cerveja-pilsen-antarctica-lata-350ml-pack-com-12-unidades-1.jpg', description: 'Cerveja Antarctica pilsen, lata 350ml, caixa com 18 unidades' },

  // Brahma
  { id: 69, name: 'Cerveja Brahma Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/106436980/cerveja-pilsen-brahma-chopp-lata-350ml-1.jpg', description: 'Cerveja Brahma Chopp pilsen, lata 350ml' },
  { id: 70, name: 'Cerveja Brahma Latão 550ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/993610-1-18-04-2024-12-01-34-362.jpg', description: 'Cerveja Brahma Chopp pilsen, latão 550ml' },
  { id: 197, name: 'Cerveja Brahma Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/211195/5474299_1.jpg', description: 'Cerveja Brahma Chopp pilsen, lata 350ml, caixa com 18 unidades' },

  // Heineken
  { id: 198, name: 'Cerveja Heineken Lata 350ml Cx 12un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbr.vtexassets.com/arquivos/ids/189755264/image-0.jpg', description: 'Cerveja Heineken Lager, lata 350ml, caixa com 12 unidades' },
  { id: 199, name: 'Cerveja Heineken Long Neck 330ml Cx 24un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbr.vtexassets.com/arquivos/ids/189700272/image-0.jpg', description: 'Cerveja Heineken Lager, long neck 330ml, caixa com 24 unidades' },

  // Itaipava
  { id: 73, name: 'Cerveja Itaipava Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/191/32955191.png', description: 'Cerveja Itaipava pilsen, lata 350ml' },

  // Original
  { id: 200, name: 'Cerveja Original Lata 350ml Cx 12un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/216090/5699193_1.jpg', description: 'Cerveja Original, lata 350ml, caixa com 12 unidades' },

  // Skol
  { id: 72, name: 'Cerveja Skol Lata 350ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/107629977/cerveja-skol-pilsen-lata-350ml-1.jpg', description: 'Cerveja Skol pilsen, lata 350ml' },
  { id: 71, name: 'Cerveja Skol Latão 500ml', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'un', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/107629978/cerveja-skol-pilsen-lata-473ml-1.jpg', description: 'Cerveja Skol pilsen, latão 500ml' },
  { id: 201, name: 'Cerveja Skol Lata 350ml Cx 18un', category: 'Secos', subcategory: 'Cervejas', price: null, unit: 'cx', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/134558684/cerveja-skol-pilsen-350ml---18-unidades-1.jpg', description: 'Cerveja Skol pilsen, lata 350ml, caixa com 18 unidades' },

  // --- Embalagens ---
  { id: 74, name: 'Bobina Picotada 20x30', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/92693075/e029fdb59c.jpg', description: 'Bobina plástica picotada 20x30cm, rolo' },
  { id: 75, name: 'Saco Plástico para Lanche 22x17', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1037887/saco_plastico_para_lanche_leitoso_22x17cm_pacote_1kg_105565_1_3f243dda948d14cf59e5c601a2dd1252.png', description: 'Saco plástico leitoso para lanche 22x17cm' },
  { id: 76, name: 'Saco Plástico para Lanche 24x19', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x1000/1027/1027618/produto/45978670/2be1242cf5.jpg', description: 'Saco plástico leitoso para lanche 24x19cm' },
  { id: 77, name: 'Embalagem para Frios - Papel Acoplado', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170170266_papel-acoplado-para-frios-embalefrios-400-nidades-a07d3dee.jpg', description: 'Papel acoplado para embalar frios' },
  { id: 78, name: 'Saco Plástico 40x60', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/14048702708c2bc7da3.jpg', description: 'Saco plástico transparente 40x60cm' },
  { id: 79, name: 'Saco Plástico 50x80', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://biripelembalagens.com.br//controle/arquivo/saco-plastico-virgem-cesta-basica-50x80-altaplast-com-100-unidades.jpg', description: 'Saco plástico transparente 50x80cm' },
  { id: 80, name: 'Sacola 38x48', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/56726931/13efadbe2f.jpg', description: 'Sacola plástica branca 38x48cm' },
  { id: 81, name: 'Sacola 50x60 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://www.sacariasafra.com.br/img/produtos/3fbb1d85ac082faea5c8f8ff40054044.jpg', description: 'Sacola plástica reciclada colorida 50x60cm' },
  { id: 82, name: 'Sacola 30x40', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x450/1370/1370588/produto/56726937/f388eb1ac6.jpg', description: 'Sacola plástica branca 30x40cm' },
  { id: 83, name: 'Sacola Colorida 30x40 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://static.clickembalagens.com.br/product_images/1280x1280/b/996/161464-19-02-2025-anuncio-20sacola-20reciclada-20colorida-20-201-28488.png', description: 'Sacola plástica colorida reciclada 30x40cm' },
  { id: 84, name: 'Sacola Colorida 40x50 Reciclada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://cdn.awsli.com.br/600x1000/1027/1027618/produto/45810663/b6721541ce.jpg', description: 'Sacola plástica colorida reciclada 40x50cm' },
  { id: 85, name: 'Sacola 30x40 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/613137/sacola_plastica_branca_reforcada_30x40_pead_600un_3kg_extrusa_pack_631_1_20200824145703.jpg', description: 'Sacola plástica branca reforçada 30x40cm' },
  { id: 86, name: 'Sacola 40x50 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/613137/sacola_plastica_branca_reforcada_40x50_pead_350un_3kg_extrusa_pack_593_1_20200721160951.jpg', description: 'Sacola plástica branca reforçada 40x50cm' },
  { id: 87, name: 'Sacola 50x60 Reforçada', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/1233279/sacola_plastica_leitosa_reforcada_50x60_c_3_kg_grande_123_1_b949259013ffdd81489fc3e7580f9f77.png', description: 'Sacola plástica branca reforçada 50x60cm' },
  { id: 88, name: 'Embalagem Frango Assado', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'un', image: 'https://reiembalagensonline.com/cdn/shop/products/285b6f21f375338ade0debaab743742c.jpg?v=1684588266', description: 'Saco de papel térmico para frango assado, marca Pluma PackPel' },
  { id: 89, name: 'Guardanapo de Papel 13x14 pc 2000un', category: 'Secos', subcategory: 'Embalagens', price: null, unit: 'pc', image: 'https://ecoms1-nyc3.nyc3.cdn.digitaloceanspaces.com/51491/@v3/1748831515058-guardanapo-papel-tv-13x14-com-2000-unidades-perola.jpg', description: 'Guardanapo de papel 13x14cm, pacote com 2000 unidades' },

  // --- Descartáveis ---
  { id: 90, name: 'Papel Toalha Interfolha 20x21 pc 800', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'pc', image: 'https://cdn.awsli.com.br/600x450/1935/1935087/produto/100366509/papel-interfolha-pr-tico2-wdlc6vtanc-1-5ykcs61ucw.webp', description: 'Papel toalha interfolha 20x21cm, pacote com 800 folhas' },
  { id: 92, name: 'Embalagem de Pizza Grande', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: 'https://images.tcdn.com.br/img/img_prod/979411/pizza_octogonal_35x35x4_35_1_0b7a20f5f8ee8075ed7109e7ad173f0a.png', description: 'Caixa octogonal para pizza grande' },
  { id: 94, name: 'Marmitex nº8 cx 100un PT102', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170127020_marmitex-isopor-n8-copobras-750-ml-100-unidades-7a5c87ec.jpg', description: 'Marmitex isopor nº8 com tampa, caixa com 100 unidades, modelo PT102' },
  { id: 95, name: 'Marmitex nº9 cx 100un PT104', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://89embalagens.com.br/wp-content/uploads/2023/03/15170170456_marmitex-isopor-n9-copobras-1100-ml-100-unidades-6de9ffec.jpg', description: 'Marmitex isopor nº9 com tampa, caixa com 100 unidades, modelo PT104' },
  { id: 96, name: 'Marmitex PT100 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x700/2074/2074852/produto/289077457/15170127035_marmitex-isopor-n7-copobras-500-ml-100-unidades-cc0febf9-8y8ib0juza.jpg', description: 'Marmitex isopor redondo PT100 com tampa, caixa com 100 unidades' },
  { id: 97, name: 'Marmitex PT500', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'un', image: 'https://eficazjf.com.br/wp-content/uploads/2019/02/pt500-ret.jpg', description: 'Marmitex isopor redondo PT500 com tampa, tamanho grande' },
  { id: 98, name: 'Hamburgueira CH2 cx 100un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x1000/446/446822/produto/126182413/shopping---2023-07-05t142524-699-rcvsly7tea.jpg', description: 'Embalagem isopor para hambúrguer CH2 média, caixa com 100 unidades' },
  { id: 99, name: 'Hamburgueira CH3 cx 50un', category: 'Secos', subcategory: 'Descartáveis', price: null, unit: 'cx', image: 'https://cdn.awsli.com.br/600x1000/446/446822/produto/126180789/shopping---2023-07-05t142524-699-uyag22s2xh.jpg', description: 'Embalagem isopor para hambúrguer CH3 grande, caixa com 50 unidades' },

  // ============================================================
  //  RESFRIADOS
  // ============================================================

  // --- Apresuntados ---
  { id: 100, name: 'Apresuntado Aurora - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://www.auroraalimentos.com.br/wp-content/uploads/2022/04/APRESUNTADO-AURORA-3.7-KG-517.png', description: '' },
  { id: 102, name: 'Apresuntado Nobre / Peperi - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://peperi.coop.br/wp-content/uploads/2022/05/520-Apresuntado-Peperi-flat-Nobre-Peperi.png', description: '' },
  { id: 103, name: 'Apresuntado Perdigão - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://apoioentrega.vteximg.com.br/arquivos/ids/464695-500-500/APRESUNTADO-PERDIGAO-KG-PECA.jpg?v=637439082532270000', description: '' },
  { id: 105, name: 'Apresuntado Sadia - Peça', category: 'Resfriados', subcategory: 'Apresuntados', price: null, unit: 'kg', image: 'https://images-food.ifcshop.com.br/produto/44708_0_20220103133041.jpg', description: '' },

  // --- Presuntos ---
  { id: 106, name: 'Lombo Canadense Nobre - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://megag.com.br/v21/wp-content/uploads/2021/07/arq_973Lombo-Nobre-Tipo-Canadense-1Kg.jpg', description: '' },
  { id: 107, name: 'Presunto Cozido Sadia - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/assets/images/_/products/ce316db01279c02630a24352ab32bed99b881819.webp', description: '' },
  { id: 108, name: 'Presunto Rio Sul - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/storage/product/files/f21e800c9d05dd9d8837d8e50353d872f0fd1895.webp', description: '' },
  { id: 109, name: 'Presunto Perdigão - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1272117/g.jpg.jpg?v=639098738599970000', description: '' },
  { id: 195, name: 'Presunto Filé Mignon Suíno Sadia - Peça', category: 'Resfriados', subcategory: 'Presuntos', price: null, unit: 'kg', image: 'https://redemix.vteximg.com.br/arquivos/ids/218916-500-500/7435.png?v=638524206461000000', description: '' },

  // --- Mortadelas ---
  { id: 110, name: 'Mortadela Frigossa 2kg - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'pc', image: 'https://www.friossemlimite.com.br/loja/src/uploads/produtos/a03c25b59d9cced43d1b59ced4b31ec1/20230227135030.jpg', description: '' },
  { id: 111, name: 'Mortadela Marba - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/1195-11-08-2023-13-50-07-313.jpg', description: '' },
  { id: 112, name: 'Mortadela Ouro - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/4189-18-09-2023-11-03-25-806.jpg', description: '' },
  { id: 113, name: 'Bolonhela Perdigão - Peça', category: 'Resfriados', subcategory: 'Mortadelas', price: null, unit: 'kg', image: 'https://static.paodeacucar.com/img/uploads/1/654/32941654.jpg', description: '' },

  // --- Cream Cheese ---
  { id: 114, name: 'Cream Cheese Scala', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1146582/p.jpg?v=639076991461000000', description: '' },
  { id: 115, name: 'Catupiry Milk Gold', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1143954/p.jpg?v=639076978126900000', description: '' },
  { id: 116, name: 'Catupiry Catiguá', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/3066.jpg', description: '' },
  { id: 117, name: 'Catupiri Dalora', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://www.sondadelivery.com.br/img.aspx/sku/1212940/530/7898039680187.png', description: '' },
  { id: 118, name: 'Catupiri Scala Bisnaga', category: 'Resfriados', subcategory: 'Cream Cheese', price: null, unit: 'un', image: 'https://www.sondadelivery.com.br/img.aspx/sku/1212940/530/7898039680187.png', description: '' },

  // --- Queijos ---
  { id: 119, name: 'Cheddar Scala', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: 'https://www.scala.com.br/wp-content/uploads/2020/04/mockups-1000x1000_cheddar-400-g.png', description: '' },
  { id: 120, name: 'Queijo Provolone - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://prezunic.vtexassets.com/arquivos/ids/183279-800-auto?v=638368818412730000', description: '' },
  { id: 121, name: 'Queijo Crioulo', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: 'https://latco.com.br/wp-content/uploads/2019/12/queijominasmeialua_desde1966_mockup.png', description: '' },
  { id: 122, name: 'Queijo Gorgonzola - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://muffatosupermercados.vtexassets.com/arquivos/ids/381100/42857_1.jpg?v=638471568803270000', description: '' },
  { id: 123, name: 'Queijo Minas Padrão Nova Esperança - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://www.scala.com.br/wp-content/uploads/2020/04/mockups-1000x1000_minas-padrao-inteiro-e1713466864958.png', description: '' },
  { id: 124, name: 'Mussarela Nova Esperança - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://assets.instabuy.app.br/ib.item.image.large/l-0ba122a368c64d0ea0b435f1f1ca5f8d.png', description: '' },
  { id: 125, name: 'Mussarela Roseira - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://zupermercado.com.br/cdn/shop/files/07c08c6b-a547-4fcd-b1dd-6589cc5e6797_782b5ee0-dba3-411a-b50e-5c248ed78dc1.jpg?v=1736848309', description: '' },
  { id: 126, name: 'Queijo Prato - Peça', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'kg', image: 'https://www.auroraalimentos.com.br/wp-content/uploads/2022/04/2895_mockup-Queijo-Aurora-Prato-Peca-3kg-Rev04@0.png', description: '' },
  { id: 127, name: 'Parmesão Scala', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: 'https://www.scala.com.br/wp-content/uploads/2020/09/mockups-544x544_parmesao-speciale-inteiro.png', description: '' },
  { id: 128, name: 'Espeto de Queijo Coalho', category: 'Resfriados', subcategory: 'Queijos', price: null, unit: 'un', image: 'https://www.vivaespetos.com.br/wp-content/uploads/2019/05/quijocoalho.jpg', description: '' },

  // --- Requeijão ---
  { id: 129, name: 'Requeijão Scala Light', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: 'https://food2c.s3.amazonaws.com/SC002.png', description: '' },
  { id: 130, name: 'Requeijão Scala', category: 'Resfriados', subcategory: 'Requeijão', price: null, unit: 'un', image: 'https://www.scala.com.br/wp-content/uploads/2020/06/mockups-1000x1000_requeijao-tradicional-200-g.png', description: '' },

  // --- Manteiga e Margarina ---
  { id: 131, name: 'Manteiga Scala', category: 'Resfriados', subcategory: 'Manteiga e Margarina', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1145500/m.jpg?v=639076986030700000', description: '' },

  // --- Salames e Embutidos ---
  { id: 132, name: 'Bacon Perdigão - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/5248-18-09-2023-11-07-19-662.jpg', description: '' },
  { id: 133, name: 'Bacon Pernil Saudali - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://saudali.com.br/wp-content/uploads/2018/02/Bacon-Manta-Termoformado-Saudali-300x300.jpg', description: '' },
  { id: 134, name: 'Bacon Sadia - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/storage/product/files/1048b0b1af5e05b41d37316e71057c9ce33c6cea.webp', description: '' },
  { id: 135, name: 'Carne Seca Frisul - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://www.frisul.com.br/images/produtos/produto01.jpg', description: '' },
  { id: 136, name: 'Calabresa Frigonossa - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://www.friossemlimite.com.br/loja/src/uploads/produtos/a03c25b59d9cced43d1b59ced4b31ec1/20230227135030.jpg', description: '' },
  { id: 137, name: 'Calabresa Reta Seara - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://megag.com.br/v21/wp-content/uploads/2025/07/686.jpg', description: '' },
  { id: 138, name: 'Calabresa Sadia - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/985396-16-09-2024-16-40-26-326.jpg', description: '' },
  { id: 139, name: 'Salaminho - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://prezunic.vtexassets.com/arquivos/ids/210955-800-auto?v=638622754912530000', description: '' },
  { id: 140, name: 'Linguiça Cuiabana Grande - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2022/06/Sem-nome-500-x-500-px-2.png', description: '' },
  { id: 141, name: 'Linguiça Gomo Grande - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://i0.wp.com/www.cofril.com.br/wp-content/uploads/2013/09/2015-09-23_Emb-14-Pernil-Especial-Churrasco_001-Editar1.jpg?fit=800%2C800&ssl=1', description: '' },
  { id: 142, name: 'Linguiça Mista Fina - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://www.perdigao.com.br/assets/_images/895e0c51bb7db589095b829d35dbd3327798c308.webp', description: '' },
  { id: 143, name: 'Salsicha Amarrada - Peça', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/941328-26-10-2023-14-42-50-207.jpg', description: '' },
  { id: 144, name: 'Salsicha Frigonossa', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'kg', image: 'https://loja.frigosealand.com/cdn/shop/files/d4e54a81-fa53-467d-9479-dc178eeb5ae5.jpg?v=1749062953', description: '' },
  { id: 145, name: 'Salsicha Perdigão Hot Dog', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'un', image: 'https://static.paodeacucar.com/img/uploads/1/411/32979411.png', description: '' },
  { id: 146, name: 'Torresmo', category: 'Resfriados', subcategory: 'Salames e Embutidos', price: null, unit: 'un', image: 'https://osuper-ecommerce-koch.s3.sa-east-1.amazonaws.com/684b380a-TorresmoRoannaPururucaPacote300G_39567.jpeg', description: '' },

  // --- Bacalhau ---
  { id: 147, name: 'Bacalhau Desfiado', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'un', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/Bacalhau-Desfiado-Seara-400g-1.webp', description: '' },
  { id: 148, name: 'Bacalhau Saith - Peça', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'kg', image: 'https://static.paodeacucar.com/img/uploads/1/476/33006476.png', description: '' },
  { id: 149, name: 'Bacalhau Porto - Peça', category: 'Resfriados', subcategory: 'Bacalhau', price: null, unit: 'kg', image: 'https://www.bancadoramon.com.br/media/catalog/product/cache/1/thumbnail/520x/9df78eab33525d08d6e5fb8d27136e95/l/o/lombo_morhua.jpg', description: '' },

  // ============================================================
  //  CONGELADOS
  // ============================================================

  // --- Bovinos ---
  { id: 150, name: 'Acém Congelado', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://prezunic.vtexassets.com/arquivos/ids/179941-800-auto?v=638368811005400000', description: 'Acém bovino congelado, peça — corte versátil para cozidos e ensopados' },
  { id: 151, name: 'Carne Lagarto', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/206545356/295914_1.jpg?v=638984627687830000', description: 'Lagarto bovino congelado, peça — ideal para rosbife e carne de panela' },
  { id: 152, name: 'Carne Picanha', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/5706852/peca-de-picanha-bovina-congelada-carrefour-12kg-1.jpg?v=637327743915770000', description: 'Picanha bovina congelada, peça — o corte nobre do churrasco brasileiro' },
  { id: 153, name: 'Contra-Filé', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/209437/5283655_1.jpg?v=637272509350000000', description: 'Contra-filé bovino congelado, peça — macio e saboroso para grelhar' },
  { id: 154, name: 'Cupim Friboi', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/206545333-200-auto/209104_1.jpg?v=638984627549530000', description: 'Cupim bovino congelado Friboi, peça — suculento para churrasco lento' },
  { id: 155, name: 'Carne Moída Congelada', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/200417/9421769_1.jpg?v=637272446135900000', description: 'Carne moída bovina congelada, pacote — prática para o dia a dia' },
  { id: 156, name: 'Almôndega Congelada', category: 'Congelados', subcategory: 'Bovinos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/storage/product/files/6e3ffcfdaed8f81fc5d4ccf5fc09955a0719b815.webp', description: 'Almôndega bovina congelada, pacote — pronta para preparar' },

  // --- Suínos ---
  { id: 157, name: 'Costelinha de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/37667216/costelinha-suina-sadia-cong-kg-1.jpg?v=637814111642370000', description: 'Costelinha suína congelada, peça — ideal para churrasco e assados' },
  { id: 158, name: 'Lombo de Porco', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/214437/5608031_1.jpg?v=637272519057830000', description: 'Lombo suíno congelado, peça — corte magro e versátil' },
  { id: 159, name: 'Pernil sem Osso Pif Paf', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://www.pifpaf.com.br/wp-content/uploads/2024/11/00-060.545-PERNIL-SUINO-S-OSSO-TEMP.-CONG.-CX-18KG-1024x1024.png', description: 'Pernil suíno sem osso Pif Paf, peça congelada — prático para assar' },
  { id: 160, name: 'Bacon em Cubos Congelado', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/182392256/3400808_1.jpg.jpg?v=638721074045730000', description: 'Bacon em cubos congelado, pacote — pronto para usar em receitas' },
  { id: 161, name: 'Bacon Fatiado Congelado', category: 'Congelados', subcategory: 'Suínos', price: null, unit: 'kg', image: 'https://www.sadia.com.br/assets/images/_/products/19add854120bf278ddc9c87f6812e5584ef2c2c0.webp', description: 'Bacon fatiado congelado, pacote — praticidade no preparo' },

  // --- Linguiças ---
  { id: 162, name: 'Linguiça Toscana Nobre', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1141213/p.jpg?v=639076963976870000', description: 'Linguiça toscana Nobre congelada — sabor de carne suína temperada' },
  { id: 163, name: 'Linguiça Toscana Aurora Churrasco', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/216849/5718023_1.jpg?v=637272523977170000', description: 'Linguiça toscana Aurora para churrasco, congelada' },
  { id: 164, name: 'Linguiça Toscana Saudali', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://saudali.com.br/wp-content/uploads/2018/02/Linguica-de-Carne-Suina-1kg-Saudali-300x300.jpg', description: 'Linguiça toscana de pernil Saudali, congelada' },
  { id: 165, name: 'Linguiça Uay', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://s3-us-west-2.amazonaws.com/fasow/26291/imagens/2vKyM2DD2QkzjkOEzlpS.jpg', description: 'Linguiça de carne bovina Uay, congelada' },

  // --- Aves ---
  { id: 166, name: 'Frango Congelado Inteiro', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/Frango-Inteiro-com-Miudos-Seara.webp', description: 'Frango inteiro congelado, embalagem — ave limpa e pronta para preparo' },
  { id: 167, name: 'Asa de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/07/Meio-da-Asa-Seara-1kg.webp', description: 'Asa de frango congelada, pacote' },
  { id: 168, name: 'Filé de Peito de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/File-de-Peito-Seara-1kg-1.webp', description: 'Filé de peito de frango congelado, pacote — corte magro e versátil' },
  { id: 169, name: 'Coxa e Sobrecoxa de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2025/01/992404_IQF_COXA_SOBRECOXA_1kg-_2_-1.webp', description: 'Coxa e sobrecoxa de frango congelada, pacote — suculenta e saborosa' },
  { id: 170, name: 'Filé de Peito Seara', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/File-de-Peito-Seara-1kg-1.webp', description: 'Filé de peito de frango Seara congelado, pacote' },
  { id: 171, name: 'Filé de Coxa e Sobrecoxa', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/File-de-Coxa-e-Sobrecoxa-Seara-1kg.webp', description: 'Filé de coxa e sobrecoxa sem osso congelado, pacote' },
  { id: 172, name: 'Peito de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2024/08/File-de-Peito-Seara-1kg-1.webp', description: 'Peito de frango inteiro congelado, pacote' },
  { id: 173, name: 'Coxinha da Asa C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1143624/g.jpg?v=639076976496930000', description: 'Coxinha da asa de frango C.Vale congelada, pacote' },
  { id: 174, name: 'Meio da Asa (Tulipa)', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://supernossoio.vtexassets.com/arquivos/ids/1549781-800-auto?v=638931297559830000', description: 'Meio da asa de frango (tulipa) congelado, pacote — ideal para aperitivos' },
  { id: 175, name: 'Filé de Peito C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1271710/m.jpg.jpg?v=639098736310400000', description: 'Filé de peito de frango C.Vale congelado, pacote' },
  { id: 176, name: 'Coração de Frango Perdigão', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://www.perdigao.com.br/assets/_images/475423c58600a9708f50fd1d2b09fe13536d026a.png', description: 'Coração de frango Perdigão congelado, pacote — clássico do churrasco' },
  { id: 177, name: 'Filé Empanado C.Vale', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/984197/m.jpg?v=639047189791330000', description: 'Filé de frango empanado C.Vale congelado, pacote — prático e crocante' },
  { id: 178, name: 'Linguiça de Frango C.Vale', category: 'Congelados', subcategory: 'Linguiças', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1147626/p.jpg?v=639076996698230000', description: 'Linguiça de frango C.Vale congelada — opção mais leve para churrasco' },
  { id: 179, name: 'Fígado de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1006188/m.jpg?v=639047311321700000', description: 'Fígado de frango congelado, pacote' },
  { id: 180, name: 'Filé Sassami C.Vale', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://supernossoio.vtexassets.com/arquivos/ids/1550075-800-auto?v=638931305681570000', description: 'Filé sassami de frango C.Vale congelado — corte magro e delicado' },
  { id: 181, name: 'Moela de Frango', category: 'Congelados', subcategory: 'Aves', price: null, unit: 'kg', image: 'https://supernossoio.vtexassets.com/arquivos/ids/1525983-800-auto?v=638924259265570000', description: 'Moela de frango congelada, pacote' },

  // --- Empanados ---
  { id: 182, name: 'Chicken C.Vale', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1006190/m.jpg?v=639047311322170000', description: 'Empanado de frango tipo chicken C.Vale congelado, pacote' },
  { id: 183, name: 'Chicken Baita', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://bkt-meuminerva.s3.sa-east-1.amazonaws.com/media/catalog/product/6/8/68467_1.jpg', description: 'Empanado de frango tipo chicken Baita congelado, pacote' },
  { id: 184, name: 'Steak Perdigão', category: 'Congelados', subcategory: 'Empanados', price: null, unit: 'un', image: 'https://atacadaobr.vtexassets.com/arquivos/ids/1144319/m.jpg?v=639076979940300000', description: 'Steak empanado de frango Perdigão congelado, pacote' },

  // --- Hambúrguer ---
  { id: 185, name: 'Hambúrguer Aurora', category: 'Congelados', subcategory: 'Hambúrguer', price: null, unit: 'un', image: 'https://www.auroraalimentos.com.br/wp-content/uploads/2022/04/HAMBURGUER-DE-CARNE-BOVINA-CAIXETA-AURORA-672G-2093-1.png', description: 'Hambúrguer de carne bovina Aurora congelado, caixa' },

  // --- Vegetais Congelados ---
  { id: 186, name: 'Mandioca Congelada (pacote)', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://www.seara.com.br/wp-content/uploads/2022/06/Mandioca-Supreme-Seara-Nature-600g.webp', description: 'Mandioca cozida e congelada, pacote — prática para fritar ou cozinhar' },
  { id: 187, name: 'Mandioca Congelada (a granel)', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'kg', image: 'https://www.seara.com.br/wp-content/uploads/2022/10/Mandioca-Tolete-Seara-Nature-1kg.webp', description: 'Mandioca congelada a granel — para uso em grande volume' },
  { id: 188, name: 'Brócolis Congelado', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://mambodelivery.vtexassets.com/arquivos/ids/234191-800-auto?v=638862961980130000', description: 'Brócolis congelado, pacote — mantém nutrientes e praticidade' },
  { id: 189, name: 'Polenta Congelada Palito', category: 'Congelados', subcategory: 'Vegetais Congelados', price: null, unit: 'un', image: 'https://supernossoio.vtexassets.com/arquivos/ids/493386-800-auto?v=638756955561900000', description: 'Polenta palito congelada Val Mar — pronta para fritar, crocante por fora' },

  // --- Peixes e Frutos do Mar ---
  { id: 190, name: 'Filé de Tilápia', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: 'https://mambodelivery.vtexassets.com/arquivos/ids/231336-800-auto?v=638810060653700000', description: 'Filé de tilápia congelado — peixe branco suave e versátil' },
  { id: 191, name: 'Peixe Panga', category: 'Congelados', subcategory: 'Peixes e Frutos do Mar', price: null, unit: 'kg', image: 'https://supernossoio.vtexassets.com/arquivos/ids/460658-800-auto?v=638575136391070000', description: 'Filé de peixe panga congelado — sabor neutro, ótimo para empanar' },

  // --- Batatas Congeladas ---
  { id: 192, name: 'Batata McCain', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: 'https://cdn.shopify.com/s/files/1/0579/9742/6861/files/image-removebg-preview-2024-06-03T172027.762.png?v=1717446094', description: 'Batata pré-frita congelada McCain, pacote 2,5kg — corte tradicional' },
  { id: 193, name: 'Batata Quality Fries Canoa', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: 'https://megag.com.br/v21/wp-content/uploads/2021/10/2243.jpg', description: 'Batata pré-frita congelada Quality Fries corte canoa — rústica e crocante' },
  { id: 194, name: 'Batata Quality Fries', category: 'Congelados', subcategory: 'Batatas Congeladas', price: null, unit: 'un', image: 'https://fortatacadista.vteximg.com.br/arquivos/ids/160869-1000-1000/BATATA-PRE-FRITA-QUAL.FRIES-2KG-CONG.---1070690.jpg?v=637437438618330000', description: 'Batata pré-frita congelada Quality Fries, pacote — corte palito premium' },
];
