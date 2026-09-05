# Project Overview: SaaS Boilerplate

Welcome to the **SaaS Boilerplate**. This is a clean, monorepo-based foundation designed for speed and scalability. It uses a modern tech stack centered around **Bun**, **Next.js**, **Hono**, and **Better-Auth**.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh/) (Package manager & Runtime)
- **Shared Package Manager:** [Bun Workspaces](https://bun.sh/docs/install/workspaces)
- **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Backend API:** [Hono](https://hono.dev/) (Zod-OpenAPI for type-safe routing)
- **Authentication:** [Better-Auth](https://www.better-auth.com/) (Modular auth for core and web)
- **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/)

---

## 📂 Project Structure


### `/apps`
Application layer for the monorepo.

- **`api/`**: The backend service powered by Hono.
  - `src/registry/`: Orchestrates all API route definitions.
  - `src/handlers/`: Contains the logic for processing requests.
  - `src/routes/`: Route definitions with Zod-OpenAPI schemas.
  - `src/lib/`: Backend-specific utilities (API setup, constants).
- **`web/`**: The frontend application powered by Next.js.
  - `src/app/`: Next.js App Router (Auth pages, Dashboard, Settings).
  - `src/components/`: Reusable UI components (Shadcn/UI, Header, Footer).
  - `src/modules/`: Feature-scoped logic (e.g., Auth forms and schemas).
  - `src/lib/`: Frontend utilities, RPC client, and Auth client.

### `/packages`
Shared logic and configuration.

- **`core/`**: The engine of the application.
  - `src/auth/`: Centralized Better-Auth configuration.
  - `src/database/`: Database schema (auth, etc.), migrations, and queries.
  - `src/email/`: Resend integration and HTML email templates.
  - `src/rpc/`: Hono RPC types for full-stack type safety.
  - `src/zod/`: Shared validation schemas used across both API and Web.

---

## 🛠️ Key Libraries

- **`better-auth`**: Handles sessions, social login, and multi-factor auth.
- **`lucide-react`**: Icon set for the visual interface.
- **`sonner`**: Toast notification system.
- **`drizzle-orm`**: provides a type-safe SQL experience.
- **`hono/client`**: Used for type-safe "RPC-style" communication between Next.js and the API.

---

## 🚦 Getting Started

1. **Install Dependencies:**
   ```bash
   bun install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` in the root and fill in the required variables (DATABASE_URL, BETTER_AUTH_SECRET, etc.).

3. **Database Migration:**
   ```bash
   cd packages/core
   bunx drizzle-kit generate
   bunx drizzle-kit push
   ```

4. **Development:**
   Run both apps in parallel from the root:
   ```bash
   # In root directory
   bun run dev
   ```

## 📜 Architectural Principles
- **Monorepo:** Use `packages/core` for any logic intended to be shared between the API and the Web app.
- **Type Safety:** Always define Zod schemas in `core` and use the Hono RPC client in the `web` app to ensure end-to-end type safety.
- **Modularity:** Keep feature-specific logic in `apps/web/src/modules` to prevent the `components` folder from becoming cluttered.
