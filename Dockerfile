# ---------------------------------------------------------------------------
# BUILDER
# ---------------------------------------------------------------------------
FROM node:26-slim AS builder
WORKDIR /app

# Corepack was removed from Node 25+, so install pnpm directly. The exact version
# matches package.json "packageManager"; pnpm 10+ also self-honors that field
# (managePackageManagerVersions), so the two stay in sync.
RUN npm install -g pnpm@11.0.0

# Install deps against the frozen lockfile (pnpm-workspace.yaml carries the
# minimumReleaseAge supply-chain cooldown and must be present at install time)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build + lint + run core tests inside the image
COPY tsconfig.json eslint.config.js ./
COPY src ./src
COPY test-core ./test-core
RUN pnpm run build
RUN TZ=UTC LOG_SETUP=prod pnpm exec mocha dist/test-core/**/*.js --recursive --exit

# ---------------------------------------------------------------------------
# RUNTIME
# ---------------------------------------------------------------------------
FROM node:26-slim
WORKDIR /app

RUN npm install -g pnpm@11.0.0

# Production dependencies only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Ship only compiled application code (not the test output)
COPY --from=builder /app/dist/src ./dist/src

ENV TZ=UTC
ENV LOG_SETUP=prod

# Environment variables are injected at runtime (compose env_file / -e).
# We deliberately do NOT copy .env into the image, and we do NOT use --env-file
# in the entrypoint (there is no .env in the container, so the flag would error).
USER node
ENTRYPOINT ["node", "dist/src/App.js"]
CMD []
