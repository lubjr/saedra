FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/bedrock-service/package.json ./packages/bedrock-service/
COPY packages/project-service/package.json ./packages/project-service/
COPY packages/db-connector/package.json ./packages/db-connector/
COPY packages/db-queries/package.json ./packages/db-queries/
COPY packages/aws-connector/package.json ./packages/aws-connector/
COPY packages/diagram-service/package.json ./packages/diagram-service/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .
RUN rm -rf packages/vitest-config && \
    sed -i '/"@repo\/vitest-config"/d' packages/*/package.json
RUN pnpm run build --filter=api...
RUN pnpm deploy --filter=api --prod --legacy /prod/api

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /prod/api .

EXPOSE 3002
CMD ["node", "dist/index.js"]
