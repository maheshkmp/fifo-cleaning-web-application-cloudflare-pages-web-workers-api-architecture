/**
 * stamp-migrations.ts
 *
 * One-time utility: marks migrations 0000–0004 as already applied in the
 * __drizzle_migrations tracking table so the migrator does not try to re-run
 * them (they were applied to the database before the tracking table existed).
 *
 * Usage:
 *   bun src/database/stamp-migrations.ts
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

// ─── Load env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

loadEnv();

// ─── Main ────────────────────────────────────────────────────────────────────
const MIGRATIONS_DIR = path.resolve(
  import.meta.dir,
  "../database/migrations"
);
const JOURNAL_PATH = path.join(MIGRATIONS_DIR, "meta/_journal.json");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  // Ensure the drizzle schema and tracking table exist (same DDL drizzle uses)
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf8")) as {
    entries: { idx: number; tag: string; when: number }[];
  };

  let stamped = 0;

  for (const entry of journal.entries) {
    const sqlFile = path.join(MIGRATIONS_DIR, `${entry.tag}.sql`);
    if (!fs.existsSync(sqlFile)) {
      console.warn(`  [skip] ${entry.tag}.sql not found`);
      continue;
    }

    const content = fs.readFileSync(sqlFile, "utf8");
    const hash = crypto.createHash("sha256").update(content).digest("hex");

    // Check if this migration is already recorded
    const existing = await sql`
      SELECT id FROM drizzle."__drizzle_migrations" WHERE hash = ${hash} LIMIT 1
    `;

    if (existing.length > 0) {
      console.log(`  [already stamped] ${entry.tag}`);
      continue;
    }

    await sql`
      INSERT INTO drizzle."__drizzle_migrations" (hash, created_at)
      VALUES (${hash}, ${entry.when})
    `;

    console.log(`  [stamped] ${entry.tag}`);
    stamped++;
  }

  console.log(`\nDone — stamped ${stamped} migration(s).`);
}

main().catch((err) => {
  console.error("Stamp failed:", err);
  process.exit(1);
});
