import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

await sql`
  CREATE TABLE IF NOT EXISTS crop_downloads (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    file_name text NOT NULL DEFAULT 'image',
    created_at timestamp DEFAULT now() NOT NULL
  )
`;

console.log("✓ crop_downloads table created (or already exists)");
