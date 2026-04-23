# Demo Guide — Reunião com Dono

**Site:** https://friosof.web.app
**Dispositivo recomendado:** notebook + celular (mostrar responsividade)
**Tempo total:** 10–15 min de demo

---

## Preparação (5 min antes)

- [ ] Ter 1 cliente real cadastrado pra logar ao vivo (usar código 0001 ou o teu próprio)
- [ ] Ter 3 produtos reais com imagem e descrição
- [ ] Carregar o celular e o notebook
- [ ] Conexão estável (ou 4G backup)
- [ ] Abrir **duas abas:** uma logada, outra como visitante
- [ ] Ter o painel admin acessível
- [ ] Desligar notificações (foco total)

---

## Roteiro da demo

### Ato 1 — Experiência do cliente (4 min)

**Abre como visitante (aba 1):**
> "Isso aqui é o que qualquer cliente vê quando acessa. Repara: é bonito, é rápido, é mobile-friendly."

**Mostra:**
- Hero com seu próprio rosto como vendedor → cria identidade
- 6 categorias em destaque
- Top 4 produtos mais pedidos
- Busca (Cmd+K) ao vivo — digita "queijo" e mostra resultado instantâneo
- Filtros (secos, resfriados, congelados)
- Card do produto: imagem, preço, "adicionar ao carrinho"

**Pulo do gato:**
> "Agora olha o celular. Mesma experiência, sem perder nada."

Pega o celular e mostra.

---

### Ato 2 — Cadastro inteligente (3 min)

**Clica em "Cadastrar":**
> "Olha como é o cadastro. Cliente preenche os dados, manda foto da fachada, aceita os termos. Na hora:"

- Sistema gera **código sequencial** (tipo 0547) — igual ERP antigo, mas automático
- Gera **ficha cadastral em PDF**
- Manda **PDF + foto da fachada** automaticamente pro teu WhatsApp via **API oficial da Meta**

> "Não é link wa.me. É a API oficial do WhatsApp Business. Chega no teu celular como mensagem de verdade, arquivada, com anexo."

Mostra o WhatsApp recebendo (se conseguir fazer ao vivo).

---

### Ato 3 — Pedido em ação (3 min)

**Volta pra aba logada:**
- Adiciona 3 produtos ao carrinho
- Abre o carrinho — mostra quantidade, desconto automático de caixa fechada
- Finaliza pedido

**O que acontece atrás:**
1. Pedido salvo no banco (imutável, pra fins fiscais)
2. Mensagem formatada enviada automaticamente pro WhatsApp via API
3. Cliente recebe confirmação

> "Hoje tu recebe no WhatsApp. Amanhã, esse pedido cai direto no sistema interno, baixa estoque, gera a nota. Mesmo botão do cliente, sem mudar nada pra ele."

---

### Ato 4 — Painel admin (3 min)

**Abre `/admin`:**

- Edita um produto ao vivo (muda preço ou imagem)
- Mostra que aparece no site em tempo real (outra aba)
- Abre `/dashboard` — gráficos de pedidos, clientes, produtos mais vendidos

> "Isso é só o começo. Aqui vai entrar: estoque em tempo real, financeiro, emissão de NF-e, comissão de vendedor, relatório pro contador."

---

### Ato 5 — Fecha mostrando segurança (1 min)

> "Tudo isso é rodando na Google Cloud (Firebase). Dados criptografados. 5 tentativas de login erradas = bloqueia 15 minutos. Pedido depois de criado não pode ser alterado — Receita exige isso. Não é site feito com 'template' da internet. É arquitetura de empresa séria."

---

## Objeções esperadas (e como responder)

**"E se der problema?"**
> "Por isso o piloto roda **paralelo** ao DBSoft. Se der problema, o DBSoft continua rodando. Zero risco."

**"Meus vendedores não vão usar."**
> "Eu sou vendedor. Vou usar primeiro. Se não funcionar pra mim, não oferto pros outros."

**"E o contador?"**
> "Meta é mandar pra ele **menos trabalho, não mais.** XMLs organizados, SPED gerado. Antes de virar obrigatório pra ele, falo com ele."

**"Quanto isso custa depois?"**
> "Durante o piloto, R$ 500/mês. Depois do piloto, preço fechado antes de começar — não tem surpresa. Pra referência: Totvs cobra R$ 3-5k/mês. Bling R$ 300-500/mês. Estou entre os dois, com sistema sob medida."

**"Por que não contratar um ERP pronto?"**
> "Porque ERP pronto **não entende distribuidora pequena da região.** Eles fazem 80% e deixam os 20% importantes de fora. A gente faz os 100%, e tu influencia o que entra."

**"Quanto tempo leva?"**
> "Portal dos clientes: já tá no ar, precisa só conectar. 30 dias pra lançar oficialmente pros 600 clientes. ERP interno completo: 6 meses. Tu não precisa esperar 6 meses pra começar a ver valor — valor aparece no primeiro mês."

---

## Gatilhos de fechamento

Se ele demonstrar interesse real, perguntar **na hora**:

1. "Podemos marcar uma **visita da próxima semana** pra eu conhecer a operação por dentro?"
2. "Quem além de ti precisa aprovar isso? (gerente, sócio, contador)"
3. "Posso começar a cadastrar os 600 clientes no sistema **essa semana**?"
4. "Quando tu quer que os clientes comecem a pedir pelo site?"

**Quanto mais próximo "agora" ele responder, maior o interesse real.**

---

## O que NÃO fazer

- ❌ Não prometer prazo sem pensar
- ❌ Não falar preço de ERP concorrente sem saber
- ❌ Não criticar o DBSoft diretamente (atacar a ferramenta que o dono escolheu = atacar o dono)
- ❌ Não prometer função que tu ainda não sabe fazer
- ❌ Não mostrar código — ele não é técnico, vai perder interesse
- ❌ Não abrir o carrinho com produto bugado (testa antes)

## O que FAZER

- ✅ Deixar ele falar. Anotar tudo que ele reclama do DBSoft
- ✅ Perguntar "o que falta?" no final de cada ato
- ✅ Elogiar o que o DBSoft faz bem (mostra que tu entende o negócio dele)
- ✅ Mostrar o site real, dados reais, clientes reais
- ✅ Sair da reunião com **próximo passo concreto marcado**
