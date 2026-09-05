import { hc } from "hono/client";
import type { Router } from "core/types";

// Create RPC client for direct backend API calls with credentials
export const getClient = async () => {
  // Use the Next.js proxy at /api/* for client-side requests.
  // This ensures cookies are forwarded/set correctly for the same-origin.
  const isServer = typeof window === "undefined";
  const base = isServer
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000")
    : "";

  const url = base;


  return hc<Router>(url, {
    fetch: (input: string | URL | Request, init?: RequestInit) =>
      fetch(input, {
        ...init,
        credentials: "include"
      })
  });
};

