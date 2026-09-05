import {
  adminClient,
  apiKeyClient,
  organizationClient,
  emailOTPClient
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Always use the Next.js proxy URL (same origin as the web app).
  // This ensures cookies are same-origin in the browser.
  // The proxy at /api/[[...path]] forwards requests to the backend.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000/api/auth",

  plugins: [adminClient(), apiKeyClient(), organizationClient(), emailOTPClient()],
  fetchOptions: {
    onRequest: (ctx) => {
      console.log("[authClient] Requesting:", ctx.url);
      // Disable compression on every request. Vercel/Hono returns Brotli by
      // default; Node.js fetch (undici) cannot decompress it → BrotliDecompressionError.
      // Browsers treat accept-encoding as a forbidden header and ignore it safely.
      ctx.headers.set("accept-encoding", "identity");
    },
    onResponse: (ctx) => {
      // Log successful responses to track cookie setting
      if (ctx.response?.ok) {
        const setCookie = ctx.response.headers.get('set-cookie');
        console.log("[authClient] Response OK:", {
          url: ctx.response.url,
          hasSetCookie: !!setCookie,
          setCookiePreview: setCookie?.substring(0, 50)
        });
      }
    },
    onError: (ctx) => {
      // Suppress known/handled errors to prevent console spam
      const isSessionFetch = ctx.response?.url?.includes('/get-session');
      
      // Extract error message from various formats
      let errorMessage = "Unknown error";
      if (ctx.error) {
        if (typeof ctx.error === "string") {
          errorMessage = ctx.error;
        } else if (ctx.error instanceof Error) {
          errorMessage = ctx.error.message;
        } else if (typeof ctx.error === "object") {
          // Handle error objects with message property
          const errorObj = ctx.error as Record<string, unknown>;
          if ("message" in errorObj && typeof errorObj.message === "string") {
            errorMessage = errorObj.message;
          } else if ("error" in errorObj && typeof errorObj.error === "string") {
            errorMessage = errorObj.error;
          } else if (Object.keys(errorObj).length === 0) {
            // Empty object - try to get more context from response
            errorMessage = `Request failed to ${ctx.response?.url || "unknown"}`;
          } else {
            // Stringify the error object
            errorMessage = JSON.stringify(errorObj);
          }
        }
      }
      
      // These are user-facing errors already shown as toasts – no need to log
      const isHandledAuthError =
        isSessionFetch ||
        errorMessage.includes("already exists") ||
        errorMessage.toLowerCase().includes("invalid email or password") ||
        errorMessage.toLowerCase().includes("invalid credentials") ||
        errorMessage.toLowerCase().includes("user not found") ||
        errorMessage.toLowerCase().includes("incorrect password") ||
        errorMessage.toLowerCase().includes("email not verified") ||
        errorMessage.toLowerCase().includes("not verified") ||
        errorMessage.toLowerCase().includes("verify your email");

      if (!isHandledAuthError) {
        console.error("BetterAuth Error:", errorMessage, {
          url: ctx.response?.url || "unknown",
          status: ctx.response?.status,
          statusText: ctx.response?.statusText
        });
      }
    },
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  }
});

