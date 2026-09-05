import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createAPIRouter } from "@/lib/setup-api";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { requireSessionMiddleware } from "@/middlewares/admin.middleware";
import { createQuoteRequestSchema } from "core/zod";
import { quoteRequests } from "core/database/schema";
import { sendEmail } from "core/email/resend";
import {
  quoteRequestInternalTemplate,
  quoteRequestConfirmationTemplate,
} from "core/email/templates";

// Support inbox that receives all internal notifications
const SUPPORT_EMAIL =
  process.env.FIFO_SUPPORT_EMAIL ?? "support@fifostadfirma.se";
const FROM_EMAIL =
  process.env.FIFO_FROM_EMAIL ?? "Fifo Städfirma <support@fifostadfirma.se>";

// ── Response schemas ─────────────────────────────────────────────────────────

const quoteRequestResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  serviceType: z.string(),
  propertySizeSqft: z.number(),
  message: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const quoteRequestListSchema = z.array(quoteRequestResponseSchema);

// ── Routes ────────────────────────────────────────────────────────────────────

const router = createAPIRouter();

// GET /api/quote-requests/mine — the authenticated user's own quote requests
router.openapi(
  createRoute({
    tags: ["Quote Requests"],
    method: "get",
    path: "/quote-requests/mine",
    middleware: [authMiddleware, requireSessionMiddleware],
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        quoteRequestListSchema,
        "User's quote requests"
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        createMessageObjectSchema("Unauthorized"),
        "Sign in required"
      ),
    },
  }),
  async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");

    const rows = await db.query.quoteRequests.findMany({
      where: (t, { eq }) => eq(t.userId, user.id),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    return c.json(
      rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
      HttpStatusCodes.OK
    );
  }
);

// POST /api/quote-requests — create a new quote request (auth required)
router.openapi(
  createRoute({
    tags: ["Quote Requests"],
    method: "post",
    path: "/quote-requests",
    middleware: [authMiddleware, requireSessionMiddleware],
    request: {
      body: jsonContentRequired(
        createQuoteRequestSchema,
        "Quote request details"
      ),
    },
    responses: {
      [HttpStatusCodes.CREATED]: jsonContent(
        quoteRequestResponseSchema,
        "Quote request created"
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        createMessageObjectSchema("Unauthorized"),
        "Sign in required"
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createMessageObjectSchema("Validation error"),
        "Invalid request body"
      ),
    },
  }),
  async (c) => {
    const user = c.get("user")!;
    const db = c.get("db");
    const body = c.req.valid("json");

    // ── 1. Persist ────────────────────────────────────────────────────────────
    const [inserted] = await db
      .insert(quoteRequests)
      .values({
        userId: user.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        serviceType: body.serviceType,
        propertySizeSqft: body.propertySizeSqft,
        message: body.message ?? null,
      })
      .returning();

    // ── 2. Send emails (fire-and-forget — never blocks the response) ──────────
    const emailData = {
      clientName: body.name,
      clientEmail: body.email,
      clientPhone: body.phone,
      serviceType: body.serviceType,
      propertySizeSqft: body.propertySizeSqft,
      message: body.message ?? null,
      submittedAt: inserted.createdAt.toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    // Internal notification → support inbox
    sendEmail({
      to: SUPPORT_EMAIL,
      from: FROM_EMAIL,
      subject: `New quote request from ${body.name}`,
      html: quoteRequestInternalTemplate(emailData),
    }).catch((err) =>
      console.error("[quote-requests] Internal email failed:", err)
    );

    // Client confirmation → the email they provided in the form
    sendEmail({
      to: body.email,
      from: FROM_EMAIL,
      replyTo: SUPPORT_EMAIL,
      subject: "We've received your quote request — Fifo Städfirma",
      html: quoteRequestConfirmationTemplate(emailData),
    }).catch((err) =>
      console.error("[quote-requests] Client confirmation email failed:", err)
    );

    // ── 3. Return created record ──────────────────────────────────────────────
    return c.json(
      {
        ...inserted,
        createdAt: inserted.createdAt.toISOString(),
        updatedAt: inserted.updatedAt.toISOString(),
      },
      HttpStatusCodes.CREATED
    );
  }
);

export default router;
