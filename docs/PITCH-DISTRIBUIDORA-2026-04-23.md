# Pitch — Modernização do Sistema de Gestão

**Público:** Dono da Frios Ouro Fino
**Apresentador:** Fabrício (vendedor/tecnologia)
**Duração:** 20–30 minutos
**Objetivo:** Fechar acordo de piloto como cliente-zero

---

## Slide 1 — Abertura (30 segundos)

> "Eu venho construindo uma ferramenta que já tá no ar e que os clientes estão usando. Quero te mostrar o que é, pra onde pode ir, e por que acredito que ela pode substituir o DBSoft — começando aos poucos, sem risco."

---

## Slide 2 — O problema que a gente vive todo dia

**Três dores que tu mesmo reconhece:**

1. **Dois sistemas que não conversam.** Um pro controle interno, outro pro fiscal. Alguém redigita tudo. Erro vira multa, contador recebe dado sujo.
2. **Estoque impreciso.** Vendedor oferece o que não tem. Cliente fica na mão. Expedição corre atrás.
3. **Palm do vendedor em 2026.** Tecnologia de 15 anos atrás. Sem estoque em tempo real, sem imagem do produto, sem preço por cliente.

**Custo invisível:** horas de retrabalho, pedidos perdidos, cliente frustrado, margem apertada.

---

## Slide 3 — O que já existe funcionando

**Site:** https://friosof.web.app

Construído nos últimos meses com arquitetura profissional:

- Catálogo online com 3 categorias (secos, resfriados, congelados)
- Clientes cadastrados com código sequencial (igual ERP de verdade)
- Carrinho, pedido via WhatsApp oficial da Meta (não é link manual)
- Ficha cadastral em PDF + foto da fachada enviada automaticamente
- Painel administrativo pra gerenciar produtos
- Dashboard com gráficos
- Segurança de nível empresarial (criptografia, rate limiting, logs)

**Não é protótipo. É produto rodando.**

---

## Slide 4 — Para onde isso pode ir

Sistema único que faz:

| Hoje (dois sistemas) | Amanhã (um sistema) |
|---|---|
| DBSoft + sistema fiscal | Plataforma única integrada |
| Palm do vendedor | App moderno no celular |
| Pedido por WhatsApp manual | Portal do cliente 24/7 |
| Planilha de estoque | Estoque em tempo real |
| Contador recebe dado sujo | Contador recebe SPED pronto |
| Sem dashboard | Resultado do dia em tempo real |

**Tudo que o DBSoft faz + tudo que ele não faz.**

---

## Slide 5 — Plano em fases (não é "troca tudo de uma vez")

**Proposta: pilotar em fases, paralelo ao DBSoft, sem risco.**

### Fase 1 — Portal dos clientes (mês 1–2)
Os 600 clientes passam a pedir pelo site.
Pedidos caem no sistema, tu aprova, manda pro DBSoft (manual ou integrado).
**Benefício imediato:** menos WhatsApp/telefone, mais pedidos fora do horário, histórico organizado.

### Fase 2 — App do vendedor (mês 3)
Os 9 vendedores trocam o Palm por celular.
Estoque em tempo real, preço por cliente, foto do produto.
**Benefício:** menos erro, vendedor mais rápido, visita rende mais.

### Fase 3 — ERP interno (mês 4–6)
Estoque, financeiro, emissão de NF-e (via Focus NFe).
Integração fiscal e operacional num sistema só.
**Benefício:** aposenta o DBSoft, aposenta o sistema fiscal.

### Fase 4 — Contador e SPED (mês 7)
Geração automática de SPED, XMLs organizados por mês.
**Benefício:** contador recebe tudo pronto, sem retrabalho.

---

## Slide 6 — Por que funciona

**Três vantagens que DBSoft não tem:**

1. **Conhecimento de dentro.** Eu vivo a operação todo dia. Não é consultor externo que não entende o negócio.
2. **Arquitetura moderna.** Firebase (Google), React, WhatsApp API oficial. Aguenta crescer.
3. **Fiscal via especialista.** Focus NFe (ou PlugNotas) cuida da Receita. Eles vivem disso. Nenhum ERP sério faz emissão de NF-e internamente.

---

## Slide 7 — O que eu peço

**Cliente-zero pagante.**

- Preço simbólico: **R$ 500/mês** durante a construção (metade do que se paga pra um ERP de prateleira)
- Contrapartida: acesso a dados reais, feedback estruturado, uso ativo dos vendedores e clientes
- Prazo: 6 meses de piloto
- Sem fidelidade. Se não agregar valor, cancela.

**O que tu ganha:**
- Sistema sob medida pro negócio
- Substitui 2 sistemas por 1
- Acesso às evoluções (tabela de preço, limite de crédito, app vendedor)
- Preço protegido pra sempre (mesmo quando eu vender pra concorrência)

---

## Slide 8 — Perguntas pra fechar

1. **Faz sentido começar pelo portal dos clientes nos próximos 30 dias?**
2. **Quais são as 3 funções do DBSoft que tu não abre mão?** (pra eu replicar)
3. **Qual o maior prejuízo dos últimos 12 meses que o sistema poderia ter evitado?**
4. **Quanto tu paga hoje, somado, de DBSoft + sistema fiscal?**
5. **Tu topa ser o primeiro cliente?**

---

## Encerramento

> "Eu não vim vender promessa. Vim mostrar código rodando. Começo pequeno, provo que funciona, e a gente cresce junto. Se eu não entregar, tu cancela. Mas se eu entregar, tu vai ter um sistema que nenhuma distribuidora dessa região tem."
