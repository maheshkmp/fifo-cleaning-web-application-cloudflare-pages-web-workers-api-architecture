# AGENTS.md — Fifo Städfirma Monorepo

> Project-scoped rules for AI agents working in this repository.
> Read this file fully before making any changes.

---

## 1. Project Identity

**Fifo Städfirma** — a professional cleaning-services company based in Sweden.
This codebase is a **Bun monorepo** (SaaS boilerplate) adapted for a marketing + client portal website.

- **Live domain (target):** `fifostadfirma.se`
- **Languages:** English (default, no URL prefix) · Swedish (`/sv/…`)
- **Roles:** `user` (own data only) · `admin` (all users + quote requests)

---

## 2. Monorepo Layout

```
Fifo/
├── apps/
│   ├── api/          Hono backend (port 3001)
│   └── web/          Next.js 15 frontend (port 3000)
└── packages/
    └── core/         Shared logic — auth, DB, email, rpc, zod schemas
```

### `apps/api/src/`
| Directory | Purpose |
|---|---|
| `routes/` | Zod-OpenAPI route definitions — schema only, no business logic |
| `handlers/` | Request handlers — business logic lives here |
| `registry/index.ts` | **Register every new route here** — required for RPC type export |
| `middlewares/` | `auth.middleware.ts` (session), `admin.middleware.ts` (role guard) |
| `lib/` | `setup-api.ts`, `constants.ts` |
| `types/` | Shared Hono app types |

### `apps/web/src/`
| Directory | Purpose |
|---|---|
| `app/[locale]/` | Next.js App Router — all pages are locale-scoped |
| `app/[locale]/(auth)/` | Sign-in, sign-up, verify-email, forgot/reset password |
| `components/` | Shared UI — `header.tsx`, `footer.tsx`, `sections/` |
| `modules/` | Feature modules — `auth/`, `quote/`, `contact/`, `admin/` |
| `lib/` | `rpc.ts` (Hono RPC client), `auth-client.ts` (Better-Auth client) |
| `i18n/` | `routing.ts`, `config.ts` |

### `packages/core/src/`
| Directory | Purpose |
|---|---|
| `auth/` | Better-Auth server config — **server-side only** |
| `database/` | Drizzle schema, migrations, query helpers |
| `email/` | Resend client + HTML email templates |
| `rpc/` | Hono RPC type re-exports |
| `zod/` | Shared Zod schemas used across API and Web |

---

## 3. Tech Stack & Versions

| Technology | Version / Notes |
|---|---|
| Runtime | Bun |
| Frontend | Next.js 15 — App Router, Turbopack |
| Backend | Hono with `@hono/zod-openapi` |
| Auth | Better-Auth with `admin` and `emailOTP` plugins |
| Database | Drizzle ORM + PostgreSQL |
| Styling | Tailwind CSS + Shadcn/UI |
| Validation | Zod (schemas in `packages/core/src/zod/`) |
| i18n | next-intl — messages in `apps/web/messages/{en,sv}.json` |
| Email | Resend — templates in `packages/core/src/email/templates.ts` |
| Icons | lucide-react |
| Toast | sonner |

---

## 4. Development Commands

Always run from the **workspace root** unless stated otherwise:

```bash
bun install                  # install all workspace dependencies
bun run dev                  # start api + web in parallel

# Database (run from packages/core/)
bunx drizzle-kit generate    # generate migration SQL
bunx drizzle-kit push        # push schema to DB (dev only)
bun run db:migrate           # run migrations (production-safe)

# Build
cd apps/web && bun run build # build web — MUST pass with 0 errors before finishing any task
cd apps/api && bun run build # build api
cd packages/core && bun run build
```

**Always run `bun run build` in `apps/web` after changes and fix all TypeScript errors before completing a task.**

---

## 5. Adding a New API Route (mandatory checklist)

