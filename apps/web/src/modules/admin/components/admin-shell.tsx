"use client";

import { useState, useTransition, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusSelect } from "./status-select";
import { SendQuoteDialog } from "./send-quote-dialog";
import {
  QuoteFilterBar,
  type FilterState,
  type FilterBarLabels,
} from "./quote-filter-bar";
import { getClient } from "@/lib/rpc/client";

// ── Shared types ──────────────────────────────────────────────────────────────

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  banned: boolean | null;
};

export type QuoteRow = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  propertySizeSqft: number;
  message?: string | null;
  status: string;
  quotedAmount: number | null;
  quotedMessage: string | null;
  quotedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StatsRow = {
  pendingCount: number;
  thisWeekCount: number;
};

const SERVICE_LABELS: Record<string, string> = {
  house_cleaning: "House Cleaning",
  office_cleaning: "Office Cleaning",
  moving_cleaning: "Moving Cleaning",
  deep_cleaning: "Deep Cleaning",
};

const STATUS_BADGE: Record<string, string> = {
  pending:
    "text-amber-700 bg-amber-50 border-amber-200",
  quoted:
    "text-[color:var(--brand)] bg-[color:var(--brand-muted)] border-[color:var(--brand)]/30",
  closed: "text-gray-500 bg-gray-50 border-gray-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSEK(ore: number) {
  return (
    new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(ore / 100) + " SEK"
  );
}

