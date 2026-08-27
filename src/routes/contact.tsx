import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { Tbc } from "@/components/site/image-slot";
import { GENERAL_ENQUIRY, whatsappLink } from "@/components/site/whatsapp";
import { BUSINESS, LOCATIONS } from "@/lib/clinic";

const TITLE = "Contact St. Claire's Beauty Clinic — Ikeja, Lagos";
const DESCRIPTION =
  "Reach St. Claire's Beauty Clinic on WhatsApp or by phone, or visit us at 12 Amore Street, Off Toyin, Ikeja, Lagos.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        intro="WhatsApp is the fastest way to reach the studio — send a photo of your brows or lashes and we'll advise on the right service."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        <section className="rounded-3xl bg-secondary p-8">
          <h2 className="text-2xl">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enquiries, service advice and payment receipts.
          </p>
          <a
            href={whatsappLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-medium text-whatsapp-foreground"
          >
            <MessageCircle className="size-4" aria-hidden />
            Chat on WhatsApp
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Preferred WhatsApp business line: <Tbc />
          </p>
        </section>

        <section className="rounded-3xl border border-border p-8">
          <h2 className="text-2xl">Call</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {BUSINESS.phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p}`}
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Phone className="size-4" aria-hidden />
                  {p}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            Opening hours: <Tbc />
          </p>
        </section>

        <section className="rounded-3xl border border-border p-8">
          <h2 className="text-2xl">Visit</h2>
          <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
            {LOCATIONS.map((l) => (
              <li key={l.id}>
                <p className="text-foreground">{l.name}</p>
                <p className="mt-1 flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {l.address ?? "Address to be confirmed."}
                </p>
              </li>
            ))}
          </ul>
          <Link to="/locations" className="mt-5 inline-flex text-sm underline">
            Location details
          </Link>
        </section>

        <section className="rounded-3xl border border-border p-8">
          <h2 className="text-2xl">Follow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Recent work, availability updates and offers.
          </p>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm"
          >
            <Instagram className="size-4" aria-hidden />
            {BUSINESS.instagramHandle}
          </a>
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-5">
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-3xl">Ready to book?</h2>
          <Link
            to="/book"
            className="mt-6 inline-flex rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
