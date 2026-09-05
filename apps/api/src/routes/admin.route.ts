import { createRoute, z } from "@hono/zod-openapi";
import { and, eq, gte, count, asc, desc } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createAPIRouter } from "@/lib/setup-api";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";
import { users, quoteRequests } from "core/database/schema";
import { sendEmail } from "core/email/resend";
import { sendQuoteSchema } from "core/zod";
import {
  quoteReadyTemplate,
  quoteClosedTemplate,
} from "core/email/templates";

// ── Constants ─────────────────────────────────────────────────────────────────

const SUPPORT_EMAIL =
  process.env.FIFO_SUPPORT_EMAIL ?? "support@fifostadfirma.se";
const FROM_EMAIL =
  process.env.FIFO_FROM_EMAIL ?? "Fifo Städfirma <support@fifostadfirma.se>";

// ── Shared error responses ────────────────────────────────────────────────────

const unauthorizedResponse = {
  [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
    createMessageObjectSchema("Unauthorized"),
    "Sign in required"
  ),
  [HttpStatusCodes.FORBIDDEN]: jsonContent(
    createMessageObjectSchema("Forbidden"),
    "Admin access required"
  ),
} as const;

const ADMIN_MW = [authMiddleware, adminMiddleware];

// ── Response schemas ──────────────────────────────────────────────────────────

const userRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
  banned: z.boolean().nullable(),
});

const quoteRowSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  serviceType: z.string(),
  propertySizeSqft: z.number(),
  message: z.string().nullable(),
  status: z.string(),
  quotedAmount: z.number().int().nullable(),
  quotedMessage: z.string().nullable(),
  quotedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const statsSchema = z.object({
  pendingCount: z.number().int(),
  thisWeekCount: z.number().int(),
});

const listQuerySchema = z.object({
  status: z.enum(["pending", "quoted", "closed"]).optional(),
  serviceType: z
    .enum(["house_cleaning", "office_cleaning", "moving_cleaning", "deep_cleaning"])
    .optional(),
  sort: z.enum(["date_asc", "date_desc"]).optional().default("date_desc"),
});

const statusSchema = z.object({
  status: z.enum(["pending", "quoted", "closed"]),
});

// ── Helper — fire-and-forget status email ─────────────────────────────────────
//
// Called from BOTH the status handler and the quote handler so that every
// transition into "quoted" or "closed" reliably notifies the customer.

function maybeSendStatusEmail(
  row: typeof quoteRequests.$inferSelect,
  newStatus: "pending" | "quoted" | "closed"
) {
  if (newStatus === "quoted" && row.quotedAmount != null) {
    sendEmail({
      to: row.email,
      from: FROM_EMAIL,
      replyTo: SUPPORT_EMAIL,
      subject: "Your quote is ready — Fifo Städfirma",
      html: quoteReadyTemplate({
        name: row.name,
        serviceType: row.serviceType,
        quotedAmount: row.quotedAmount,
        quotedMessage: row.quotedMessage,
      }),
    }).catch((err) =>
      console.error("[admin] Quote-ready email failed:", err)
    );
  }

  if (newStatus === "closed") {
    sendEmail({
      to: row.email,
      from: FROM_EMAIL,
      replyTo: SUPPORT_EMAIL,
      subject: "Your quote request has been closed — Fifo Städfirma",
      html: quoteClosedTemplate({
        name: row.name,
        serviceType: row.serviceType,
      }),
    }).catch((err) =>
      console.error("[admin] Quote-closed email failed:", err)
    );
  }
}

/** Serialize a DB row's date fields to ISO strings */
function serializeRow(r: typeof quoteRequests.$inferSelect) {
  return {
    ...r,
    quotedAt: r.quotedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// ── Router ────────────────────────────────────────────────────────────────────

const router = createAPIRouter();

// GET /admin/users ─────────────────────────────────────────────────────────────
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "get",
    path: "/admin/users",
    middleware: ADMIN_MW,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(z.array(userRowSchema), "All registered users"),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        banned: users.banned,
      })
      .from(users)
      .orderBy(users.createdAt);

    return c.json(
      rows.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
      HttpStatusCodes.OK
    );
  }
);

