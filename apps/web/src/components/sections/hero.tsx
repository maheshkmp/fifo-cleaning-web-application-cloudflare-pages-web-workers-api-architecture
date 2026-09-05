"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";
import { QuoteForm } from "@/modules/quote";

export function HeroSection() {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");
  const router = useRouter();

  function handleAuthRequired() {
    router.push("/signin?redirect=/");
  }

  return (
    <section className="relative border-b border-border">
      {/* ── Parallax background image ── */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage: "url('/og.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute inset-0 -z-20"
      />
      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-background/82" />

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 min-h-[100svh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT */}
          <div className="space-y-7 lg:pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-muted)] bg-[color:var(--brand-muted)]/80 backdrop-blur-sm px-3 py-1">
              <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
              <span className="text-xs font-semibold tracking-widest text-[color:var(--brand)] uppercase">
                {t("eyebrow")}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-[1.08] max-w-lg">
                {t("headline")}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md">
                {t("subheadline")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {(["insured", "freeQuotes", "sameDay", "eco"] as const).map((key) => (
                <div key={key} className="flex items-center gap-2.5">
                  <div className="size-5 rounded-full bg-[color:var(--brand-muted)] flex items-center justify-center shrink-0">
                    <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t(`trust.${key}`)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground mb-1">{tNav("callUs")}</p>
              <a href="tel:+46700000000" className="text-xl font-bold text-foreground hover:text-[color:var(--brand)] transition-colors">
                +46 70 000 00 00
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{t("quoteTitle")}</h2>
              <p className="text-sm text-muted-foreground">{t("quoteSubtitle")}</p>
            </div>
            <QuoteForm onAuthRequired={handleAuthRequired} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-[10px] uppercase tracking-widest text-foreground">{t("scroll")}</span>
        <div className="w-px h-8 bg-foreground/40 animate-pulse" />
      </div>
    </section>
  );
}
