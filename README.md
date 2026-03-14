# Saedra🌳

Project management platform with AWS Bedrock integration.

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
  db-connector/       # Supabase connection
  db-queries/         # Database queries
  bedrock-service/    # AWS Bedrock integration
  project-service/    # Project logic
  aws-connector/      # AWS connection
```

## Development

```bash
pnpm install
pnpm run dev
```