1. Define schema in `apps/api/src/routes/<name>.route.ts` using `createRoute` + Zod
2. Implement handler in `apps/api/src/handlers/<name>.handler.ts`
3. **Register the route in `apps/api/src/registry/index.ts`** — if you skip this, the RPC client won't know the route exists
4. Add Zod input/output schemas to `packages/core/src/zod/` if shared with web
5. Use the RPC client in web: `import { getClient } from "@/lib/rpc/client"` — do NOT use raw `fetch` for API routes
6. **RPC type limitation:** `tsc --emitDeclarationOnly` cannot preserve Hono's chained `.route()` schema inference. The pre-built `packages/core/types/` only carries the index route type. When calling any non-index route (admin, quote-requests, contact) from the web, always cast `client.api` to `any` first:
   ```ts
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const res = await (client.api as any).admin["quote-requests"][":id"].status.$patch(…);
   ```
   This is safe — the Hono RPC Proxy resolves routes correctly at runtime. After adding a route, also run `bun run build:types` from `apps/api` to keep the generated `.d.ts` in sync.

---

## 6. Adding a New Page (web)

- All pages live under `apps/web/src/app/[locale]/`
- Every new page **must** support both EN and SV
- Add translation keys to **both** `messages/en.json` and `messages/sv.json` — keys must be identical in structure
- Use `getTranslations({ locale, namespace: "..." })` in server components
- Use `useTranslations("namespace")` in client components
- NEVER use relative-path syntax like `t("../../other.key")` — use a second `useTranslations` call for a different namespace
- Call `setRequestLocale(locale)` at the top of every async page component
- Export `generateMetadata` with locale-aware title/description on every page

---

## 7. i18n Rules

- **Locale routing:** `localePrefix: "as-needed"` — English has no prefix (`/about`), Swedish uses `/sv/about`
- **Default locale:** `en`
- **Messages files:** `apps/web/messages/en.json` and `apps/web/messages/sv.json`
- Keys must be **1:1 identical** between both files — verify with:
  ```bash
  node -e "
  const en=require('./apps/web/messages/en.json');
  const sv=require('./apps/web/messages/sv.json');
  function flat(o,p=''){return Object.entries(o).flatMap(([k,v])=>{const key=p?p+'.'+k:k;return typeof v==='object'&&!Array.isArray(v)?flat(v,key):[key];})}
  const miss=[...new Set(flat(en))].filter(k=>!new Set(flat(sv)).has(k));
  console.log(miss.length?'MISSING IN sv: '+miss.join(', '):'ALL KEYS MATCH');
  "
  ```
- For arrays in JSON (e.g. `services.*.includes`), use `t.raw("key")` — not `t("key")`
- The `Footer` component is an **async server component** and receives `locale` as a prop from the layout
- The `Header` and `HeroSection` are client components — they use `useTranslations`

---

## 8. Authentication

- **Server-side:** `import { auth } from "@fifo/core/auth"` — from `packages/core/src/auth/config.ts`
- **Client-side:** `import { authClient } from "@/lib/auth-client"` — from `apps/web/src/lib/auth-client.ts`
- NEVER import the server auth config in a client component
- Sessions: use `authClient.useSession()` in client components; use `auth.api.getSession(headers())` in server components
- `requireEmailVerification` is set at the `emailAndPassword` level in `config.ts`, NOT inside `emailOTP({})` — that option was removed from `EmailOTPOptions` in the current better-auth version
- Role checking: `(session.user as any).role === "admin"` — the admin plugin extends the user type

---

## 9. Database

- Schema location: `packages/core/src/database/schema.ts`
- Migrations: `packages/core/src/database/migrations/`
- After changing schema: run `bunx drizzle-kit generate` then `bun run db:migrate`
- Do NOT run `drizzle-kit push` in production — use migration files
- Write reusable DB queries in `packages/core/src/database/` and export them

---

## 10. Design System & Styling Rules

