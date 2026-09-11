FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="mysql://poalab:poalab@mysql:3306/gestao_poalab"
RUN yarn prisma generate
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
