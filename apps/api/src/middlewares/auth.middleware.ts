import { MiddlewareHandler } from "hono";

import { getAuth } from "core/auth/setup";

import { APIBindings } from "@/types";

export const authMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const auth = getAuth();
  
  // Debug: log request details
  const cookies = c.req.header("cookie");
  console.log("[Auth Middleware] Request:", {
    path: c.req.path,
    method: c.req.method,
    hasCookies: !!cookies,
    cookiePreview: cookies?.substring(0, 100)
  });
  
  const session = await auth.api.getSession({ headers: c.req.raw.headers});

  console.log("[Auth Middleware] Session result:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    userRole: (session?.user as any)?.role
  });

  if (!session) {
    c.set("session", null);
    c.set("user", null);
    return next();
  }

  c.set("session", session.session);
  c.set("user", session.user as import("@/types").APIBindings["Variables"]["user"]);
  return next();
};
