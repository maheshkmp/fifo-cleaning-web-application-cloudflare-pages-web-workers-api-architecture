import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "core/auth/config";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Extend Session to include the `role` field added by the admin plugin
type SessionWithRole = Session & {
  user: Session["user"] & { 
    role?: string | null;
    emailVerified?: boolean;
  };
};

// ── next-intl locale routing middleware ──
const intlMiddleware = createIntlMiddleware(routing);

// ── Auth route lists (locale-stripped paths, no leading /locale segment) ──
const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified",
  "/verify-email",
];

const protectedRoutes = ["/admin", "/dashboard", "/cv-builder", "/cover-letter"];

/**
 * Strip the locale prefix from a pathname so auth logic works on bare paths.
 * e.g. "/sv/dashboard" → "/dashboard", "/en/signin" → "/signin", "/dashboard" → "/dashboard"
 */
function stripLocale(pathname: string): string {
  // Match /en/... or /sv/... at the start
  const match = pathname.match(/^\/(en|sv)(\/|$)(.*)/);
  if (match) {
    return "/" + (match[3] || "");
  }
  return pathname;
}

/**
 * Detect the active locale from the pathname (after intlMiddleware has run
 * we read from the x-next-intl-locale header set by the plugin, or fall back
 * to parsing the URL).
 */
function detectLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|sv)(\/|$)/);
  return match ? match[1] : "en"; // default locale has no prefix
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Pass API routes straight through (auth API + Next internals) ──
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }

  // ── 1. Run next-intl locale routing first ──
  // This handles: locale detection, rewriting, and setting cookies/headers.
  const intlResponse = intlMiddleware(request);

  // ── 2. Auth logic on locale-stripped path ──
  const barePath = stripLocale(pathname);
  const locale = detectLocale(pathname);

  const isProtectedPath = protectedRoutes.some((route) =>
    barePath.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(barePath);

  if (!isAuthRoute && !isProtectedPath) {
    // Not an auth-sensitive route — let intl response through as-is.
    return intlResponse;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  const cookies = request.headers.get("cookie") || "";

  // Short-circuit: no cookies → no session possible.
  if (!cookies) {
    if (isProtectedPath) {
      const signinUrl = new URL(`/${locale === "en" ? "" : locale + "/"}signin`, request.url);
      return NextResponse.redirect(signinUrl);
    }
    return intlResponse;
  }

  // ── 3. Fetch session from backend ──
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`
    : "http://localhost:4000/api/auth";

  const { data: session, error } = await betterFetch<SessionWithRole>(
    "/get-session",
    {
      baseURL,
      headers: {
        cookie: cookies,
        // Disable compression: Vercel/Hono sends Brotli by default but
        // Node.js fetch cannot decompress it, causing BrotliDecompressionError
        "accept-encoding": "identity",
      },
    }
  );

  if (error) {
    console.error("[Middleware] Session fetch error:", error);
  }

  /** Build a locale-aware redirect URL */
  const localePath = (path: string) => {
    const prefix = locale === "en" ? "" : `/${locale}`;
    return new URL(`${prefix}${path}`, request.url);
  };

  // ── 4. Email verification gate (commented out for now) ──
  /*
  if (session && session.user.emailVerified === false) {
    if (barePath !== "/verify-email" && !barePath.startsWith("/api/auth/sign-out")) {
      const verifyUrl = localePath("/verify-email");
      if (session.user.email) {
        verifyUrl.searchParams.set("email", session.user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
    return intlResponse;
  }
  */

  // ── 5. Authenticated user hitting an auth route → redirect to role home ──
  if (isAuthRoute && session) {
    if (session.user.role === "admin") {
      return NextResponse.redirect(localePath("/admin"));
    }
    if (session.user.role === "user") {
      return NextResponse.redirect(localePath("/dashboard"));
    }
  }

  // ── 6. Protected route without session → redirect to sign in ──
  if (isProtectedPath && !session) {
    return NextResponse.redirect(localePath("/signin"));
  }

  // ── 7. /admin — only admin role ──
  if (session && barePath.startsWith("/admin")) {
    if (session.user.role === "admin") {
      return intlResponse;
    }
    // Non-admin users → redirect to home
    return NextResponse.redirect(localePath("/"));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
