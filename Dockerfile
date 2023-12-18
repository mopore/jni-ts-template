FROM node:20-slim
WORKDIR /app

RUN npm install -g pnpm
COPY package*.json /app/
RUN pnpm install

COPY .env /app
COPY src /app/src/
COPY tsconfig.json /app/
COPY .eslint* /app/
RUN pnpm build

ENV TZ=UTC
ENTRYPOINT ["node", "dist/App.js"]