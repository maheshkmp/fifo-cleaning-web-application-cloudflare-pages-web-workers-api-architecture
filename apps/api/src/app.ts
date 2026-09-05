let app: OpenAPIHono<APIBindings>;

// Import at module-level for faster cold starts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";

import { initDatabase } from "core/database";
import type { Database } from "core/database";
import { setupAuth } from "core/auth/setup";

import type { APIBindings } from "./types";
import { setupAPI } from "./lib/setup-api";
import { registerRoutes } from "./registry";
import configureOpenAPI from "./lib/open-api-config";

// Module-level initialization - runs during cold start
let db: Database;

try {
  // Initialize database connection at module load
  db = initDatabase(process.env.DATABASE_URL!);

  // Initialize authentication at module load
  console.log("[App Init] Initializing auth with env vars:", {
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    DATABASE: !!process.env.DATABASE_URL
  });
  
  setupAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET!
  });

  app = registerRoutes(setupAPI());

  configureOpenAPI(app);
} catch (error) {
  console.error("Failed to initialize database/auth:", error);

  // Fallback app that returns 500 for all requests
  const fallback = new Hono<APIBindings>();

  fallback.all("*", (c) => {
    return c.json(
      { error: "Internal Server Error: Initialization Failed" },
      500
    );
  });

  throw error;
}

export default app;
