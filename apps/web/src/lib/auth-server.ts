/**
 * Server-only auth helpers for Next.js Server Components and Route Handlers.
 *
 * These functions call the backend directly (server-to-server) using the
 * cookie header from the incoming request — never the browser-facing proxy.
 * Do NOT import this file in Client Components.
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { betterFetch } from "@better-fetch/fetch";
import type { SessionUser, UserRole } from "core/auth/config";

// ── Internal types ───────────────────────────────────────────────────────────

/**
 * Shape returned by the Better-Auth /get-session endpoint.
 * The outer object has { session, user } — not to be confused with the
 * Session type (which is the whole auth instance's inferred type).
 */
type GetSessionResponse = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    impersonatedBy?: string | null;
  };
  user: SessionUser;
};

type AuthResult = {
  session: GetSessionResponse["session"];
  user: SessionUser;
};

// ── Internal session fetcher ─────────────────────────────────────────────────

/**
 * Fetches the current session from the backend using the request's cookies.
 * Returns null if there is no valid session (unauthenticated or fetch error).
 */
async function getServerSession(): Promise<AuthResult | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";

  if (!cookieHeader) return null;

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`
    : "http://localhost:4000/api/auth";

  const { data, error } = await betterFetch<GetSessionResponse>("/get-session", {
    baseURL,
    headers: {
      cookie: cookieHeader,
      // Prevent Brotli decompression errors in Node.js fetch
      "accept-encoding": "identity",
    },
  });

  if (error || !data?.session || !data?.user) return null;

  return { session: data.session, user: data.user };
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * Requires an authenticated session.
 *
 * If no session exists, redirects to `/signin?redirect=<currentPath>` so the
 * user is sent back after signing in.
 *
 * Use in Server Components or Route Handlers that need any signed-in user.
 *
 * @example
 * // In a Server Component:
 * const { session, user } = await requireAuth();
 */
export async function requireAuth(): Promise<AuthResult> {
  const result = await getServerSession();

  if (!result) {
    const headersList = await headers();
    const xUrl = headersList.get("x-url") ?? "";

    let redirectParam = "";
    if (xUrl) {
      try {
        const currentPath = new URL(xUrl).pathname;
        redirectParam = `?redirect=${encodeURIComponent(currentPath)}`;
      } catch {
        // ignore malformed URL
      }
    }

    redirect(`/signin${redirectParam}`);
  }

  return result;
}

/**
 * Requires a session AND role === "admin".
 *
 * - No session → redirect to `/signin?redirect=<currentPath>`
 * - Session but not admin → redirect to `/` (access denied)
 *
 * Use in Server Components or Route Handlers that are admin-only.
 *
 * @example
 * // In an admin Server Component:
 * const { user } = await requireAdmin();
 */
export async function requireAdmin(): Promise<AuthResult> {
  const result = await getServerSession();

  if (!result) {
    const headersList = await headers();
    const xUrl = headersList.get("x-url") ?? "";

    let redirectParam = "";
    if (xUrl) {
      try {
        const currentPath = new URL(xUrl).pathname;
        redirectParam = `?redirect=${encodeURIComponent(currentPath)}`;
      } catch {
        // ignore malformed URL
      }
    }

    redirect(`/signin${redirectParam}`);
  }

  if (result.user.role !== "admin") {
    // Authenticated but not admin — redirect to home silently
    redirect("/");
  }

  return result;
}

/**
 * Returns the current session without throwing or redirecting.
 * Returns null if unauthenticated. Safe to use in layouts and public pages
 * that conditionally render auth-aware UI.
 *
 * @example
 * const result = await getOptionalSession();
 * const isAdmin = result?.user.role === "admin";
 */
export async function getOptionalSession(): Promise<AuthResult | null> {
  return getServerSession();
}

/**
 * Checks whether the current request has a session with the given role.
 * Does not redirect — purely a boolean check.
 *
 * @example
 * if (await hasRole("admin")) { ... }
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const result = await getServerSession();
  return result?.user.role === role;
}
