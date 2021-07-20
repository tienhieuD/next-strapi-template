FROM node:14-alpine AS build-ckeditor5
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Build Ckeditor dependencies
COPY ckeditor5 .
RUN yarn
RUN yarn build


# Install dependencies only when 
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=build-ckeditor5 /app/build ./ckeditor5/build

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 

ARG DATABASE_CLIENT
ARG DATABASE_NAME
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_ROOT_PASSWORD
ARG DATABASE_SSL
ARG NEXT_PUBLIC_PREVIEW_SECRET_TOKEN
ARG NEXT_PUBLIC_URL
ARG STRAPI_SMTP_USERNAME
ARG STRAPI_SMTP_PASSWORD

# NODE_OPTIONS="--max-old-space-size=8192" \
ENV NODE_ENV=production \
    DATABASE_CLIENT=${DATABASE_CLIENT} \
    DATABASE_NAME=${DATABASE_NAME} \
    DATABASE_HOST=${DATABASE_HOST} \
    DATABASE_PORT=${DATABASE_PORT} \
    DATABASE_USERNAME=${DATABASE_USERNAME} \
    DATABASE_PASSWORD=${DATABASE_PASSWORD} \
    DATABASE_ROOT_PASSWORD=${DATABASE_ROOT_PASSWORD} \
    DATABASE_SSL=${DATABASE_SSL} \
    NEXT_PUBLIC_PREVIEW_SECRET_TOKEN=${NEXT_PUBLIC_PREVIEW_SECRET_TOKEN} \
    NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL} \
    STRAPI_SMTP_USERNAME=${STRAPI_SMTP_USERNAME} \
    STRAPI_SMTP_PASSWORD=${STRAPI_SMTP_PASSWORD}

# Build app
COPY . .
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]