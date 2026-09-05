import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Fifo Städfirma.",
  robots: { index: false, follow: false },
};

export const runtime = "edge";

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-10">
      <div className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: [date placeholder]
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">1. Introduction</h2>
          <p>
            These terms govern your use of the Fifo Städfirma website at fifostadfirma.se and any services
            you purchase from us. By using our site or booking a service you agree to these terms. If you do
            not agree, please do not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">2. Our services</h2>
          <p>
            Fifo Städfirma provides residential and commercial cleaning services including house cleaning,
            office cleaning, moving cleaning, and deep cleaning. Service availability is subject to location
            and scheduling. We reserve the right to decline bookings at our discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">3. Quotes and pricing</h2>
          <p>
            All prices are quoted before work begins. A quote is valid for 30 days from the date of issue.
            Final pricing may be adjusted if the actual scope of work differs materially from what was
            described. We will notify you before proceeding with any additional charges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">4. Cancellation and rescheduling</h2>
          <p>
            You may cancel or reschedule a booking up to 24 hours before the scheduled start time at no
            charge. Cancellations made with less than 24 hours&apos; notice may incur a cancellation fee of
            up to 50% of the booked service value. [Further cancellation policy placeholder]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">5. Satisfaction guarantee</h2>
          <p>
            If you are not satisfied with the result, please notify us within 24 hours of the service
            completion. We will return to remedy the issue at no additional charge. The guarantee does not
            apply to damage caused by pre-existing conditions or customer-supplied materials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">6. Liability</h2>
          <p>
            We carry full public liability insurance. Our liability for any single incident is limited to the
            value of the service purchased. We are not liable for indirect or consequential losses. [Full
            liability terms placeholder]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">7. Governing law</h2>
          <p>
            These terms are governed by Swedish law. Any disputes shall be referred to the Swedish courts.
            Consumers may also use the EU Online Dispute Resolution platform at ec.europa.eu/consumers/odr.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">8. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Updated terms will be posted on this page with a
            revised date. Continued use of our services after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <p className="border-t border-border pt-6 text-xs">
          Questions about these terms? Contact us at{" "}
          <a
            href="mailto:support@fifostadfirma.se"
            className="text-foreground underline underline-offset-2"
          >
            support@fifostadfirma.se
          </a>
        </p>
      </div>
    </main>
  );
}
