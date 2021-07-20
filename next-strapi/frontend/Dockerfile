# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_STRAPI_API_URL
ARG NEXT_PUBLIC_PREVIEW_SECRET_TOKEN
ARG NEXT_PUBLIC_URL

ENV NEXT_PUBLIC_STRAPI_API_URL=${NEXT_PUBLIC_STRAPI_API_URL} \
    NEXT_PUBLIC_PREVIEW_SECRET_TOKEN=${NEXT_PUBLIC_PREVIEW_SECRET_TOKEN} \
    NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

ARG NEXT_PUBLIC_STRAPI_API_URL
ARG NEXT_PUBLIC_PREVIEW_SECRET_TOKEN
ARG NEXT_PUBLIC_URL

ENV NODE_ENV production \
    NEXT_PUBLIC_STRAPI_API_URL=${NEXT_PUBLIC_STRAPI_API_URL} \
    NEXT_PUBLIC_PREVIEW_SECRET_TOKEN=${NEXT_PUBLIC_PREVIEW_SECRET_TOKEN} \
    NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]