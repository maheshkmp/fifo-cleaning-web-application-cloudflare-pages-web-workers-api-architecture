import type { NextConfig } from "next";
import { copyFileSync } from "fs";
import { resolve } from "path";
import createNextIntlPlugin from "next-intl/plugin";

// Copy pdfjs worker to public/ so it can be served as /pdf.worker.min.mjs
// This must stay in sync with the installed pdfjs-dist version.
try {
  copyFileSync(
    resolve(__dirname, "../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
    resolve(__dirname, "public/pdf.worker.min.mjs"),
  );
} catch {
  // Fallback: try local node_modules
  try {
    copyFileSync(
      resolve(__dirname, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs"),
      resolve(__dirname, "public/pdf.worker.min.mjs"),
    );
  } catch {
    console.warn("⚠️  Could not copy pdfjs worker to public/. ManualCopy may be needed.");
  }
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Proxying is now handled by the catch-all API route at /api/[[...path]]/route.ts
  // This approach provides better error handling and cookie forwarding
};

export default withNextIntl(nextConfig);
