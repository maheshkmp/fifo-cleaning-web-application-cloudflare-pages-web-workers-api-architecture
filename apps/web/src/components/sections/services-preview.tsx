"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const SERVICE_KEYS = [
  { key: "house_cleaning",  icon: "🏠", href: "/services#house"  },
  { key: "office_cleaning", icon: "🏢", href: "/services#office" },
  { key: "moving_cleaning", icon: "📦", href: "/services#moving" },
  { key: "deep_cleaning",   icon: "✨", href: "/services#deep"   },
] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number]["key"];

export function ServicesPreview() {
  const t = useTranslations("servicesPreview");

  return (
    <section className="border-b border-border bg-[color:var(--brand-muted)]/30">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        {/* Section header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("headline")}
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-[color:var(--brand)] hover:underline underline-offset-4 shrink-0"
          >
            {t("viewAll")} →
          </Link>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICE_KEYS.map(({ key, icon, href }) => (
            <Link
              key={key}
              href={href}
              className="group block rounded-xl border border-border bg-card p-6 space-y-4 hover:border-[color:var(--brand)] hover:shadow-sm transition-all duration-200"
            >
              <div className="size-10 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-lg">
                {icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">
                  {t(`services.${key as ServiceKey}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`services.${key as ServiceKey}.description`)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--brand)] group-hover:gap-2 transition-all duration-150">
                {t("learnMore")} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
