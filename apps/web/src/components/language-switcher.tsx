"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Language switcher — plain text toggle (EN | SV).
 * No flags, no heavy chrome. Preserves the current path when switching.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // locale-independent path from next-intl
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    if (next === locale) return;
    startTransition(() => {
      // next-intl's router.replace accepts { locale } and handles
      // prefix building automatically based on the routing config
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className="flex items-center gap-1 text-sm font-medium select-none"
      role="navigation"
      aria-label="Language switcher"
    >
      {routing.locales.map((l, idx) => (
        <span key={l} className="flex items-center gap-1">
          {idx > 0 && (
            <span className="text-muted-foreground/40 text-xs" aria-hidden>
              |
            </span>
          )}
          <button
            onClick={() => switchLocale(l)}
            disabled={isPending}
            aria-current={locale === l ? "true" : undefined}
            className={`
              px-1 py-0.5 rounded transition-colors duration-150
              ${
                locale === l
                  ? "text-foreground font-semibold cursor-default"
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              }
              ${isPending ? "opacity-50" : ""}
            `}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
