# Saedra

Monorepo (pnpm + Turborepo) for Saedra: a CLI-first architectural memory and
AI-powered code review tool. Frontend dashboard (Next.js), backend API
(Express), CLI (`saedra`), all backed by Supabase. Early stage (v0.1.0).

## Before starting non-trivial work, pull live project state

This repo *is* a Saedra project (`.saedra` at the root links it to the
`saedra-memory` project). Run `saedra context` (compressed, made for AI
prompts) or `saedra explain` (narrative, for onboarding) to get the current
Architecture State, active Decisions, recent Changes, and Violation Rules
straight from the project's own memory — faster and more current than
reading through `saedra/*.md` by hand. Requires `saedra login` once
(`~/.saedra/config.json`); if the token has expired, `saedra logout` then
`saedra login` again. `saedra timeline` shows the chronological view.

The CLI binary lives in `packages/cli` — build with
`pnpm --filter @saedra/cli build`, run via `node packages/cli/dist/index.js <command>`,
or link globally with `cd packages/cli && pnpm link --global`.

## Where things live

- `docs/*.md` — source of truth for dev workflows and CLI reference
  (`CLI.md`, `DEVELOPMENT.md`, `STYLING.md`, `TESTING.md`). This is also
  what `apps/docs` (Fumadocs) generates its MDX from at build time — edit
  these files, never the generated `apps/docs/content/`.
- `saedra/*.md` — planning docs, decisions, market/product analysis, design
  handoffs, written before/during implementation (Portuguese, informal).
  `saedra/closed/` holds completed plans, refactors, and design handoffs
  kept for history — check there before assuming something wasn't planned.
  `saedra/memory/` is a small parallel project-memory folder (distinct from
  the Supabase-backed memory the CLI manages).
- `saedra/ds/DESIGN_SYSTEM.md` — Tailwind class-string reference for the
  dashboard (dark zinc + teal, borders not shadows). Read before touching
  any `apps/web` UI.

## Structure

```
apps/
  web/    Next.js dashboard (App Router, Tailwind v4, @repo/ui)
  api/    Express REST API
  docs/   Fumadocs site, generated from docs/*.md
packages/
  cli/               saedra CLI (binary "saedra")
  ui/                design system (Tailwind + Radix, dark/light)
  db-connector/       Supabase clients (anon + service)
  db-queries/         query layer (auth, profiles, projects, documents, credentials, diagrams)
  project-service/    project/document business logic, Express routes
  bedrock-service/     AWS Bedrock integration
  aws-connector/       AWS clients (EC2, RDS, S3)
  nats-client/         NATS client (node + browser)
```

## Commands

```bash
pnpm run dev            # all workspaces
pnpm run dev:fresh       # clean cache + dev (use after pulling changes / style issues)
pnpm run build
pnpm run test            # vitest across packages
pnpm run lint
pnpm run check-types
```

## Conventions worth knowing

- TypeScript strict everywhere; run `check-types` before considering a
  change done.
- No comments in code unless explaining a non-obvious *why* — matches the
  existing codebase style.
- Dashboard UI: no shadcn `Card`/`CardHeader`/`CardTitle` in project tab
  components (board/detail/KPI strip) — raw `div` + Tailwind, following the
  pattern established across Decisions/Changes/Rules/Memory/Metrics/Reviews
  (see `saedra/closed/refacs/*.md`). No drop shadows — elevation via
  borders + surface tint only. Teal is the only brand accent.
- Git workflow: never commit automatically — suggest a message, let the
  user run it.
