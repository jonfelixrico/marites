# Stage 1: create node image w/ pnpm installed
FROM node:18-alpine AS base
RUN npm i -g pnpm

# Stage 2: install dependencies
FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Stage 3: build, build, build
FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# Need to provide a default value or this will throw an error if none was provided
ARG BUILD_VERSION_OVERRIDE=

RUN BUILD_VERSION_OVERRIDE=$BUILD_VERSION_OVERRIDE pnpm build
RUN pnpm prune --prod

# Stage 4: actually deploy the thing via nginx
FROM nginx AS deploy
COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80

ENV API_BASE_URL http://host.docker.internal:9085;

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
