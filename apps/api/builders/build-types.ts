// build-types.ts
import { resolve } from "path";
import { $ } from "bun";
import { readdir, readFile, writeFile } from "fs/promises";

// Establish directory structure
const BUILDERS_DIR = import.meta.dir;
const API_ROOT = resolve(BUILDERS_DIR, "..");
const WORKSPACE_ROOT = resolve(API_ROOT, "..", "..");
const CORE_TYPES = resolve(WORKSPACE_ROOT, "packages", "core", "types");

const DIST_TYPES = resolve(API_ROOT, "dist", "types");
const TSCONFIG_TYPES = resolve(BUILDERS_DIR, "tsconfig.types.json");

/**
 * Recursively process all .d.ts files and replace @/ path aliases with relative paths
 */
async function processDeclarationFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      await processDeclarationFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
      let content = await readFile(fullPath, "utf-8");

      // Replace @/ with ./ (since generated files maintain the src structure)
      content = content.replace(/from\s+["']@\//g, 'from "./');
      content = content.replace(
        /import\s+type\s+\{[^}]+\}\s+from\s+["']@\//g,
        (match) =>
          match.replace('from "@/', 'from "./').replace("from '@/", "from './")
      );
      content = content.replace(
        /import\s+\{[^}]+\}\s+from\s+["']@\//g,
        (match) =>
          match.replace('from "@/', 'from "./').replace("from '@/", "from './")
      );
      content = content
        .replace(/import\s+["']@\//g, 'import "./')
        .replace(/import\s+'@\//g, "import './");

      await writeFile(fullPath, content, "utf-8");
    }
  }
}

async function buildTypes() {
  console.log("📦 Building type exports for RPC...\n");

  try {
    // Clean previous outputs
    await $`rm -rf ${DIST_TYPES}`.quiet().nothrow();
    await $`rm -rf ${CORE_TYPES}`.quiet().nothrow();
    await $`mkdir -p ${DIST_TYPES}`.quiet();

    // Create a temporary tsconfig for type generation
    const tsconfigContent = {
      extends: "../tsconfig.json",
      compilerOptions: {
        declaration: true,
        emitDeclarationOnly: true,
        outDir: "../dist/types",
        skipLibCheck: true,
        noEmit: false,
        // Required for proper resolution in monorepo
        composite: false,
        incremental: false
      },
      include: ["../src/**/*.ts"],
      exclude: ["../node_modules", "../dist"]
    };

    await Bun.write(TSCONFIG_TYPES, JSON.stringify(tsconfigContent, null, 2));
    console.log("📝 Generated tsconfig.types.json");

    console.log("📝 Generating TypeScript declaration files...");

    // Use tsc with the generated tsconfig
    const result = await $`bun tsc --project ${TSCONFIG_TYPES}`.nothrow();

    if (result.exitCode !== 0) {
      console.error("❌ Type generation failed:");
      console.error(result.stderr.toString());
      process.exit(1);
    }

    console.log("✓ Declaration files generated successfully");

    // Process declaration files to replace path aliases
    console.log("📝 Replacing path aliases with relative paths...");
    await processDeclarationFiles(DIST_TYPES);
    console.log("✓ Path aliases replaced successfully");

    // Create a simplified type export file for easy consumption
    const typeExportContent = `// Auto-generated type exports for RPC
// This file re-exports the Router type for use in client applications

export type { Router } from "./src/registry/index";
`;

    await Bun.write(resolve(DIST_TYPES, "index.d.ts"), typeExportContent);

    // Move to packages/core/types
    console.log("📦 Moving types to packages/core/types...");
    await $`mv ${DIST_TYPES} ${CORE_TYPES}`.nothrow();
    console.log("✓ Types moved successfully");

    console.log(`✓ Output directory: ${CORE_TYPES}\n`);
    console.log("🎉 Type export build completed successfully!");
    console.log("\n📋 To use in web project:");
    console.log("   Import: import type { Router } from 'core/types'");
  } catch (error) {
    console.error("❌ Type export build failed:", error);
    process.exit(1);
  }
}

buildTypes();
