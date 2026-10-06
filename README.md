# Saedra🌳

CLI-first architectural memory and AI-powered code review for your codebase.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) |
| Backend | Express + TypeScript |
| Database | Supabase (PostgreSQL) |
| Monorepo | Turborepo + pnpm |

## Deploy (Production)

| Service | Provider | URL |
|---------|----------|-----|
| Frontend | Vercel | [https://saedra.pro](https://www.saedra.pro) |
| Docs | Vercel | [https://docs.saedra.pro](https://docs.saedra.pro) |
| API | Render (Docker) | [https://api.saedra.pro](https://api.saedra.pro) |
| Database | Supabase | (configured) |

- Push to `main` triggers automatic deploy on Vercel and Render
- `dev` branch for development

## Structure

```
apps/
  web/          # Next.js frontend
  api/          # Express backend
  docs/         # Documentation (Fumadocs)
packages/
  cli/                # saedra CLI (@usesaedra/cli)
  ui/                 # Design system (Tailwind + Radix)
  db-connector/       # Supabase connection
  db-queries/         # Database queries
  project-service/    # Project logic and API routes
```

## Development

```bash
pnpm install
pnpm run dev
```
