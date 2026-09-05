import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-server";
import { getClient } from "@/lib/rpc/server";

export const runtime = "edge";

type Props = {
  params: Promise<{ locale: string }>;
};

// Human-readable service labels
const SERVICE_LABELS: Record<string, string> = {
  house_cleaning:  "House Cleaning",
  office_cleaning: "Office Cleaning",
  moving_cleaning: "Moving Cleaning",
  deep_cleaning:   "Deep Cleaning",
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending",  cls: "text-amber-700 bg-amber-50 border-amber-200" },
  quoted:  { label: "Quoted",   cls: "text-blue-700  bg-blue-50  border-blue-200"  },
  closed:  { label: "Closed",   cls: "text-gray-500  bg-gray-50  border-gray-200"  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-SE", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // ── Auth gate (redirects to /signin if no session) ────────────────────────
  const { user } = await requireAuth();

  // ── Fetch the user's own quote requests server-side ───────────────────────
  let quotes: {
    id: string;
    serviceType: string;
    propertySizeSqft: number;
    status: string;
    createdAt: string;
  }[] = [];

  try {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (client.api as any)["quote-requests"].mine.$get();

    if (res.ok) {
      quotes = await res.json();
    } else {
      console.error("[dashboard] Failed to fetch quotes:", res.status);
    }
  } catch (err) {
    console.error("[dashboard] RPC error:", err);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 space-y-8">

      {/* Page header */}
      <div className="space-y-1 border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Quote Requests
        </h1>
      </div>

      {quotes.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="rounded-lg border border-border bg-card px-8 py-16 text-center space-y-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            No requests yet
          </p>
          <p className="text-base text-foreground">
            You haven&apos;t requested a quote yet.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Fill in the short form on the homepage and we&apos;ll get back to you within 1–2 business days.
          </p>
          <Link
            href="/#quote"
            className="inline-block mt-2 rounded-md bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            Request a Free Quote
          </Link>
        </div>
      ) : (
        /* ── Requests table ───────────────────────────────────────────────── */
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground w-32">Date</th>
                <th className="pb-3 font-medium text-muted-foreground">Service</th>
                <th className="pb-3 font-medium text-muted-foreground text-right pr-4">
                  Size (sq ft)
                </th>
                <th className="pb-3 font-medium text-muted-foreground text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((q) => {
                const status = STATUS_STYLES[q.status] ?? {
                  label: q.status,
                  cls: "text-gray-500 bg-gray-50 border-gray-200",
                };
                return (
                  <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 text-muted-foreground tabular-nums">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="py-3.5 font-medium text-foreground">
                      {SERVICE_LABELS[q.serviceType] ?? q.serviceType}
                    </td>
                    <td className="py-3.5 text-right pr-4 text-muted-foreground tabular-nums">
                      {q.propertySizeSqft.toLocaleString("en-SE")}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Sub-footer */}
          <p className="mt-6 text-xs text-muted-foreground">
            {quotes.length} request{quotes.length !== 1 ? "s" : ""} total ·{" "}
            <Link href="/#quote" className="underline underline-offset-2 hover:text-foreground">
              Submit another
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}
