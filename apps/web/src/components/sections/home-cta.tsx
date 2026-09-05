"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function HomeCtaSection() {
  const t = useTranslations("homeCta");

  return (
    <section className="border-b border-border bg-[color:var(--brand)]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t("headline")}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {t("body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="#quote"
              className="inline-block rounded-md bg-white text-[color:var(--brand)] px-7 py-3 text-sm font-bold hover:bg-white/90 transition-colors"
            >
              {t("quoteBtn")}
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-md border border-white/40 text-white px-7 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {t("contactBtn")}
            </Link>
          </div>
          <p className="text-sm text-white/70 pt-1">
            {t("callUs")}{" "}
            <a
              href="tel:+46700000000"
              className="font-bold text-white hover:underline underline-offset-2"
            >
              +46 70 000 00 00
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
