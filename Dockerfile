FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV SERVER_URL=https://kad-one.com/api
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
ENV APP_URL=https://kad-one.com
ENV APP_DOMAIN=kad-one.com
ENV SERVER_URL=https://kad-one.com/api
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
EXPOSE 3002
CMD ["npm", "run", "start"]