**Brand colours (CSS variables in `globals.css`):**
- `var(--brand)` — teal `oklch(0.52 0.12 195)` — primary accent
- `var(--brand-muted)` — light teal tint for backgrounds/badges
- `var(--brand-foreground)` — white text on teal

**Design constraints (client requirement — strictly enforced):**
- NO gradients on text or backgrounds
- NO glow / neon / coloured shadows
- NO heavy box-shadows
- YES subtle `shadow-sm` for cards only
- YES professional minimal — clean `border-border` borders, generous whitespace

**Tailwind colour override syntax (required in Tailwind v4):**
```tsx
className="bg-[color:var(--brand)] text-white"          // teal button
className="bg-[color:var(--brand-muted)]/40"            // tinted panel
className="text-[color:var(--brand)]"                   // teal text
className="border-[color:var(--brand)]/30"              // teal border
```

**Section eyebrow + headline pattern:**
```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
  Section label
</p>
<h2 className="text-2xl font-bold tracking-tight text-foreground">Headline</h2>
```

**Bullet dot pattern (trust signals, feature lists):**
```tsx
<div className="size-5 rounded-full bg-[color:var(--brand-muted)] flex items-center justify-center shrink-0">
  <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
</div>
```

---

## 11. Component Conventions

- Client components (`"use client"`) go in `src/modules/<feature>/components/` or `src/components/`
- Server components (default) go in `src/app/[locale]/`
- Form components needing i18n: accept translated strings as **props** from the server page — do not call `useTranslations` for page-level copy in deeply nested client components (see `ContactFormI18n` as the reference pattern)
- Use `sonner` for toasts (`toast.success`, `toast.error`)
- Use `lucide-react` for icons
- Quote form is auth-gated — redirect to `/signin?redirect=/` if unauthenticated

---

## 12. Email

- Templates: `packages/core/src/email/templates.ts`
- Provider: Resend — configured via `EMAIL_FROM_NOREPLY` env var
- Template types: `emailVerificationOTPTemplate`, `forgotPasswordOTPTemplate`, `signInOTPTemplate`, `emailVerificationTemplate`
- Do NOT send emails from the web app directly — go through the API or Better-Auth hooks

---

## 13. Environment Variables

| File | Scope |
|---|---|
| `/Fifo/.env` | Root monorepo |
| `apps/api/.env` | API server |
| `apps/web/.env` | Web / Next.js |
| `packages/core/.env` | Core package (DB, auth, email) |

Key variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM_NOREPLY`, `NEXT_PUBLIC_API_URL`, `AUTH_SECRET`

---

## 14. Anti-patterns (never do these)

- Do not use `npm` or `yarn` — Bun only
- Do not hardcode EN/SV strings in components — always use next-intl
- Do not import server auth config in client components
- Do not use `bg-foreground text-background` for primary buttons — use `bg-[color:var(--brand)] text-white`
- Do not skip registering new API routes in `apps/api/src/registry/index.ts`
- Do not use `bunx drizzle-kit push` on a production database
- Do not add gradients, glow effects, or neon colours

---

## 15. Pages & Their Translation Namespaces

| Page | File | Namespace |
|---|---|---|
| Home | `app/[locale]/page.tsx` | (uses sections) |
| About | `app/[locale]/about/page.tsx` | `about` |
| Services | `app/[locale]/services/page.tsx` | `services` |
| Contact | `app/[locale]/contact/page.tsx` | `contact` |
| Privacy | `app/[locale]/privacy/page.tsx` | — (static) |
| Terms | `app/[locale]/terms/page.tsx` | — (static) |
| Dashboard | `app/[locale]/dashboard/` | — (auth-gated) |
| Admin | `app/[locale]/admin/` | — (admin-only) |
| Hero section | `components/sections/hero.tsx` | `hero`, `nav` |
| Header | `components/header.tsx` | `nav` |
| Footer | `components/footer.tsx` | `footer`, `nav` |
