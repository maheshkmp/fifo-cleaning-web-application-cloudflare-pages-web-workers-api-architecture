FROM oven/bun:1.3.11

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages packages
COPY apps/web apps/web
COPY apps/api apps/api


RUN bun install --frozen-lockfile

WORKDIR /app/apps/web

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

RUN bun run build

EXPOSE 3000

CMD ["bun", "--bun", "next", "start"]
