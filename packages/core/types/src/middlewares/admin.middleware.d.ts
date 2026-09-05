import { MiddlewareHandler } from "hono";
import { APIBindings } from "./types";
/**
 * Requires the user to be authenticated (session must exist on context).
 * Must be used AFTER authMiddleware so the user is already set.
 * Returns 401 if not authenticated.
 */
export declare const requireSessionMiddleware: MiddlewareHandler<APIBindings>;
/**
 * Admin-only middleware.
 * Must be used AFTER authMiddleware so the user is already set on context.
 * Returns 401 if not authenticated, 403 if not admin.
 */
export declare const adminMiddleware: MiddlewareHandler<APIBindings>;
