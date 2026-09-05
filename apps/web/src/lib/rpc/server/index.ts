import { hc } from "hono/client";
import type { Router } from "core/types";
import { cookies } from "next/headers";

export const getClient = async () => {
  const cookieStore = await cookies();
  const serializedCookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    "http://localhost:4000";

  return hc<Router>(base, {

    fetch: (input: string | URL | Request, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (serializedCookies) {
        headers.set("cookie", serializedCookies);
      }

      return fetch(input, {
        ...init,
        headers,
        credentials: "include"
      });
    }
  });
};

