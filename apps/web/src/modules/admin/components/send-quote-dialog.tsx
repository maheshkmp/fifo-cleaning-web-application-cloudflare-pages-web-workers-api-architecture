"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, SendHorizonal } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getClient } from "@/lib/rpc/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuoteDialogLabels {
  title: string;
  editTitle: string;
  description: string;
  amountLabel: string;
  amountPlaceholder: string;
  amountHelp: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  update: string;
  submitting: string;
  cancel: string;
  successSent: string;
  successUpdated: string;
  errorFailed: string;
  validation: {
    amountRequired: string;
    amountPositive: string;
    amountInteger: string;
    messageMax: string;
  };
  sendQuote: string;   // button label in table row
  editQuote: string;
}

type Props = {
  quoteId: string;
  /** Current quoted amount in öre (null = not yet quoted) */
  quotedAmount: number | null;
  quotedMessage: string | null;
  labels: QuoteDialogLabels;
  onQuoted: (amount: number, message: string | null) => void;
};

// ── Internal form schema (SEK whole units — we convert to öre on submit) ──────

function makeSchema(v: QuoteDialogLabels["validation"]) {
  return z.object({
    amountSek: z
      .string()
      .min(1, v.amountRequired)
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: v.amountPositive,
      })
      .refine((val) => Number.isInteger(Number(val)), {
        message: v.amountInteger,
      }),
    message: z.string().max(2000, v.messageMax).optional(),
  });
}

type FormValues = { amountSek: string; message?: string };

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {help && !error && <p className="text-xs text-muted-foreground">{help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/40 transition-shadow",
    hasError
      ? "border-destructive focus:ring-destructive/30"
      : "border-border focus:border-[color:var(--brand)]/50"
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SendQuoteDialog({
  quoteId,
  quotedAmount,
  quotedMessage,
  labels,
  onQuoted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = quotedAmount != null;

  const schema = makeSchema(labels.validation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Prefill with existing values when editing (öre → SEK)
      amountSek: quotedAmount != null ? String(quotedAmount / 100) : "",
      message: quotedMessage ?? "",
    },
  });

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset to current DB values when dialog is closed without submitting
      reset({
        amountSek: quotedAmount != null ? String(quotedAmount / 100) : "",
        message: quotedMessage ?? "",
      });
    }
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const client = await getClient();
        // Convert whole SEK → öre (multiply by 100)
        const quotedAmountOre = Math.round(Number(values.amountSek) * 100);
        const msg = values.message?.trim() || undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminApi = (client.api as any);
        const res = await adminApi.admin["quote-requests"][":id"].quote.$patch({
          param: { id: quoteId },
          json: { quotedAmount: quotedAmountOre, quotedMessage: msg },
        });

        if (!res.ok) {
          toast.error(labels.errorFailed);
          return;
        }

        setOpen(false);
        onQuoted(quotedAmountOre, msg ?? null);
        toast.success(isEdit ? labels.successUpdated : labels.successSent);
      } catch {
        toast.error(labels.errorFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-opacity",
            isEdit
              ? "border border-border bg-background text-foreground hover:bg-accent"
              : "bg-[color:var(--brand)] text-white hover:opacity-90"
          )}
        >
          {isEdit ? (
            <>
              <Pencil className="size-3" />
              {labels.editQuote}
            </>
          ) : (
            <>
              <SendHorizonal className="size-3" />
              {labels.sendQuote}
            </>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? labels.editTitle : labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2" noValidate>
          <Field
            label={labels.amountLabel}
            help={labels.amountHelp}
            error={errors.amountSek?.message}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                kr
              </span>
              <input
                {...register("amountSek")}
                type="number"
                min="1"
                step="1"
                placeholder={labels.amountPlaceholder}
                className={cn(inputCls(!!errors.amountSek), "pl-9")}
              />
            </div>
          </Field>

          <Field
            label={labels.messageLabel}
            error={errors.message?.message}
          >
            <textarea
              {...register("message")}
              rows={3}
              placeholder={labels.messagePlaceholder}
              className={cn(inputCls(!!errors.message), "resize-none")}
            />
          </Field>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? (
                labels.submitting
              ) : isEdit ? (
                labels.update
              ) : (
                labels.submit
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
