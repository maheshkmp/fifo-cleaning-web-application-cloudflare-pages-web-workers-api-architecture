import { hc } from "hono/client";
import type { Router } from "../../types";

// Create type-safe RPC client with Router type from API
const client = hc<Router>(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  fetch: (input: string | URL | Request, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include" // Required for sending cookies cross-origin
    });
  }
});

export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<Router>(...args);