// GET /admin/quote-requests/stats ─────────────────────────────────────────────
// IMPORTANT: registered BEFORE /:id routes so Hono doesn't match "stats" as UUID
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "get",
    path: "/admin/quote-requests/stats",
    middleware: ADMIN_MW,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(statsSchema, "Quote request statistics"),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [pendingResult, weekResult] = await Promise.all([
      db
        .select({ value: count() })
        .from(quoteRequests)
        .where(eq(quoteRequests.status, "pending")),
      db
        .select({ value: count() })
        .from(quoteRequests)
        .where(gte(quoteRequests.createdAt, sevenDaysAgo)),
    ]);

    return c.json(
      {
        pendingCount: pendingResult[0]?.value ?? 0,
        thisWeekCount: weekResult[0]?.value ?? 0,
      },
      HttpStatusCodes.OK
    );
  }
);

// GET /admin/quote-requests ────────────────────────────────────────────────────
// Supports ?status, ?serviceType, ?sort query params — all applied server-side.
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "get",
    path: "/admin/quote-requests",
    middleware: ADMIN_MW,
    request: {
      query: listQuerySchema,
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(z.array(quoteRowSchema), "Filtered quote requests"),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");
    const { status, serviceType, sort } = (c.req.valid as any)("query");

    // Build where clauses
    const conditions = [];
    if (status)      conditions.push(eq(quoteRequests.status, status));
    if (serviceType) conditions.push(eq(quoteRequests.serviceType, serviceType));

    const orderBy = sort === "date_asc"
      ? asc(quoteRequests.createdAt)
      : desc(quoteRequests.createdAt);

    const rows = await db
      .select()
      .from(quoteRequests)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy);

    return c.json(rows.map(serializeRow), HttpStatusCodes.OK);
  }
);

// GET /admin/quote-requests/:id ───────────────────────────────────────────────
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "get",
    path: "/admin/quote-requests/:id",
    middleware: ADMIN_MW,
    request: {
      params: z.object({ id: z.string().uuid() }),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(quoteRowSchema, "Single quote request"),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        createMessageObjectSchema("Not Found"),
        "Quote request not found"
      ),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");
    const { id } = (c.req.valid as any)("param");

    const row = await db.query.quoteRequests.findFirst({
      where: (t, { eq: eqFn }) => eqFn(t.id, id),
    });

    if (!row) {
      return c.json({ message: "Not Found" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(serializeRow(row), HttpStatusCodes.OK);
  }
);

// PATCH /admin/quote-requests/:id/status ──────────────────────────────────────
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "patch",
    path: "/admin/quote-requests/:id/status",
    middleware: ADMIN_MW,
    request: {
      params: z.object({ id: z.string().uuid() }),
      body: jsonContentRequired(statusSchema, "New status"),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(quoteRowSchema, "Updated quote request"),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        createMessageObjectSchema("Not Found"),
        "Quote request not found"
      ),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");
    const { id } = (c.req.valid as any)("param");
    const { status } = (c.req.valid as any)("json");

    const [updated] = await db
      .update(quoteRequests)
      .set({ status })
      .where(eq(quoteRequests.id, id))
      .returning();

    if (!updated) {
      return c.json({ message: "Not Found" }, HttpStatusCodes.NOT_FOUND);
    }

    maybeSendStatusEmail(updated, status);
    return c.json(serializeRow(updated), HttpStatusCodes.OK);
  }
);

// PATCH /admin/quote-requests/:id/quote ───────────────────────────────────────
router.openapi(
  createRoute({
    tags: ["Admin"],
    method: "patch",
    path: "/admin/quote-requests/:id/quote",
    middleware: ADMIN_MW,
    request: {
      params: z.object({ id: z.string().uuid() }),
      body: jsonContentRequired(sendQuoteSchema, "Quote details"),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(quoteRowSchema, "Quote attached"),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        createMessageObjectSchema("Not Found"),
        "Quote request not found"
      ),
      ...unauthorizedResponse,
    },
  }),
  async (c) => {
    const db = c.get("db");
    const { id } = (c.req.valid as any)("param");
    const { quotedAmount, quotedMessage } = (c.req.valid as any)("json");

    const existing = await db.query.quoteRequests.findFirst({
      where: (t, { eq: eqFn }) => eqFn(t.id, id),
    });

    if (!existing) {
      return c.json({ message: "Not Found" }, HttpStatusCodes.NOT_FOUND);
    }

    const now = new Date();
    const [updated] = await db
      .update(quoteRequests)
      .set({
        quotedAmount,
        quotedMessage: quotedMessage ?? null,
        quotedAt: existing.quotedAt ?? now,
        status: "quoted",
      })
      .where(eq(quoteRequests.id, id))
      .returning();

    maybeSendStatusEmail(updated, "quoted");
    return c.json(serializeRow(updated), HttpStatusCodes.OK);
  }
);

export default router;
