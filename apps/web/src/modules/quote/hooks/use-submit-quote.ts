"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";
import type { CreateQuoteRequest } from "core/zod";

const PENDING_QUOTE_KEY = "fifo_pending_quote";

// ── sessionStorage helpers ────────────────────────────────────────────────────

export function savePendingQuote(values: CreateQuoteRequest) {
  try {
    sessionStorage.setItem(PENDING_QUOTE_KEY, JSON.stringify(values));
  } catch {
    // sessionStorage not available (SSR guard)
  }
}

export function loadPendingQuote(): Partial<CreateQuoteRequest> | null {
  try {
    const raw = sessionStorage.getItem(PENDING_QUOTE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<CreateQuoteRequest>;
  } catch {
    return null;
  }
}

export function clearPendingQuote() {
  try {
    sessionStorage.removeItem(PENDING_QUOTE_KEY);
  } catch {
    // noop
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

type UseSubmitQuoteOptions = {
  /** Called when the user is not signed in instead of submitting */
  onAuthRequired: () => void;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export function useSubmitQuote({ onAuthRequired }: UseSubmitQuoteOptions) {
  const { data: session, isPending } = authClient.useSession();
  const [state, setState] = useState<SubmitState>("idle");

  async function submit(values: CreateQuoteRequest): Promise<boolean> {
    // ── Auth gate ───────────────────────────────────────────────────────────
    if (isPending) return false; // session still loading — do nothing

    if (!session) {
      // Save form values so they can be restored after sign-in
      savePendingQuote(values);
      onAuthRequired();
      return false;
    }

    // ── Submit ──────────────────────────────────────────────────────────────
    setState("submitting");

    try {
      const client = await getClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await (client.api as any)["quote-requests"].$post({
        json: values,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: "Unknown error" }));
        const msg = (body as { message?: string }).message ?? "Submission failed";
        throw new Error(msg);
      }

      clearPendingQuote();
      setState("success");
      toast.success("Quote request submitted!", {
        description: "We'll be in touch within 1–2 business days.",
      });
      return true;
    } catch (err) {
      setState("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error("Could not submit quote request", { description: msg });
      return false;
    }
  }

  return { submit, state, isAuthenticated: !!session, isLoading: isPending };
}
