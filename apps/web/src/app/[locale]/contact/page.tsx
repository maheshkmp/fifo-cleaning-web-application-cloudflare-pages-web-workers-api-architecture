import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ContactFormI18n } from "@/modules/contact/components/contact-form-i18n";

export const runtime = "edge";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("headline"),
    description: t("intro").slice(0, 160),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 space-y-14">

      {/* ── Header ── */}
      <section className="space-y-3 border-b border-border pb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {t("headline")}
        </h1>
        <p className="text-muted-foreground max-w-lg leading-relaxed">{t("intro")}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ── Contact info ── */}
        <section className="space-y-6">
          {/* Phone */}
          <div className="flex gap-4">
            <div className="size-10 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-lg shrink-0">📞</div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{t("phone.label")}</p>
              <a href="tel:+46700000000" className="block text-base font-semibold text-foreground hover:text-[color:var(--brand)] transition-colors">
                +46 70 000 00 00
              </a>
              <p className="text-xs text-muted-foreground">{t("phone.secondary")}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4">
            <div className="size-10 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-lg shrink-0">✉️</div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{t("email.label")}</p>
              <a href="mailto:support@fifostadfirma.se" className="block text-base font-semibold text-foreground hover:text-[color:var(--brand)] transition-colors">
                support@fifostadfirma.se
              </a>
              <p className="text-xs text-muted-foreground">{t("email.secondary")}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex gap-4">
            <div className="size-10 rounded-lg bg-[color:var(--brand-muted)] flex items-center justify-center text-lg shrink-0">📍</div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{t("address.label")}</p>
              <p className="text-base font-semibold text-foreground">{t("address.company")}</p>
              <p className="text-xs text-muted-foreground">{t("address.secondary")}</p>
            </div>
          </div>

          {/* Same-day notice */}
          <div className="mt-4 rounded-xl border border-[color:var(--brand-muted)] bg-[color:var(--brand-muted)]/40 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--brand)]" />
              <p className="text-sm font-semibold text-foreground">{t("sameDay.title")}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-4">{t("sameDay.body")}</p>
          </div>
        </section>

        {/* ── Form ── */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">{t("formTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("formSubtitle")}</p>
          </div>
          <ContactFormI18n
            labels={{
              name: t("form.name"),
              email: t("form.email"),
              message: t("form.message"),
              namePlaceholder: t("form.namePlaceholder"),
              emailPlaceholder: t("form.emailPlaceholder"),
              messagePlaceholder: t("form.messagePlaceholder"),
              submit: t("form.submit"),
              submitting: t("form.submitting"),
              successTitle: t("form.successTitle"),
              successBody: t("form.successBody"),
            }}
            validation={{
              nameRequired: t("validation.nameRequired"),
              emailRequired: t("validation.emailRequired"),
              messageMin: t("validation.messageMin"),
            }}
          />
        </section>
      </div>
    </main>
  );
}
