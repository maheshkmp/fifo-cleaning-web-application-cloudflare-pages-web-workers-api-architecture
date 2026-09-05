import { setRequestLocale, getTranslations } from "next-intl/server";
import { requireAdmin } from "@/lib/auth-server";
import { getClient } from "@/lib/rpc/server";
import { AdminShell, type QuoteRow, type UserRow, type StatsRow } from "@/modules/admin/components/admin-shell";

type Props = {
  params: Promise<{ locale: string }>;
};

export const runtime = "edge";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  // ── Auth guard ─────────────────────────────────────────────────────────────
  const { user } = await requireAdmin();

  // ── Parallel data fetch ────────────────────────────────────────────────────
  const client = await getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = client.api as any;

  const [usersRes, quotesRes, statsRes] = await Promise.allSettled([
    api.admin.users.$get(),
    api.admin["quote-requests"].$get(),
    api.admin["quote-requests"].stats.$get(),
  ]);

  let allUsers: UserRow[] = [];
  let allQuotes: QuoteRow[] = [];
  let stats: StatsRow = { pendingCount: 0, thisWeekCount: 0 };

  if (usersRes.status === "fulfilled" && usersRes.value.ok) {
    allUsers = (await usersRes.value.json()) as unknown as UserRow[];
  } else {
    console.error("[admin] Failed to fetch users");
  }

  if (quotesRes.status === "fulfilled" && quotesRes.value.ok) {
    allQuotes = (await quotesRes.value.json()) as unknown as QuoteRow[];
  } else {
    console.error("[admin] Failed to fetch quotes");
  }

  if (statsRes.status === "fulfilled" && statsRes.value.ok) {
    stats = (await statsRes.value.json()) as unknown as StatsRow;
  } else {
    console.error("[admin] Failed to fetch stats");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">

      {/* Page header */}
      <div className="space-y-1 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Admin
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("signedInAs")} <span className="font-medium text-foreground">{user.email}</span>
        </p>
      </div>

      {/* Tabbed data tables (client component) */}
      <AdminShell users={allUsers} quotes={allQuotes} stats={stats} locale={locale} />
    </main>
  );
}
