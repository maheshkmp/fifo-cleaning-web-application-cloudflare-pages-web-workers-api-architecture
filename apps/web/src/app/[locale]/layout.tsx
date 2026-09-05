import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  fontHeading, fontSans,
  fontInstrumentSerif, fontDmSans,
  fontDancingScript, fontPacifico, fontGreatVibes, fontSatisfy,
  fontSacramento, fontCaveat, fontAllura, fontPinyonScript, fontAlexBrush
} from "@/lib/fonts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: {
    default: "Fifo Städfirma",
    template: "%s | Fifo Städfirma",
  },
  description: "Professional cleaning services for homes and offices in Sweden.",
  keywords: ["cleaning", "städning", "Sweden", "Stockholm", "Fifo"],
  authors: [{ name: "Fifo Städfirma" }],
  creator: "Fifo Städfirma",
  publisher: "Fifo Städfirma",
  openGraph: {
    type: "website",
    siteName: "Fifo Städfirma",
    title: "Fifo Städfirma",
    description: "Professional cleaning services for homes and offices in Sweden.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fifo Städfirma",
    description: "Professional cleaning services for homes and offices in Sweden.",
    images: [],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
};

// Generate static params for all supported locales (enables static rendering)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "en" | "sv")) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${fontHeading.variable} ${fontSans.variable} ${fontInstrumentSerif.variable} ${fontDmSans.variable} ${fontDancingScript.variable} ${fontPacifico.variable} ${fontGreatVibes.variable} ${fontSatisfy.variable} ${fontSacramento.variable} ${fontCaveat.variable} ${fontAllura.variable} ${fontPinyonScript.variable} ${fontAlexBrush.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer locale={locale} />
          <Toaster richColors position="top-center" duration={4000} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
