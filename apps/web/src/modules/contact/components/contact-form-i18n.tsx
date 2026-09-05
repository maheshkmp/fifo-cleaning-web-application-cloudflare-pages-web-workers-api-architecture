"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Labels = {
  name: string;
  email: string;
  message: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
};

type Validation = {
  nameRequired: string;
  emailRequired: string;
  messageMin: string;
};

type Props = { labels: Labels; validation: Validation };

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/40 transition-shadow",
    hasError
      ? "border-destructive focus:ring-destructive/30"
      : "border-border focus:border-[color:var(--brand)]/50"
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

type State = "idle" | "submitting" | "done";

export function ContactFormI18n({ labels, validation }: Props) {
  const [state, setState] = useState<State>("idle");

  const contactSchema = z.object({
    name: z.string().min(2, validation.nameRequired),
    email: z.string().email(validation.emailRequired),
    message: z.string().min(10, validation.messageMin).max(2000),
  });

  type ContactForm = z.infer<typeof contactSchema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactForm) {
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Server error");
      setState("done");
      reset();
      toast.success(labels.successTitle, { description: labels.successBody });
    } catch {
      setState("idle");
      toast.error("Could not send message — please try again or email us directly.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-[color:var(--brand-muted)] bg-[color:var(--brand-muted)]/40 p-8 text-center space-y-3">
        <div className="size-10 rounded-full bg-[color:var(--brand)] flex items-center justify-center mx-auto">
          <span className="text-white text-lg font-bold">✓</span>
        </div>
        <p className="font-semibold text-foreground">{labels.successTitle}</p>
        <p className="text-sm text-muted-foreground">{labels.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-border bg-card p-6 space-y-5" noValidate>
      <Field label={labels.name} error={errors.name?.message}>
        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          className={inputCls(!!errors.name)}
        />
      </Field>

      <Field label={labels.email} error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          className={inputCls(!!errors.email)}
        />
      </Field>

      <Field label={labels.message} error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          placeholder={labels.messagePlaceholder}
          className={cn(inputCls(!!errors.message), "resize-none")}
        />
      </Field>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3 px-6 rounded-md bg-[color:var(--brand)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {state === "submitting" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
