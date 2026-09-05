import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Fifo Städfirma.",
  robots: { index: false, follow: false },
};

export const runtime = "edge";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-10">
      <div className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: [date placeholder]
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">1. Who we are</h2>
          <p>
            Fifo Städfirma AB (&ldquo;Fifo&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is registered in Sweden.
            Our registered address is [address placeholder]. We are responsible for the personal data we collect
            through this website and in connection with our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">2. What data we collect</h2>
          <p>
            We collect data you provide directly — name, email address, phone number, property details, and any
            messages you send us through the quote request or contact form. We also collect standard server logs
            (IP address, browser type, pages visited) for security and analytics purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">3. How we use it</h2>
          <p>
            We use your data to respond to enquiries, deliver our cleaning services, send booking confirmations,
            and improve our website. We do not sell your data to third parties. We may share it with service
            providers (e.g. email delivery, payment processing) strictly for delivering our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">4. Legal basis (GDPR)</h2>
          <p>
            We process your personal data on the basis of contract (to fulfil a booking), legitimate interest
            (to respond to enquiries), and consent where required. You may withdraw consent at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">5. Retention</h2>
          <p>
            We retain personal data for as long as necessary to deliver our services and meet legal obligations.
            Booking records are kept for seven years in accordance with Swedish accounting law. Contact enquiries
            are deleted after 12 months.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">6. Your rights</h2>
          <p>
            Under GDPR you have the right to access, correct, delete, or export your personal data. You also
            have the right to object to processing and to lodge a complaint with the Swedish Authority for
            Privacy Protection (IMY). To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:support@fifostadfirma.se"
              className="text-foreground underline underline-offset-2"
            >
              support@fifostadfirma.se
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">7. Cookies</h2>
          <p>
            We use session cookies required for authentication and security. We do not use advertising or
            tracking cookies. [Further cookie details placeholder]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">8. Changes</h2>
          <p>
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above reflects the
            most recent revision. Continued use of our services after changes constitutes acceptance.
          </p>
        </section>

        <p className="border-t border-border pt-6 text-xs">
          Questions? Email{" "}
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
