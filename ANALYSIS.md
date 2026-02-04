# Saedra - Análise do Projeto

> Alternativa open-source e self-hosted a produtos SaaS.

**Versão atual:** 0.1.0 (Early Development)
**Node.js:** >= 18 | **Package Manager:** pnpm 10.28.2

---

## Visão Geral

Saedra é uma plataforma monorepo que combina autenticação, gerenciamento de projetos, integração com IA (AWS Bedrock) e infraestrutura AWS (EC2, RDS, S3), tudo orquestrado via mensageria NATS em tempo real.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15.4 (App Router), React 19, Tailwind CSS v4, shadcn/ui (Radix) |
| Backend | Express.js 4.18, TypeScript 5.8 (strict) |
| Banco de Dados | Supabase (PostgreSQL + Auth) |
| IA | AWS Bedrock (Claude, Titan) com streaming |
| Infra AWS | EC2, RDS, S3 via AWS SDK |
| Mensageria | NATS 2.29 (TCP + WebSocket) |
| Testes | Vitest 3.1 com mocks e cobertura v8 |
| Build | Turborepo 2.5 + pnpm workspaces |
| CI/CD | GitHub Actions (build + test em PRs) |

---

## Estrutura do Monorepo

```
saedra/
├── apps/
│   ├── web/                    # Next.js - UI e dashboard
│   └── api/                    # Express - REST API
├── packages/
│   ├── ui/                     # Design system (Tailwind + Radix)
│   ├── db-connector/           # Conexão Supabase (anon + service)
│   ├── db-queries/             # Queries abstraídas (auth, profiles, projects, credentials, diagrams)
│   ├── aws-connector/          # Clientes AWS (EC2, RDS, S3)
│   ├── bedrock-service/        # Integração IA com validação Zod
│   ├── nats-client/            # Cliente NATS (Node + Browser)
│   ├── project-service/        # Lógica de negócio de projetos
│   ├── diagram-service/        # Geração de diagramas
│   ├── vitest-config/          # Config compartilhada de testes
│   ├── typescript-config/      # Presets TS (base, nextjs, react-library)
│   ├── eslint-config/          # Regras ESLint compartilhadas
│   └── tailwind-config/        # Tailwind + PostCSS compartilhado
├── docker/                     # Docker Compose (NATS)
└── docs/                       # Guias (TESTING, DEVELOPMENT, STYLING)
```

---

## Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│           UI (apps/web)             │  Next.js + React 19
├─────────────────────────────────────┤
│          API (apps/api)             │  Express.js REST
├──────────┬──────────┬───────────────┤
│ bedrock  │ project  │   diagram     │  Serviços de negócio
│ service  │ service  │   service     │
├──────────┴──────────┴───────────────┤
│  db-queries  │  aws-connector       │  Acesso a dados
├──────────────┴──────────────────────┤
│  db-connector  │  nats-client       │  Conectores externos
├────────────────┴────────────────────┤
│  Supabase  │  AWS  │  NATS Broker   │  Serviços externos
└────────────┴───────┴────────────────┘
```

---

## Apps

### Web (`apps/web`) - Porta 3000

- **Next.js 15.4** com App Router e Turbopack
- Dashboard autenticado com contextos React (user, projects)
- Providers: tema (next-themes), NATS (WebSocket)
- Importa `@repo/ui/styles.css` para design system centralizado
- Notificações via Sonner

### API (`apps/api`) - Porta 3002

- **Express.js** com CORS, rate limiting e logging
- Hot reload via ts-node-dev
- **Rotas:**
  - `GET /` - Health check
  - `POST /bedrock/chat` - Chat com IA
  - `GET /bedrock/models` - Modelos disponíveis
  - `GET /projects/*` - CRUD de projetos

---

## Packages - Destaques

### `@repo/bedrock-service`
Integração type-safe com AWS Bedrock. Suporta invocação padrão e streaming, multi-turn conversations (Claude Messages API) e validação Zod em inputs/outputs. Emite eventos: `streamStart`, `streamChunk`, `streamComplete`, `streamError`.

### `@repo/db-queries`
Camada de abstração sobre Supabase com módulos separados: `auth`, `profiles`, `projects`, `credentials`, `diagrams`. Possui suite de testes completa com mocks, `test.each` parametrizado e padrão AAA.

### `@repo/ui`
Design system com Tailwind CSS v4 usando variáveis CSS em OKLch. Tema teal (primary) + zinc (neutral), dark mode por padrão. Componentes baseados em Radix UI (Button, Card, Badge, Input, Label, etc).

### `@repo/nats-client`
Exporta dois clientes: `./client` para Node.js (TCP) e `./browser` para navegador (WebSocket na porta 9222).

---

## Testes

- **Framework:** Vitest 3.1 com config compartilhada via `@repo/vitest-config`
- **Estratégia:** Unit tests com mocks de dependências externas (Supabase, AWS)
- **Cobertura:** Provider v8 com reporters text, JSON e HTML
- **Padrão:** Arrange-Act-Assert com `beforeEach` para limpeza de mocks
- **Localização:** Arquivos `.test.ts` co-localizados com o código fonte

```bash
pnpm run test                              # Todos os testes
pnpm run test --filter=@repo/db-queries    # Package específico
```

---

## Scripts Principais

| Comando | Descrição |
|---|---|
| `pnpm run dev` | Inicia todos os workspaces em dev (via Turbo) |
| `pnpm run dev:infra` | Sobe NATS via Docker |
| `pnpm run dev:apps` | Inicia web + api em paralelo |
| `pnpm run dev:all` | Infra + apps sequencialmente |
| `pnpm run build` | Build de produção (Turbo) |
| `pnpm run build:fresh` | Clean + build |
| `pnpm run test` | Roda todos os testes |
| `pnpm run lint` | Linting em todos os packages |
| `pnpm run check-types` | Verificação de tipos TypeScript |
| `pnpm run clean` | Limpa caches (.next, .turbo, dist) |
| `pnpm run clean:all` | Clean completo incluindo node_modules |

---

## Variáveis de Ambiente

| Variável | Uso |
|---|---|
| `SUPABASE_URL` | URL da instância Supabase |
| `SUPABASE_ANON_KEY` | Chave pública para auth no browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (server-side) |
| `AWS_REGION` | Região AWS (ex: us-east-1) |
| `AWS_ACCESS_KEY_ID` | Credenciais IAM |
| `AWS_SECRET_ACCESS_KEY` | Credenciais IAM |

Todas declaradas como `globalEnv` no `turbo.json`.

---

## CI/CD

**Workflow:** `.github/workflows/pr-build-check.yml`
**Trigger:** Pull requests para qualquer branch
**Pipeline:** Checkout → Node 18 → pnpm install (--frozen-lockfile) → Build → Test
**Cache:** pnpm store com hash do lockfile

---

## Infraestrutura Local (Docker)

NATS message broker via Docker Compose:
- **Porta 4222:** Conexões TCP (Node.js)
- **Porta 8222:** HTTP monitoring
- **Porta 9222:** WebSocket (Browser)

---

## Observações

- **Estágio inicial** (v0.1.0) - arquitetura bem definida mas funcionalidades ainda em construção
- **Separação de concerns** sólida - cada package tem responsabilidade única
- **TypeScript strict** em todo o projeto garante type-safety
- **Tema OKLch** no CSS é uma escolha moderna para consistência de cores
- **Issue conhecida:** `@apply border-border` global sobrescreve cores de borda customizadas (workaround documentado em `docs/STYLING.md`)
- Foco recente do desenvolvimento em infraestrutura de testes (últimos commits)
