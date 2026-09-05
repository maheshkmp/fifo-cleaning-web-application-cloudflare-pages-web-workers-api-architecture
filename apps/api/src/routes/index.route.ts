import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import { z } from "zod";

import { createAPIRouter } from "@/lib/setup-api";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = createAPIRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    middleware: [authMiddleware],
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string(),
          auth: z.object({
            user: z.any().nullable(),
            session: z.any().nullable()
          })
        }),
        "Hono API - Index Endpoint"
      )
    }
  }),
  async (c) => {
    const user = c.get("user");
    const session = c.get("session");
    const db = c.get("db");

    const result = await db.execute(`select 'hello world from DB!' as text`);

    return c.json(
      {
        message: `Context Database Result: ${result?.rows[0]?.text}`,
        auth: {
          user,
          session
        }
      },
      HttpStatusCodes.OK
    );
  }
);

export default router;
