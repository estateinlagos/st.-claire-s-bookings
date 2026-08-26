import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { Tbc } from "@/components/site/image-slot";
import { BUSINESS, formatNaira } from "@/lib/clinic";

const TITLE = "Booking, Cancellation & Payment Policy — St. Claire's Beauty Clinic";
const DESCRIPTION =
  "How the ₦20,000 booking fee, rescheduling, cancellations and no-shows work at St. Claire's Beauty Clinic, Lagos.";

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/policies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/policies" }],
  }),
  component: PoliciesPage,
});

function PoliciesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Policies"
        title="Booking & cancellation"
        intro="Please read before you book. These terms apply to every appointment."
      />

      <div className="mx-auto max-w-3xl space-y-6 px-5 pb-10">
        <Card title={`${formatNaira(BUSINESS.bookingFee)} booking fee`}>
          <p>
            A {formatNaira(BUSINESS.bookingFee)} booking fee is required to secure your
            preferred time slot. It forms part payment toward the total cost of your
            service and is <strong>strictly non-refundable</strong>.
          </p>
          <p className="mt-3">
            Payment is by bank transfer only:
            <br />
            {BUSINESS.bank.accountName} · {BUSINESS.bank.bankName} ·{" "}
            {BUSINESS.bank.accountNumber}
          </p>
        </Card>

        <Card title="Confirmation">
          <p>
            Completing the booking form does not confirm your appointment. Your slot is
            held temporarily until you send your transfer receipt on WhatsApp and we
            verify it. Once verified, we confirm your appointment on WhatsApp.
          </p>
        </Card>

        <Card title="Rescheduling & cancellation">
          <p>24 hours' notice is required to reschedule or cancel an appointment.</p>
          <p className="mt-3">
            How the booking fee is treated when 24+ hours' notice is given:{" "}
            <Tbc>Awaiting the clinic's final confirmation</Tbc>
          </p>
        </Card>

        <Card title="No-shows">
          <p>
            If you do not show up for your appointment, the{" "}
            {formatNaira(BUSINESS.bookingFee)} booking fee is forfeited as a cancellation
            fee.
          </p>
        </Card>

        <Card title="Preparation, aftercare & eligibility">
          <p>
            Semi-permanent makeup preparation, aftercare and eligibility information must
            be supplied and professionally verified by the clinic before publication.
          </p>
          <p className="mt-3">
            <Tbc />
          </p>
        </Card>

        <div className="rounded-3xl bg-secondary p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Questions about a policy? Ask before you book.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
          >
            Contact us
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border p-7">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
