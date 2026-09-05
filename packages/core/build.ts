// Build script for core package
const entrypoints = [
  "./src/auth/config.ts",
  "./src/auth/setup.ts",
  "./src/auth/helpers.ts",
  "./src/database/index.ts",
  "./src/database/schema/index.ts",
  "./src/database/queries/index.ts",
  "./src/rpc/index.ts",
  "./src/zod/index.ts",
  "./src/email/resend.ts",
  "./src/email/templates.ts"
];

const result = await Bun.build({
  entrypoints,
  outdir: "./dist",
  target: "bun",
  format: "esm",
  splitting: false,
  sourcemap: "external",
  naming: {
    entry: "[dir]/[name].js"
  },
  external: [
    "better-auth",
    "better-auth/adapters/drizzle",
    "better-auth/plugins",
    "drizzle-orm",
    "drizzle-orm/neon-http",
    "drizzle-orm/node-postgres",
    "@neondatabase/serverless",
    "pg",
    "hono/client",
    "api/types",
    "zod",
    "resend"
  ]
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

console.log("✓ Build successful!");
console.log(`✓ Generated ${result.outputs.length} files`);
