"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";

type Status = "pending" | "quoted" | "closed";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "quoted",  label: "Quoted"  },
  { value: "closed",  label: "Closed"  },
];

type Props = {
  quoteId: string;
  currentStatus: Status;
  onUpdated: (newStatus: Status) => void;
};

export function StatusSelect({ quoteId, currentStatus, onUpdated }: Props) {
  const [value, setValue] = useState<Status>(currentStatus);
  const [isPending, startTransition] = useTransition();

  async function handleChange(next: Status) {
    if (next === value) return;
    const prev = value;
    setValue(next); // optimistic

    startTransition(async () => {
      try {
        const client = await getClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adminApi = (client.api as any);
        const res = await adminApi.admin["quote-requests"][":id"].status.$patch({
          param: { id: quoteId },
          json: { status: next },
        });

        if (!res.ok) {
          setValue(prev); // rollback
          toast.error("Failed to update status");
          return;
        }

        onUpdated(next);
        toast.success(`Status updated to "${next}"`);
      } catch {
        setValue(prev);
        toast.error("Network error — could not update status");
      }
    });
  }

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as Status)}
      className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-opacity"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
