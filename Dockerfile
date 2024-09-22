FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
COPY prisma ./prisma/
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS runner
RUN yarn global add prisma@5.13.0
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

CMD ["yarn", "run", "start:prod"]