# 🧹 Fifo Städfirma — Monorepo Architecture on Cloudflare

A modern, high-performance **Full-Stack Monorepo SaaS Boilerplate & Marketing Portal** for **Fifo Städfirma** (Sweden), architected for global edge deployment using **Cloudflare Pages** and **Cloudflare Workers**.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Bun](https://img.shields.io/badge/Runtime-Bun-black?logo=bun)
![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)
![Hono](https://img.shields.io/badge/Backend-Hono-orange?logo=hono)
![Cloudflare](https://img.shields.io/badge/Edge-Cloudflare%20Pages%20%26%20Workers-F38020?logo=cloudflare)
![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38BDF8?logo=tailwindcss)
![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F?logo=drizzle)

---

## 🚀 Live Demo & Infrastructure

- **🌐 Frontend App (Cloudflare Pages):** [https://fifo-web.pages.dev](https://fifo-web.pages.dev)
- **⚡ Backend API (Cloudflare Workers):** [https://fifo-api.maheshpererakm.workers.dev](https://fifo-api.maheshpererakm.workers.dev)

---

## 🏗 System Architecture & Key Highlights

This codebase is built around a unified **Bun Monorepo** separating concerns cleanly between shared core logic, edge-native backend API, and a localized Next.js frontend web app.

```
Fifo/
├── apps/
│   ├── api/          # Hono OpenAPI backend running on Cloudflare Workers
│   └── web/          # Next.js 15 App Router running on Cloudflare Pages (Edge Runtime)
└── packages/
    └── core/         # Shared schemas, auth configs, DB ORM layer, RPC types & email templates
```

### 🎯 Key Architectural Pillars

1. **⚡ Edge-Native Architecture**
   - **Frontend:** Next.js 15 App Router configured with `@cloudflare/next-on-pages` edge functions.
   - **Backend:** Hono framework with `@hono/zod-openapi` deployed natively to Cloudflare Workers for sub-10ms global edge API responses.
2. **🌐 Full i18n Internationalization**
   - Support for **English (Default, `/`)** and **Swedish (`/sv/`)** using `next-intl`.
   - URL-aware locale routing and synchronized 1:1 translation namespaces (`apps/web/messages/{en,sv}.json`).
3. **🔐 Secure Role-Based Authentication**
   - Powered by **Better-Auth** supporting multi-role access control (`user` and `admin`).
   - Session verification and guarded middleware routes for `/dashboard` and `/admin`.
4. **📊 Full End-to-End Type Safety (RPC & Zod)**
   - Shared Zod schemas (`packages/core/src/zod/`) across client and server.
   - Type-safe API communication between Web and API using Hono RPC client.
5. **🗄 Flexible PostgreSQL ORM Layer**
   - **Drizzle ORM** supporting standard PostgreSQL connections as well as serverless edge drivers (Neon HTTP / Cloudflare Hyperdrive).

---

## 🛠 Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Runtime** | [Bun](https://bun.sh) | Ultra-fast package management & workspace engine |
| **Frontend** | [Next.js 15](https://nextjs.org) | App Router, Turbopack, Server Components |
| **Backend** | [Hono](https://hono.dev) | Edge-first web framework with OpenAPI validation |
| **Auth** | [Better-Auth](https://better-auth.com) | Multi-tenant auth with `admin` plugin support |
| **Database** | [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL | Type-safe SQL migrations and schemas |
| **Edge Host** | [Cloudflare Pages & Workers](https://pages.cloudflare.com) | Global edge serverless deployment |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + Shadcn/UI | Modern styling tokens and component primitives |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) | Locale routing & internationalization |
| **Email** | [Resend](https://resend.com) | Transactional email delivery |

---

## 📂 Directory Layout

```
.
├── apps/
│   ├── api/
│   │   ├── index.ts               # Worker entry point
│   │   ├── wrangler.jsonc         # Cloudflare Workers configuration
│   │   └── src/
│   │       ├── routes/            # Zod-OpenAPI route definitions
│   │       ├── handlers/          # Business logic handlers
│   │       └── registry/          # RPC type registration registry
│   └── web/
│       ├── next.config.ts         # Next.js & Turbopack monorepo configuration
│       └── src/
│           ├── app/[locale]/      # Localized App Router pages
│           ├── components/        # UI components (Header, PortfolioBanner, etc.)
│           ├── modules/           # Feature modules (auth, quote, contact, admin)
│           └── middleware.ts      # Auth & i18n edge middleware
└── packages/
    └── core/
        └── src/
            ├── auth/              # Server-side Better-Auth setup
            ├── database/          # Drizzle schema, migrations, DB adapters
            ├── email/             # Resend email templates & lazy client
            ├── rpc/               # Type re-exports for RPC client
            └── zod/               # Shared validation schemas
```

---

## 🚦 Quick Start & Local Development

### 1. Prerequisites
- **Bun** >= 1.x installed globally (`curl -fsSL https://bun.sh/install | bash`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/maheshkmp/fifo-cleaning-web-application-cloudflare-pages-web-workers-api-architecture.git
cd fifo-cleaning-web-application-cloudflare-pages-web-workers-api-architecture

# Install monorepo dependencies
bun install
```

### 3. Environment Setup
Copy `.env.example` or create `.env` files in project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
BETTER_AUTH_SECRET="<your_secret_key>"
RESEND_API_KEY="<your_resend_api_key>"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Database Setup & Migrations
```bash
cd packages/core
bunx drizzle-kit generate
bun run db:migrate
```

### 5. Run Development Servers
From the root workspace directory:
```bash
bun run dev
```
- **Web app:** `http://localhost:3000`
- **Hono API:** `http://localhost:3001`

---

## 🚢 Deploying to Cloudflare

### Deploying API (`apps/api`) to Cloudflare Workers
```bash
cd apps/api
npx wrangler deploy
```

### Deploying Web (`apps/web`) to Cloudflare Pages
```bash
cd apps/web
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static --project-name=fifo-web
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
