import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  drizzle as drizzleNeon,
  type NeonHttpDatabase
} from "drizzle-orm/neon-http";
import {
  drizzle as drizzlePostgres,
  type NodePgDatabase
} from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export type DatabaseAdapter = "neon" | "postgres";
export type Database =
  | (NeonHttpDatabase<typeof schema> & {
      $client: NeonQueryFunction<false, false>;
    })
  | (NodePgDatabase<typeof schema> & {
      $client: unknown;
    });

// Initialize and export the database instance
let db: Database;
let adapter: DatabaseAdapter;

function isNeonDatabaseUrl(databaseUrl: string) {
  try {
    const hostname = new URL(databaseUrl).hostname;

    return hostname.endsWith(".neon.tech") || hostname === "neon.tech";
  } catch {
    return false;
  }
}

function resolveDatabaseAdapter(databaseUrl: string): DatabaseAdapter {
  const configuredAdapter = process.env.DATABASE_ADAPTER?.toLowerCase();

  if (configuredAdapter === "neon" || configuredAdapter === "postgres") {
    return configuredAdapter;
  }

  return isNeonDatabaseUrl(databaseUrl) ? "neon" : "postgres";
}

/**
 * Initialize the database connection
 * @param databaseUrl
 * @returns
 */
export function initDatabase(databaseUrl: string) {
  if (db) {
    return db;
  }

  adapter = resolveDatabaseAdapter(databaseUrl);

  if (adapter === "neon") {
    const sql = neon(databaseUrl);
    db = drizzleNeon(sql, { schema });
  } else {
    db = drizzlePostgres({ connection: databaseUrl, schema });
  }

  return db;
}

export function getDatabaseAdapter() {
  if (!adapter) {
    throw new Error("Database not initialized.");
  }

  return adapter;
}

/**
 * Get the database instance
 * @returns
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }

  return db;
}
