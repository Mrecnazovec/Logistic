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
ENV YANDEX_SECRET_KEY=9c3057fe-ba49-4897-b3c0-a6370c21e656
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm i typescript
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
EXPOSE 3002
CMD ["npm", "run", "start"]
