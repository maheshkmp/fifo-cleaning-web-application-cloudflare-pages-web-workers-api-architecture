import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 'as-needed': the default locale (en) has no URL prefix,
  // so / and /en both serve English. /sv/... always has the prefix.
  localePrefix: "as-needed",
});
