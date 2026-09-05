import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";

export const runtime = "edge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: locale === "sv" ? "Om oss" : "About Us",
    description: t("intro").slice(0, 160),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const VALUES = ["reliability", "transparency", "thoroughness", "respect"] as const;
  const FACTS = ["years", "cleans", "satisfaction", "cities"] as const;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-16">

      {/* ── Hero ── */}
      <section className="space-y-5 border-b border-border pb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {t("headline")}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {t("intro")}
        </p>
      </section>

      {/* ── Numbers ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-xl border border-border bg-[color:var(--brand-muted)]/40 p-8">
        {FACTS.map((key) => (
          <div key={key} className="space-y-1 text-center">
            <p className="text-3xl font-bold text-[color:var(--brand)]">{t(`facts.${key}.number`)}</p>
            <p className="text-sm text-muted-foreground">{t(`facts.${key}.label`)}</p>
          </div>
        ))}
      </section>

      {/* ── Story + Mission ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-border pb-14">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
            {t("storyEyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("storyTitle")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("storyBody1")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("storyBody2")}</p>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
            {t("missionEyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("missionTitle")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("missionBody1")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("missionBody2")}</p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="space-y-8 border-b border-border pb-14">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
            {t("valuesEyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("valuesTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((key) => (
            <div key={key} className="flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-[color:var(--brand)]/30 transition-colors">
              <div className="size-6 rounded-full bg-[color:var(--brand-muted)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="size-2 rounded-full bg-[color:var(--brand)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">{t(`values.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`values.${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rounded-xl bg-[color:var(--brand)] p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">{t("ctaTitle")}</h2>
        <p className="text-sm text-white/80">{t("ctaSubtitle")}</p>
        <Link
          href="/#quote"
          className="inline-block rounded-md bg-white text-[color:var(--brand)] px-6 py-3 text-sm font-bold hover:bg-white/90 transition-colors"
        >
          {t("ctaButton")}
        </Link>
      </section>
    </main>
  );
}
