import Link from "next/link";
import { getTranslations } from "next-intl/server";

type Props = { locale: string };

export async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="size-2 rounded-full bg-[color:var(--brand)]" />
              <span className="font-bold text-lg text-foreground group-hover:text-[color:var(--brand)] transition-colors">
                Fifo Städfirma
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("tagline")}</p>
            <a
              href="tel:+46700000000"
              className="inline-block text-sm font-medium text-[color:var(--brand)] hover:underline underline-offset-4 transition-colors"
            >
              +46 70 000 00 00
            </a>
          </div>

          {/* Company links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              {t("company")}
            </p>
            <ul className="space-y-2">
              {[
                { label: nav("home"),     href: "/" },
                { label: nav("about"),    href: "/about" },
                { label: nav("services"), href: "/services" },
                { label: nav("contact"),  href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              {t("legal")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year })}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[color:var(--brand)]" />
            <p className="text-xs text-muted-foreground">{t("cities")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
