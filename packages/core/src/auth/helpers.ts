import { eq } from "drizzle-orm";
import type { Database } from "../database";
import { users } from "../database/schema";

export const FREE_SIGNATURE_LIMIT = 5;
export const PRO_SIGNATURE_LIMIT = 50;

export const FREE_QR_LIMIT = 5;
export const PRO_QR_LIMIT = 50;

export const FREE_CROP_LIMIT = 5;
export const PRO_CROP_LIMIT = 50;

/**
 * Checks whether a user has an active Pro (or Premium) subscription.
 * Always performs a DB check — never trust client-side claims.
 */
export async function isProUser(db: Database, userId: string): Promise<boolean> {
  const [user] = await db
    .select({
      plan: users.plan,
      subscriptionStatus: users.subscriptionStatus,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  return (
    (user.plan === "pro" || user.plan === "premium") &&
    user.subscriptionStatus === "active"
  );
}

/**
 * Checks whether a user has an active Premium subscription.
 * Only the "premium" plan is considered — "pro" and "basic" are excluded.
 */
export async function isPremiumUser(db: Database, userId: string): Promise<boolean> {
  const [user] = await db
    .select({
      plan: users.plan,
      subscriptionStatus: users.subscriptionStatus,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;

  return (
    user.plan === "premium" &&
    user.subscriptionStatus === "active"
  );
}
