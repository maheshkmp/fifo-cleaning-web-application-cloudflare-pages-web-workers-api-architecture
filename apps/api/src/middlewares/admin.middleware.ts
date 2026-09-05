import { MiddlewareHandler } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { APIBindings } from "@/types";

/**
 * Requires the user to be authenticated (session must exist on context).
 * Must be used AFTER authMiddleware so the user is already set.
 * Returns 401 if not authenticated.
 */
export const requireSessionMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: "Unauthorized: sign in required" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  return next();
};

/**
 * Admin-only middleware.
 * Must be used AFTER authMiddleware so the user is already set on context.
 * Returns 401 if not authenticated, 403 if not admin.
 */
export const adminMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: "Unauthorized: sign in required" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Forbidden: admin access required" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return next();
};
