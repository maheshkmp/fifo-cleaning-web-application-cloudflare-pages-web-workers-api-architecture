"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { createQuoteRequestSchema } from "core/zod";
import type { CreateQuoteRequest, ServiceType } from "core/zod";
import {
  useSubmitQuote,
  loadPendingQuote,
  clearPendingQuote,
} from "../hooks/use-submit-quote";

// Service type labels (UI copy — kept local to avoid core/dist dependency)
const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  house_cleaning: "House Cleaning",
  office_cleaning: "Office Cleaning",
  moving_cleaning: "Moving Cleaning",
  deep_cleaning: "Deep Cleaning",
};

// ── Quick-select size ranges ───────────────────────────────────────────────────
// Each button populates the numeric input with the representative midpoint.
// The user can then type any value they like — the buttons are just shortcuts.

const SIZE_PRESETS: { key: "small" | "medium" | "large" | "xlarge"; value: number }[] = [
  { key: "small",  value: 350  },  // representative for < 500 sq ft
  { key: "medium", value: 750  },  // 500–1 000
  { key: "large",  value: 1500 },  // 1 000–2 000
  { key: "xlarge", value: 2500 },  // 2 000+
];

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  /** Called when submit is blocked because user isn't signed in */
  onAuthRequired: () => void;
  /** If true, the form is shown inline on the page (hero); else in a modal */
  compact?: boolean;
};

export function QuoteForm({ onAuthRequired, compact = false }: Props) {
  const t = useTranslations("hero.form");
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateQuoteRequest>({
    resolver: zodResolver(createQuoteRequestSchema),
    defaultValues: {
      serviceType: "house_cleaning",
      propertySizeSqft: 750,
    },
  });

  // Watch the numeric field so quick-select buttons can highlight the active one
  const currentSize = watch("propertySizeSqft");

  // Restore any pending form values saved before redirect to sign-in
  useEffect(() => {
    const pending = loadPendingQuote();
    if (pending) {
      if (pending.name)             setValue("name", pending.name);
      if (pending.email)            setValue("email", pending.email);
      if (pending.phone)            setValue("phone", pending.phone);
      if (pending.serviceType)      setValue("serviceType", pending.serviceType);
      if (pending.propertySizeSqft) setValue("propertySizeSqft", pending.propertySizeSqft);
      if (pending.message)          setValue("message", pending.message);
      clearPendingQuote();
    }
  }, [setValue]);

  const { submit, state } = useSubmitQuote({ onAuthRequired });

  const onSubmit = async (values: CreateQuoteRequest) => {
    const ok = await submit(values);
    if (ok) {
      setSubmitted(true);
      reset();
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center space-y-3">
        <div className="text-2xl">✓</div>
        <p className="font-semibold text-foreground">Request received</p>
        <p className="text-sm text-muted-foreground">
          We&apos;ll contact you within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "rounded-lg border border-border bg-card p-6 space-y-5",
        compact && "p-5 space-y-4"
      )}
      noValidate
    >
      {/* Name */}
      <Field label={t("name")} error={errors.name?.message}>
        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          placeholder="Anna Lindqvist"
          className={inputCls(!!errors.name)}
        />
      </Field>

      {/* Email */}
      <Field label={t("email")} error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="anna@example.se"
          className={inputCls(!!errors.email)}
        />
      </Field>

      {/* Phone */}
      <Field label={t("phone")} error={errors.phone?.message}>
        <input
          {...register("phone")}
          type="tel"
          autoComplete="tel"
          placeholder="+46 70 000 00 00"
          className={inputCls(!!errors.phone)}
        />
      </Field>

      {/* Service type */}
      <Field label={t("serviceType")} error={errors.serviceType?.message}>
        <select {...register("serviceType")} className={inputCls(!!errors.serviceType)}>
          {(Object.keys(SERVICE_TYPE_LABELS) as ServiceType[]).map((key) => (
            <option key={key} value={key}>
              {SERVICE_TYPE_LABELS[key]}
            </option>
          ))}
        </select>
      </Field>

      {/* Property size — quick-select buttons + exact numeric input */}
      <Field label={t("propertySize")} error={errors.propertySizeSqft?.message}>
        {/* Quick-select preset buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {SIZE_PRESETS.map((preset) => {
            const isActive = currentSize === preset.value;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() =>
                  setValue("propertySizeSqft", preset.value, { shouldValidate: true })
                }
                className={cn(
                  "py-1.5 px-1 rounded-md border text-xs font-medium transition-colors truncate",
                  isActive
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                    : "border-border bg-background text-muted-foreground hover:border-[color:var(--brand)]/50 hover:text-foreground"
                )}
              >
                {t(`sizeRanges.${preset.key}`)}
              </button>
            );
          })}
        </div>

        {/* Exact numeric input — always editable */}
        <input
          {...register("propertySizeSqft", { valueAsNumber: true })}
          type="number"
          min={50}
          max={50000}
          step={1}
          placeholder={t("propertySizePlaceholder")}
          className={inputCls(!!errors.propertySizeSqft)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t("propertySizeHelp")}
        </p>
      </Field>

      {/* Message (optional) */}
      <Field label="Additional notes (optional)" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={3}
          placeholder="Any special requirements, access instructions, etc."
          className={cn(inputCls(!!errors.message), "resize-none")}
        />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3 px-6 rounded-md bg-[color:var(--brand)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {state === "submitting" ? t("submitting") : t("submitCta")}
      </button>
    </form>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
    hasError ? "border-destructive focus:ring-destructive/30" : "border-border"
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
