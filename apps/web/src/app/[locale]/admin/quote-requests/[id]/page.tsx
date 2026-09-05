import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth-server";
import { getClient } from "@/lib/rpc/server";
import { StatusSelect } from "@/modules/admin/components/status-select";
import { SendQuoteDialog } from "@/modules/admin/components/send-quote-dialog";
import { cn } from "@/lib/utils";
import type { QuoteDialogLabels } from "@/modules/admin/components/send-quote-dialog";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("detail.title") };
}

const SERVICE_LABELS: Record<string, string> = {
  house_cleaning: "House Cleaning",
  office_cleaning: "Office Cleaning",
  moving_cleaning: "Moving Cleaning",
  deep_cleaning: "Deep Cleaning",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  quoted:
    "text-[color:var(--brand)] bg-[color:var(--brand-muted)] border-[color:var(--brand)]/30",
  closed: "text-gray-500 bg-gray-50 border-gray-200",
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "sv" ? "sv-SE" : "en-SE", {
    year: "numeric",
    month: "long",
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function LabelValue({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

export default async function QuoteDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  await requireAdmin();

  const client = await getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = client.api as any;
  const res = await api.admin["quote-requests"][":id"].$get({ param: { id } });

  if (!res.ok) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-muted-foreground">{t("detail.notFound")}</p>
      </main>
    );
  }

  const q = (await res.json()) as {
    id: string;
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    propertySizeSqft: number;
    message: string | null;
    status: string;
    quotedAmount: number | null;
    quotedMessage: string | null;
    quotedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };

  const dialogLabels: QuoteDialogLabels = {
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">

      {/* Back link + heading */}
      <div className="space-y-3">
        <a
          href={`${locale === "sv" ? "/sv" : ""}/admin`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[color:var(--brand)] transition-colors"
        >
          {t("detail.back")}
        </a>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
            Admin
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("detail.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("detail.requestedOn", { date: formatDate(q.createdAt, locale) })}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Requester */}
        <Section title={t("detail.requesterInfo")}>
          <LabelValue label="Name">{q.name}</LabelValue>
          <LabelValue label="Email">
            <a
              href={`mailto:${q.email}`}
              className="text-[color:var(--brand)] hover:underline"
            >
              {q.email}
            </a>
          </LabelValue>
          {q.phone && (
            <LabelValue label="Phone">
              <a
                href={`tel:${q.phone}`}
                className="text-[color:var(--brand)] hover:underline"
              >
                {q.phone}
              </a>
            </LabelValue>
          )}
        </Section>

        {/* Service details */}
        <Section title={t("detail.serviceInfo")}>
          <LabelValue label={t("quotes.cols.service")}>
            {SERVICE_LABELS[q.serviceType] ?? q.serviceType}
          </LabelValue>
          <LabelValue label={t("detail.propertySize")}>
            {t("detail.sqft", { size: q.propertySizeSqft.toLocaleString("en-SE") })}
          </LabelValue>
        </Section>

        {/* Customer message — full width */}
        <div className="sm:col-span-2">
          <Section title={t("detail.customerMessage")}>
            {q.message ? (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {q.message}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t("detail.noMessage")}
              </p>
            )}
          </Section>
        </div>

        {/* Status — with inline StatusSelect for live change */}
        <Section title={t("detail.statusSection")}>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={cn(
                "inline-block rounded border px-2 py-0.5 text-xs font-medium",
                STATUS_BADGE[q.status] ?? "text-gray-500 bg-gray-50 border-gray-200"
              )}
            >
              {q.status}
            </span>
            <StatusSelect
              quoteId={q.id}
              currentStatus={q.status as "pending" | "quoted" | "closed"}
              onUpdated={() => {}}
            />
          </div>
        </Section>

        {/* Quote details */}
        <Section title={t("detail.quoteSection")}>
          {q.quotedAmount != null ? (
            <div className="space-y-2">
              <LabelValue label={t("quotes.quotedAmount")}>
                <span className="text-[color:var(--brand)] font-semibold">
                  {formatSEK(q.quotedAmount)}
                </span>
              </LabelValue>
              {q.quotedAt && (
                <LabelValue label={t("detail.quotedOn", { date: "" })}>
                  {formatDate(q.quotedAt, locale)}
                </LabelValue>
              )}
              {q.quotedMessage && (
                <LabelValue label={t("sendQuoteDialog.messageLabel")}>
                  <span className="whitespace-pre-wrap">{q.quotedMessage}</span>
                </LabelValue>
              )}
              <div className="pt-1">
                <SendQuoteDialog
                  quoteId={q.id}
                  quotedAmount={q.quotedAmount}
                  quotedMessage={q.quotedMessage}
                  labels={dialogLabels}
                  onQuoted={() => {}}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground italic">
                {t("detail.notQuotedYet")}
              </p>
              <SendQuoteDialog
                quoteId={q.id}
                quotedAmount={null}
                quotedMessage={null}
                labels={dialogLabels}
                onQuoted={() => {}}
              />
            </div>
          )}
        </Section>

      </div>
    </main>
  );
}
