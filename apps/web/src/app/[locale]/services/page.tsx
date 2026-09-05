import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";

export const runtime = "edge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("headline"),
    description: t("intro").slice(0, 160),
  };
}

const SERVICE_KEYS = ["house", "office", "moving", "deep"] as const;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-16">

      {/* ── Header ── */}
      <section className="space-y-4 border-b border-border pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {t("headline")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t("intro")}
        </p>
      </section>

      {/* ── Service cards ── */}
      <div className="space-y-8">
        {SERVICE_KEYS.map((key) => {
          const includes = t.raw(`services.${key}.includes`) as string[];
          return (
            <section
              key={key}
              id={key}
              className="scroll-mt-24 rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-4 p-6 border-b border-border bg-[color:var(--brand-muted)]/30">
                <div className="size-12 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-2xl shrink-0">
                  {t(`services.${key}.icon`)}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {t(`services.${key}.title`)}
                  </h2>
                  <p className="text-sm text-[color:var(--brand)] font-medium">
                    {t(`services.${key}.tagline`)}
                  </p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`services.${key}.description`)}
                </p>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
                    {t("includedLabel")}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                        <div className="size-5 rounded-full bg-[color:var(--brand-muted)] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    {t(`services.${key}.note`)}
                  </p>
                  <Link
                    href="/#quote"
                    className="inline-block rounded-md bg-[color:var(--brand)] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    {t("getQuote")}
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Bottom CTA ── */}
      <section className="rounded-xl bg-[color:var(--brand-muted)]/40 border border-border p-8 text-center space-y-4">
        <p className="text-base font-medium text-foreground">{t("ctaTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("ctaSubtitle")}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/#quote"
            className="inline-block rounded-md bg-[color:var(--brand)] text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {t("ctaQuote")}
          </Link>
          <Link
            href="/contact"
            className="inline-block rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
          >
            {t("ctaContact")}
          </Link>
        </div>
      </section>
    </main>
  );
}
