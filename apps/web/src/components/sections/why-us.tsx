"use client";

import { useTranslations } from "next-intl";

const REASON_KEYS = [
  { key: "experience", icon: "🏆" },
  { key: "insured",    icon: "🛡" },
  { key: "satisfaction", icon: "✅" },
  { key: "eco",        icon: "🌿" },
  { key: "pricing",    icon: "💬" },
  { key: "scheduling", icon: "📅" },
] as const;

const TESTIMONIAL_KEYS = ["erik", "sara", "maria"] as const;

type ReasonKey      = (typeof REASON_KEYS)[number]["key"];
type TestimonialKey = (typeof TESTIMONIAL_KEYS)[number];

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <>
      {/* Why choose us */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <div className="mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("headline")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {REASON_KEYS.map(({ key, icon }) => (
              <div key={key} className="flex gap-4">
                <div className="size-10 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-lg shrink-0 mt-0.5">
                  {icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t(`reasons.${key as ReasonKey}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`reasons.${key as ReasonKey}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border bg-[color:var(--brand-muted)]/20">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
          <div className="mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              {t("testimonialsEyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("testimonialsHeadline")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIAL_KEYS.map((key) => {
              const initial = t(`testimonials.${key as TestimonialKey}.author`).charAt(0);
              return (
                <blockquote
                  key={key}
                  className="rounded-xl border border-border bg-card p-6 space-y-5"
                >
                  <span className="text-3xl leading-none text-[color:var(--brand)] font-serif select-none">
                    &ldquo;
                  </span>
                  <p className="text-sm text-foreground leading-relaxed -mt-2">
                    {t(`testimonials.${key as TestimonialKey}.quote`)}
                  </p>
                  <footer className="flex items-center gap-3 pt-2 border-t border-border">
                    <div className="size-8 rounded-full bg-[color:var(--brand)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(`testimonials.${key as TestimonialKey}.author`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`testimonials.${key as TestimonialKey}.role`)}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