// ── Stats row ─────────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: StatsRow }) {
  const t = useTranslations("admin");

  const cards = [
    {
      label: t("stats.pending"),
      value: t("stats.pendingRequests", { count: stats.pendingCount }),
      accent: true,
    },
    {
      label: t("stats.thisWeek"),
      value: t("stats.thisWeekRequests", { count: stats.thisWeekCount }),
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {card.label}
          </p>
          <p
            className={cn(
              "mt-1 text-xl font-bold",
              card.accent
                ? "text-[color:var(--brand)]"
                : "text-foreground"
            )}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Users table ───────────────────────────────────────────────────────────────

function UsersTable({ rows }: { rows: UserRow[] }) {
  const t = useTranslations("admin");

  if (rows.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {t("users.empty")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">Name</th>
            <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">Email</th>
            <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">Role</th>
            <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">Signed up</th>
            <th className="pb-3 font-medium text-muted-foreground text-right whitespace-nowrap">Banned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((u) => (
            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 font-medium text-foreground">{u.name}</td>
              <td className="py-3 text-muted-foreground">{u.email}</td>
              <td className="py-3">
                <span
                  className={cn(
                    "inline-block rounded border px-2 py-0.5 text-xs font-medium",
                    u.role === "admin"
                      ? "text-violet-700 bg-violet-50 border-violet-200"
                      : "text-gray-500 bg-gray-50 border-gray-200"
                  )}
                >
                  {u.role}
                </span>
              </td>
              <td className="py-3 text-muted-foreground tabular-nums">
                {formatDate(u.createdAt)}
              </td>
              <td className="py-3 text-right text-muted-foreground">
                {u.banned ? "Yes" : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-muted-foreground">
        {rows.length !== 1
          ? t("users.totalPlural", { count: rows.length })
          : t("users.total", { count: rows.length })}
      </p>
    </div>
  );
}

// ── Quotes table ──────────────────────────────────────────────────────────────

function QuotesTable({
  rows: initialRows,
  stats: initialStats,
  locale,
}: {
  rows: QuoteRow[];
  stats: StatsRow;
  locale: string;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [stats, setStats] = useState(initialStats);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    serviceType: "",
    sort: "date_desc",
  });
  const [isFetching, startFetch] = useTransition();

  const filterBarLabels: FilterBarLabels = {
    allStatuses: t("filters.allStatuses"),
    allServices: t("filters.allServices"),
    sortDateDesc: t("filters.sortDateDesc"),
    sortDateAsc: t("filters.sortDateAsc"),
    label: t("filters.label"),
    sortLabel: t("filters.sortLabel"),
  };

  const dialogLabels = {
    title: t("sendQuoteDialog.title"),
    editTitle: t("sendQuoteDialog.editTitle"),
    description: t("sendQuoteDialog.description"),
    amountLabel: t("sendQuoteDialog.amountLabel"),
    amountPlaceholder: t("sendQuoteDialog.amountPlaceholder"),
    amountHelp: t("sendQuoteDialog.amountHelp"),
    messageLabel: t("sendQuoteDialog.messageLabel"),
    messagePlaceholder: t("sendQuoteDialog.messagePlaceholder"),
    submit: t("sendQuoteDialog.submit"),
    update: t("sendQuoteDialog.update"),
    submitting: t("sendQuoteDialog.submitting"),
    cancel: t("sendQuoteDialog.cancel"),
    successSent: t("sendQuoteDialog.successSent"),
    successUpdated: t("sendQuoteDialog.successUpdated"),
    errorFailed: t("sendQuoteDialog.errorFailed"),
    validation: {
      amountRequired: t("sendQuoteDialog.validation.amountRequired"),
      amountPositive: t("sendQuoteDialog.validation.amountPositive"),
      amountInteger: t("sendQuoteDialog.validation.amountInteger"),
      messageMax: t("sendQuoteDialog.validation.messageMax"),
    },
    sendQuote: t("quotes.sendQuote"),
    editQuote: t("quotes.editQuote"),
  };

  // Re-fetch rows + stats when filters change
  const applyFilters = useCallback((next: FilterState) => {
    setFilters(next);
    startFetch(async () => {
      try {
        const client = await getClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const api = client.api as any;

        const params = new URLSearchParams();
        if (next.status) params.set("status", next.status);
        if (next.serviceType) params.set("serviceType", next.serviceType);
        params.set("sort", next.sort);

        const [quotesRes, statsRes] = await Promise.allSettled([
          api.admin["quote-requests"].$get({ query: Object.fromEntries(params) }),
          api.admin["quote-requests"].stats.$get(),
        ]);

        if (quotesRes.status === "fulfilled" && quotesRes.value.ok) {
          const data = await quotesRes.value.json();
          setRows(data as QuoteRow[]);
        }
        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          const data = await statsRes.value.json();
          setStats(data as StatsRow);
        }
      } catch {
        // silently ignore — stale data stays visible
      }
    });
  }, []);

  function handleStatusUpdate(id: string, newStatus: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  }

  function handleQuoted(id: string, amount: number, message: string | null) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, quotedAmount: amount, quotedMessage: message, status: "quoted" }
          : r
      )
    );
  }

  // Sortable date header
  const sortIcon =
    filters.sort === "date_desc" ? (
      <ArrowDown className="inline size-3 ml-1 text-[color:var(--brand)]" />
    ) : (
      <ArrowUp className="inline size-3 ml-1 text-[color:var(--brand)]" />
    );

  const isEmpty = rows.length === 0;
  const isFiltered =
    filters.status !== "" || filters.serviceType !== "";

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <StatsRow stats={stats} />

      {/* Filter bar */}
      <div className={cn("transition-opacity", isFetching && "opacity-50 pointer-events-none")}>
        <QuoteFilterBar
          filters={filters}
          labels={filterBarLabels}
          onChange={applyFilters}
        />
      </div>

      {/* Table */}
      {isEmpty ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {isFiltered ? t("quotes.emptyFiltered") : t("quotes.empty")}
        </p>
      ) : (
        <div className={cn("overflow-x-auto transition-opacity", isFetching && "opacity-60")}>
          <table className="w-full min-w-[720px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left">
                {/* Sortable date header */}
                <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">
                  <button
                    onClick={() =>
                      applyFilters({
                        ...filters,
                        sort: filters.sort === "date_desc" ? "date_asc" : "date_desc",
                      })
                    }
                    className="inline-flex items-center gap-0.5 hover:text-foreground transition-colors"
                  >
                    <ArrowUpDown className="size-3 mr-1" />
                    {t("quotes.cols.date")}
                    {sortIcon}
                  </button>
                </th>
                <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">{t("quotes.cols.requester")}</th>
                <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">{t("quotes.cols.service")}</th>
                <th className="pb-3 font-medium text-muted-foreground text-right pr-4 whitespace-nowrap">{t("quotes.cols.size")}</th>
                <th className="pb-3 font-medium text-muted-foreground whitespace-nowrap">{t("quotes.cols.quoted")}</th>
                <th className="pb-3 font-medium text-muted-foreground text-right whitespace-nowrap">{t("quotes.cols.status")}</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors align-top">
                  <td className="py-3 text-muted-foreground tabular-nums whitespace-nowrap pr-4">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-foreground">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.email}</p>
                  </td>
                  <td className="py-3 text-muted-foreground pr-4">
                    {SERVICE_LABELS[q.serviceType] ?? q.serviceType}
                  </td>
                  <td className="py-3 text-right pr-4 text-muted-foreground tabular-nums">
                    {q.propertySizeSqft.toLocaleString("en-SE")}
                  </td>

                  {/* Quote column */}
                  <td className="py-3 pr-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      {q.quotedAmount != null ? (
                        <>
                          <span className="inline-block rounded border border-[color:var(--brand)]/30 bg-[color:var(--brand-muted)] px-2 py-0.5 text-xs font-semibold text-[color:var(--brand)]">
                            {formatSEK(q.quotedAmount)}
                          </span>
                          {q.quotedAt && (
                            <span className="text-xs text-muted-foreground">
                              {t("quotes.quotedOn", { date: formatDate(q.quotedAt) })}
                            </span>
                          )}
                          {q.quotedMessage && (
                            <p
                              className="text-xs text-muted-foreground italic max-w-[160px] truncate"
                              title={q.quotedMessage}
                            >
                              &ldquo;{q.quotedMessage}&rdquo;
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {t("quotes.noQuoteYet")}
                        </span>
                      )}
                      <SendQuoteDialog
                        quoteId={q.id}
                        quotedAmount={q.quotedAmount}
                        quotedMessage={q.quotedMessage}
                        labels={dialogLabels}
                        onQuoted={(amount, message) =>
                          handleQuoted(q.id, amount, message)
                        }
                      />
                    </div>
                  </td>

                  {/* Status column */}
                  <td className="py-3 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={cn(
                          "inline-block rounded border px-2 py-0.5 text-xs font-medium",
                          STATUS_BADGE[q.status] ??
                            "text-gray-500 bg-gray-50 border-gray-200"
                        )}
                      >
                        {q.status}
                      </span>
                      <StatusSelect
                        quoteId={q.id}
                        currentStatus={q.status as "pending" | "quoted" | "closed"}
                        onUpdated={(s) => handleStatusUpdate(q.id, s)}
                      />
                    </div>
                  </td>

                  {/* Detail link */}
                  <td className="py-3 pl-2">
                    <a
                      href={`/${locale}/admin/quote-requests/${q.id}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[color:var(--brand)] transition-colors"
                      title={t("quotes.viewDetail")}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-foreground">
            {rows.length !== 1
              ? t("quotes.totalPlural", { count: rows.length })
              : t("quotes.total", { count: rows.length })}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Admin shell ───────────────────────────────────────────────────────────────

type Tab = "users" | "quotes";

type Props = {
  users: UserRow[];
  quotes: QuoteRow[];
  stats: StatsRow;
  locale: string;
};

export function AdminShell({ users, quotes, stats, locale }: Props) {
  const t = useTranslations("admin");
  const [tab, setTab] = useState<Tab>("quotes");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "quotes", label: t("tabs.quotes"), count: quotes.length },
    { id: "users", label: t("tabs.users"), count: users.length },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === tb.id
                ? "border-[color:var(--brand)] text-[color:var(--brand)]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tb.label}
            <span className="ml-2 text-xs text-muted-foreground">{tb.count}</span>
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTable rows={users} />}
      {tab === "quotes" && (
        <QuotesTable rows={quotes} stats={stats} locale={locale} />
      )}
    </div>
  );
}
