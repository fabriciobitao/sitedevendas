# Plano: Sistema de Contas de Clientes + Historico de Pedidos

## Contexto

O site Frios Ouro Fino e um catalogo estatico (React + Vite) onde clientes fazem pedidos via WhatsApp. Nao existe backend, banco de dados ou autenticacao. O problema: clientes recorrentes (restaurantes) precisam refazer os mesmos pedidos toda vez manualmente. A solucao e criar contas de cliente com historico e botao "Repetir Pedido".

## Arquitetura Escolhida

**Firebase (Auth + Firestore)** — zero infraestrutura server-side, free tier generoso (50K users/dia, 20K writes/dia), usuario ja usa GCP.

O site continua estatico no Google Cloud Storage. Firebase e usado apenas como servico (Auth + Firestore direto do browser).

---

## Banco de Dados (Firestore)

### Colecao `customers/{uid}`
```
tipo: "empresa" | "consumidor"
razaoSocial, nomeFantasia, cnpj          (nullable se consumidor)
inscMunicipal, inscEstadual
nomeResponsavel, cpf, rg
endereco, numero, complemento, bairro, municipio, estado, cep
telefone, email
nomeFinanceiro, telefoneFinanceiro, emailFinanceiro
referencias: [{ nome, telefone } x3]
createdAt, updatedAt
```

### Colecao `orders/{autoId}`
```
customerId: uid
customerName: string (denormalizado)
items: [{ productId, name, price, unit, quantity, subtotal }]
totalPrice, totalItems, hasItemsWithoutPrice
status: "enviado"
whatsappSent: boolean
createdAt: Timestamp
```

Dados do produto sao denormalizados no pedido (precos mudam, pedido e registro historico).

---

## Fluxo de Autenticacao

- **Registro**: ClientForm existente + campo senha → `createUserWithEmailAndPassword` → salva perfil no Firestore → envia WhatsApp (comportamento atual preservado)
- **Login**: Modal simples (email + senha) → `signInWithEmailAndPassword`
- **Sessao**: Firebase persiste automaticamente (indexedDB). Usuario fica logado.
- **Recuperar senha**: `sendPasswordResetEmail`
- Email/senha (nao telefone) — clientes business todos tem email, SMS custa dinheiro

---

## Novos Arquivos

| Arquivo | Descricao |
|---------|-----------|
| `src/firebase.js` | Config Firebase (usa VITE_FIREBASE_* env vars) |
| `src/context/AuthContext.jsx` | Provider com user, customerProfile, login, register, logout |
| `src/components/LoginModal.jsx` | Modal de login (email + senha + esqueceu senha) |
| `src/components/AccountMenu.jsx` | Dropdown no header (Meus Pedidos, Minha Conta, Sair) |
| `src/components/OrderHistory.jsx` | Lista de pedidos anteriores |
| `src/components/OrderCard.jsx` | Card individual de pedido com botao "Repetir Pedido" |
| `src/pages/CatalogPage.jsx` | Conteudo atual do App.jsx extraido |
| `src/pages/MeusPedidosPage.jsx` | Pagina de historico (protegida) |
| `src/pages/MinhaContaPage.jsx` | Pagina de perfil (protegida) |

---

## Alteracoes em Arquivos Existentes

| Arquivo | O que muda |
|---------|-----------|
| `src/main.jsx` | Wrap com BrowserRouter |
| `src/App.jsx` | Wrap com AuthProvider, adicionar Routes (/, /meus-pedidos, /minha-conta) |
| `src/components/Header.jsx` | Logado: mostra nome + AccountMenu. Deslogado: botao "Entrar" + "Novo Cliente" |
| `src/components/ClientForm.jsx` | Adicionar campo senha, submit cria conta Firebase + salva Firestore + envia WhatsApp |
| `src/context/CartContext.jsx` | sendOrder salva no Firestore se logado. Nova funcao loadOrder (para repetir pedido) |

---

## Rotas

