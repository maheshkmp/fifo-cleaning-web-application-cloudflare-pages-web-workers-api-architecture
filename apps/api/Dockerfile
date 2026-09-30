FROM oven/bun:1.3.11

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages packages
COPY apps/api apps/api

RUN bun install --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["bun", "run", "dev"]
