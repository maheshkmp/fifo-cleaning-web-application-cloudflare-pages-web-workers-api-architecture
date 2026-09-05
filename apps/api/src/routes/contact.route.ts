import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createAPIRouter } from "@/lib/setup-api";
import { sendEmail } from "core/email/resend";
import { contactFormTemplate } from "core/email/templates";

const SUPPORT_EMAIL =
  process.env.FIFO_SUPPORT_EMAIL ?? "support@fifostadfirma.se";
const FROM_EMAIL =
  process.env.FIFO_FROM_EMAIL ?? "Fifo Städfirma <support@fifostadfirma.se>";

const contactBodySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

const router = createAPIRouter();

// POST /api/contact — public contact form (no auth required)
router.openapi(
  createRoute({
    tags: ["Contact"],
    method: "post",
    path: "/contact",
    request: {
      body: jsonContentRequired(contactBodySchema, "Contact form submission"),
    },
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({ message: z.string() }),
        "Message received"
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createMessageObjectSchema("Validation error"),
        "Invalid request body"
      ),
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const submittedAt = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Fire-and-forget — never block the response on email delivery
    sendEmail({
      to: SUPPORT_EMAIL,
      from: FROM_EMAIL,
      replyTo: body.email,
      subject: `Contact: ${body.name} (${body.email})`,
      html: contactFormTemplate({
        senderName: body.name,
        senderEmail: body.email,
        message: body.message,
        submittedAt,
      }),
    }).catch((err) =>
      console.error("[contact] Email send failed:", err)
    );

    return c.json({ message: "Your message has been received." }, HttpStatusCodes.OK);
  }
);

export default router;