```
/               → CatalogPage (publica, homepage atual)
/meus-pedidos   → MeusPedidosPage (requer login)
/minha-conta    → MinhaContaPage (requer login)
```

Componente `ProtectedRoute` redireciona para / se nao autenticado.

---

## Funcionalidade "Repetir Pedido"

1. Tela Meus Pedidos lista pedidos do Firestore (orderBy createdAt desc, limit 20)
2. Cada pedido mostra: data, itens resumidos, total, botao "Repetir Pedido"
3. Ao clicar "Repetir Pedido":
   - Busca cada produto pelo productId no products.js (pega preco ATUAL)
   - Adiciona ao carrinho com a quantidade original
   - Se produto foi removido do catalogo → avisa mas adiciona o resto
   - Abre o carrinho automaticamente
4. Cliente revisa, ajusta se quiser, e envia normalmente

Nova funcao no CartContext:
```
loadOrder(orderItems) → limpa carrinho, adiciona itens, abre drawer, retorna warnings
```

---

## Fluxo do Pedido (como muda)

**Logado:**
1. Monta carrinho (igual hoje)
2. Clica "Enviar Pedido"
3. **NOVO**: Salva pedido no Firestore (items snapshot, total, customerId)
4. Envia via WhatsApp (igual hoje - Cloud Function ou wa.me)
5. Mensagem WhatsApp inclui identificacao do cliente (nome fantasia + CNPJ)
6. Carrinho limpa, mostra sucesso

**Deslogado:**
- Funciona exatamente como hoje (WhatsApp only, sem Firestore)
- Hint sutil: "Crie sua conta para salvar historico de pedidos"

---

## Dependencia Nova

```
npm install firebase
```

Unica dependencia adicional. Firebase SDK modular (v10+) com tree-shaking.

---

## Variaveis de Ambiente

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=sitedevendas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sitedevendas
VITE_FIREBASE_STORAGE_BUCKET=sitedevendas.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Implementacao Incremental (5 fases)

### Fase 1: Fundacao (sem mudanca visivel)
- Instalar firebase, criar firebase.js, criar AuthContext (vazio)
- Configurar react-router-dom com rota unica /
- **Teste**: tudo funciona igual antes

### Fase 2: Registro + Login
- Adicionar campo senha no ClientForm
- Criar LoginModal
- Atualizar Header (logado/deslogado)
- **Teste**: registro cria conta Firebase + ainda envia WhatsApp. Login funciona.

### Fase 3: Salvar Pedidos
- CartContext salva no Firestore quando logado
- **Teste**: pedidos de usuarios logados aparecem no Firestore. WhatsApp continua funcionando. Anonimos nao afetados.

### Fase 4: Historico + Repetir Pedido
- Criar MeusPedidosPage, OrderHistory, OrderCard
- Implementar loadOrder no CartContext
- **Teste**: usuario ve pedidos anteriores e consegue repetir

### Fase 5: Polimento
- MinhaContaPage (ver/editar perfil)
- Prompts para anonimos criarem conta
- Loading states, tratamento de erros, estados vazios

---

## Setup Firebase (manual, 5 min)

1. Firebase Console → Criar projeto vinculado ao GCP `sitedevendas`
2. Authentication → Ativar provedor Email/Senha
3. Firestore → Criar banco em `southamerica-east1`
4. Regras de seguranca: clientes so leem/escrevem seus proprios dados
5. Registrar web app → copiar config keys para .env

---

## Verificacao

- [ ] Registro cria conta + salva perfil + envia WhatsApp
- [ ] Login/logout funciona, sessao persiste
- [ ] Pedido de usuario logado salva no Firestore
- [ ] Pedido de usuario anonimo funciona igual antes (nao quebrou)
- [ ] Tela Meus Pedidos lista pedidos corretos
- [ ] "Repetir Pedido" carrega itens no carrinho com precos atuais
- [ ] Produto removido do catalogo mostra aviso ao repetir
- [ ] Funciona no mobile (touch, responsivo)
