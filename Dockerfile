# Stage 1: Build and Test
FROM node:18-buster-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json /app/
RUN pnpm install

COPY src /app/src/
COPY tsconfig.json /app/
COPY .eslint* /app/
COPY test /app/test/

RUN pnpm build
RUN pnpm test

# Stage 2: Prepare final image
FROM node:18-buster-slim
WORKDIR /app
COPY --from=builder /app/dist/src /app/dist/
COPY --from=builder /app/node_modules /app/node_modules/
COPY package*.json /app/

# Specific files to this project
COPY .env /app/

ENV TZ=UTC
ENV LOG_SETUP=prod

ENTRYPOINT ["node", "dist/App.js"]