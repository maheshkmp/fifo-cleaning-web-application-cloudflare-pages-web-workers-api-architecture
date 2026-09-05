import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { WhyUsSection } from "@/components/sections/why-us";
import { HomeCtaSection } from "@/components/sections/home-cta";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSv = locale === "sv";
  const baseUrl = "https://www.fifostadfirma.se";

  return {
    title: isSv ? "Professionell Städfirma i Sverige" : "Professional Cleaning Services in Sweden",
    description: isSv
      ? "Fifo Städfirma erbjuder professionell städning för hem och kontor i Stockholm, Göteborg och Malmö."
      : "Fifo Städfirma — reliable home and office cleaning across Sweden. Free quotes, eco-friendly products, fully insured.",
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale}`,
      languages: { en: `${baseUrl}/`, sv: `${baseUrl}/sv` },
    },
    openGraph: {
      url: `${baseUrl}/${locale === "en" ? "" : locale}`,
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630, alt: "Fifo Städfirma" }],
    },
    twitter: {
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      {/* id="quote" lets the CTA anchor link scroll to the hero form */}
      <div id="quote">
        <HeroSection />
      </div>
      <ServicesPreview />
      <WhyUsSection />
      <HomeCtaSection />
    </main>
  );
}
