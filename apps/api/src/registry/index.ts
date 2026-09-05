import { createAPIRouter } from "@/lib/setup-api";
import { OpenAPI } from "@/types";
import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";
import quoteRequests from "../routes/quote-requests.route";
import admin from "../routes/admin.route";
import contact from "../routes/contact.route";

export function registerRoutes(app: OpenAPI) {
  const registeredApp = app
    .route("/", index)
    .route("/", quoteRequests)
    .route("/", admin)
    .route("/", contact);

  return registeredApp;
}

// Standalone router instance and type export for RPC
export const router = registerRoutes(createAPIRouter().basePath(BASE_PATH));

export type Router = typeof router;
