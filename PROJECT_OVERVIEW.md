# Project Overview: SaaS Boilerplate & Marketing Portal (Fifo Städfirma)

Welcome to the **Fifo Städfirma** project. This is a clean, monorepo-based foundation designed for speed, scalability, and high performance. It features a marketing portal and client/admin application built around a modern tech stack centered on **Bun**, **Next.js 15**, **Hono**, **Better-Auth**, and **Cloudflare (Pages & Workers)** edge compatibility.

---

## 🚀 Tech Stack

- **Runtime & Workspaces:** [Bun](https://bun.sh/) (Fast runtime, package manager & workspace engine)
- **Frontend Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Turbopack, Server Components)
- **Backend API:** [Hono](https://hono.dev/) (Edge-first framework with `@hono/zod-openapi` for type-safe routing)
- **Authentication:** [Better-Auth](https://www.better-auth.com/) (Modular auth for core and web with `admin` and `emailOTP` plugins)
- **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL with serverless edge driver support)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/) (Custom brand tokens, clean minimal UI)
- **Validation:** [Zod](https://zod.dev/) (Shared schemas in core package)
- **Internationalization (i18n):** [next-intl](https://next-intl-docs.vercel.app/) (English `/` default, Swedish `/sv/` prefix)
- **Email:** [Resend](https://resend.com/) (Transactional email delivery)
- **UI Utilities:** `lucide-react` (icons), `sonner` (toasts)
- **Target Deployment:** Cloudflare Pages (Web) & Cloudflare Workers (API) / Node / Docker

---

## 📂 Comprehensive Monorepo Directory Structure

```
Fifo/
├── apps/
│   ├── api/                  # Backend service (Hono API running on Bun / Cloudflare Workers)
│   │   ├── index.ts          # Worker entry point
│   │   ├── wrangler.jsonc    # Cloudflare Workers configuration
│   │   └── src/
│   │       ├── app.ts        # Hono app instance setup
│   │       ├── handlers/     # Request handlers & business logic
│   │       ├── lib/          # Setup scripts & API constants
│   │       ├── middlewares/  # Auth middleware & Admin role guards
│   │       ├── registry/     # Route registry for RPC type exporting
│   │       ├── routes/       # Zod-OpenAPI route definitions
│   │       └── types/        # API-specific TypeScript definitions
│   │
│   └── web/                  # Frontend application (Next.js 15 App Router)
│       ├── next.config.ts    # Next.js monorepo & Turbopack config
│       ├── messages/         # i18n translation JSON files (en.json, sv.json)
│       └── src/
│           ├── app/[locale]/ # Localized routes (Home, About, Services, Contact, Auth, Admin, Dashboard)
│           ├── components/   # Shared UI (Header, Footer, Section blocks)
│           ├── i18n/         # Routing & locale configuration
│           ├── lib/          # RPC client (`rpc.ts`), Better-Auth client (`auth-client.ts`)
│           ├── middleware.ts # Auth & locale proxy middleware
│           └── modules/      # Feature modules (auth, quote, contact, admin)
│
└── packages/
    └── core/                 # Shared core engine & dependencies
        ├── src/
        │   ├── auth/         # Server-side Better-Auth configuration
        │   ├── database/     # Drizzle schema, migrations SQL, & DB connection helpers
        │   ├── email/        # Resend email templates & client setup
        │   ├── rpc/          # Hono RPC type re-exports for full-stack safety
        │   └── zod/          # Shared Zod validation schemas
        └── types/            # Pre-built RPC declaration types
```

---

## 🛠️ Key Monorepo Modules & Libraries

- **`better-auth`**: Manages user sessions, authentication hooks, password resets, OTP verification, and role-based access control (`user` vs `admin`).
- **`hono/client` (RPC)**: Enables end-to-end type-safe API communication between Next.js server/client components and the Hono API without manual fetch wrapper boilerplate.
- **`drizzle-orm`**: Provides type-safe SQL query building and migration management for PostgreSQL databases.
- **`next-intl`**: Provides locale-aware routing, server translation getters, and dynamic client hooks with 1:1 key parity between English and Swedish.
- **`lucide-react` & `sonner`**: Clean UI icon set and toast feedback system.

---

## 🚦 Getting Started & Local Development

### 1. Prerequisites
- **Bun** (>= 1.x) installed globally (`curl -fsSL https://bun.sh/install | bash`)

### 2. Environment Setup
Copy `.env.example` to `.env` in the root workspace and relevant app directories:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>"
BETTER_AUTH_SECRET="<your_secret_key>"
RESEND_API_KEY="<your_resend_api_key>"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Install Dependencies
Run from the workspace root:
```bash
bun install
```

### 4. Database Setup & Migrations
```bash
cd packages/core
bunx drizzle-kit generate    # Generate SQL migrations
bun run db:migrate           # Run production-safe database migrations
```

### 5. Running Development Servers
Run both API (`http://localhost:4000`) and Web (`http://localhost:3000`) in parallel from the workspace root:
```bash
bun run dev
```

---

## 🏗️ Build & Type-Checking Commands

All builds must pass with zero errors:

```bash
# Build & verify Next.js web application
cd apps/web && bun run build

# Build Hono API backend
cd apps/api && bun run build

# Re-generate RPC types from API registry
cd apps/api && bun run build:types
```

---

## 📜 Architectural Principles & Rules

1. **Monorepo Separation:** `packages/core` contains logic, schemas, and ORM code intended for sharing between `apps/api` and `apps/web`.
2. **End-to-End Type Safety:** Always define input/output validation schemas in `packages/core/src/zod/` and register Hono routes in `apps/api/src/registry/index.ts`. Consume routes in Next.js via `@/lib/rpc/client`.
3. **i18n Parity:** Every user-facing page must support both English (default, `/`) and Swedish (`/sv/`). Keep `apps/web/messages/en.json` and `sv.json` 1:1 identical in structure.
4. **Design System & Styling:** Modern, clean aesthetic with strict adherence to brand tokens (`var(--brand)` teal). No arbitrary text/background gradients or neon glows.
5. **Role-Based Guards:** Protect routes (`/dashboard`, `/admin`) using server session checks and role checks (`admin` role guard).
