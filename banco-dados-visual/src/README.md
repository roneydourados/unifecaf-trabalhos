# ONG Vida Plena

Aplicação Nuxt 4 + Nuxt UI para gestão de **beneficiários** e **eventos**, integrada ao Supabase.

## Requisitos

- Node.js 20+
- Conta/projeto Supabase configurado

## Configuração

1. Instale as dependências:

```bash
cd src
npm install
```

2. Confirme o arquivo `.env.local`:

```env
SUPABASE_URL=https://nbftaftsagbhzbypanyy.supabase.co
SUPABASE_KEY=sua_chave_publishable
```

3. Rode o projeto:

```bash
npm run dev
```

## Telas

- `/` — Dashboard com indicadores e resumos
- `/beneficiarios` — CRUD + histórico de eventos do beneficiário
- `/eventos` — CRUD de eventos com vínculo a beneficiário

## Observações

- Não há autenticação no momento (acesso aberto via policies RLS públicas).
- A coluna de idade no banco está como `indade` (nome já existente na tabela).
- Automações de e-mail/WhatsApp ficam para uma etapa futura.
