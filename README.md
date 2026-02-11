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
| Frontend | Vercel | https://saedra-web.vercel.app |
| API | Render (Docker) | https://saedra-api.onrender.com |
| Database | Supabase | (configured) |

- Push to `main` triggers automatic deploy on Vercel and Render
- `dev` branch for development

## Structure

```
apps/
  web/          # Next.js frontend
  api/          # Express backend
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
