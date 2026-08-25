import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/layout";
import { ImageSlot, Tbc } from "@/components/site/image-slot";
import { whatsappLink } from "@/components/site/whatsapp";
import {
  BUSINESS,
  LOCATIONS,
  formatNaira,
  getCategory,
  getService,
  priceFor,
} from "@/lib/clinic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — St. Claire's Beauty Clinic" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.name} in Lagos — Price & Booking | St. Claire's`;
    const description = `${service.description} Book ${service.name.toLowerCase()} at St. Claire's Beauty Clinic, Ikeja Lagos. ${priceFor(service.price)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/services/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="text-4xl">Service not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please select a valid service from our menu.
        </p>
        <Link
          to="/services"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          View all services
        </Link>
      </div>
    </SiteLayout>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const category = getCategory(service.category);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-16">
        <Link to="/services" className="text-xs text-muted-foreground hover:text-foreground">
          ← All services
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_0.85fr]">
          <div>
            <p className="eyebrow">{category.shortName}</p>
            <h1 className="mt-3 text-4xl leading-tight md:text-6xl">{service.name}</h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              {service.description}
            </p>

            <div className="mt-8 rounded-3xl border border-border p-6">
              <h2 className="eyebrow">Pricing</h2>
              {service.price.kind === "per-location" ? (
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  {LOCATIONS.map((l) => (
                    <div key={l.id}>
                      <dt className="text-xs text-muted-foreground">{l.name}</dt>
                      <dd className="mt-1 text-2xl">
                        {formatNaira(
                          l.id === "ikeja"
                            ? service.price.kind === "per-location"
                              ? service.price.ikeja
                              : 0
                            : service.price.kind === "per-location"
                              ? service.price.lekki
                              : 0,
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-2xl">{priceFor(service.price)}</p>
              )}
              <p className="mt-5 text-xs text-muted-foreground">
                A {formatNaira(BUSINESS.bookingFee)} booking fee secures your slot and goes
                toward the total. Balance is paid at your appointment.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Duration: <Tbc />
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {service.bookable ? (
                <Link
                  to="/book"
                  search={{ service: service.slug }}
                  className="inline-flex justify-center rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground"
                >
                  Book this service
                </Link>
              ) : (
                <span className="rounded-full bg-secondary px-7 py-4 text-center text-sm text-muted-foreground">
                  Priced on assessment — message us to book
                </span>
              )}
              <a
                href={whatsappLink(
                  `Hello St. Claire's, I'd like to ask about ${service.name}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full border border-border px-7 py-4 text-sm"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ImageSlot label={`${service.name} — before`} />
            <ImageSlot label={`${service.name} — after`} />
            <ImageSlot label={`${service.name} — healed result`} className="col-span-2" ratio="aspect-[16/10]" />
          </div>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { h: "Who it's for", k: "suitability" },
            { h: "What to expect", k: "expect" },
            { h: "Preparation", k: "prep" },
          ].map((b) => (
            <div key={b.k} className="rounded-3xl bg-secondary p-7">
              <h2 className="text-xl">{b.h}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                This information must be supplied and professionally verified by the
                clinic before publication.
              </p>
              <p className="mt-3">
                <Tbc />
              </p>
            </div>
          ))}
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-3xl">Questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="fee">
              <AccordionTrigger>How do I secure my appointment?</AccordionTrigger>
              <AccordionContent>
                A {formatNaira(BUSINESS.bookingFee)} booking fee is transferred to our
                Providus account and the receipt sent to us on WhatsApp. Your appointment
                is confirmed once we verify the transfer. The fee is non-refundable and
                counts toward your service.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reschedule">
              <AccordionTrigger>Can I reschedule?</AccordionTrigger>
              <AccordionContent>
                We require 24 hours' notice to reschedule or cancel. If you don't show up,
                the booking fee is forfeited as a cancellation fee.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="aftercare">
              <AccordionTrigger>Aftercare</AccordionTrigger>
              <AccordionContent>
                Aftercare instructions are being finalised with the clinic and will be
                published here once verified. Your artist will take you through them at
                your appointment.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </SiteLayout>
  );
}
