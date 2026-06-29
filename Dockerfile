FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    fontconfig \
    wget \
    && rm -rf /var/cache/*

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production

COPY --from=builder /app/.next           ./.next
COPY --from=builder /app/node_modules    ./node_modules
COPY --from=builder /app/package.json    ./
COPY --from=builder /app/public          ./public
COPY --from=builder /app/prisma          ./prisma
COPY --from=builder /app/broker-engine   ./broker-engine
COPY --from=builder /app/email-worker    ./email-worker
COPY --from=builder /app/src/types       ./src/types

RUN npx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
