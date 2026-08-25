import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { Tbc } from "@/components/site/image-slot";
import { CATEGORIES, priceFor, servicesByCategory } from "@/lib/clinic";

const TITLE = "Services & Prices — Microblading, Lashes & Lip Blush in Lagos";
const DESCRIPTION =
  "Full service menu and prices for St. Claire's Beauty Clinic: microblading, ombre and nano brows, touch-ups, lash extensions, lip blush and eyeliner in Ikeja and Lekki, Lagos.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Menu"
        title="Services & pricing"
        intro="Prices are shown as Ikeja / Lekki where they differ. Service durations are being confirmed by the clinic and will be published once verified."
      />

      <div className="mx-auto max-w-6xl px-5 pb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full border border-border px-4 py-2 text-xs transition-colors hover:bg-secondary"
            >
              {c.shortName}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-5">
        {CATEGORIES.map((cat) => {
          const items = servicesByCategory(cat.id);
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl">{cat.name}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{cat.blurb}</p>

              {cat.pending || items.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-border p-8">
                  <Tbc>Menu and pricing to be confirmed</Tbc>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Ask us on WhatsApp in the meantime and we'll advise on availability.
                  </p>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border">
                  {items.map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="flex items-center justify-between gap-4 bg-card px-5 py-5 transition-colors hover:bg-secondary md:px-7"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-base">{s.name}</p>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {s.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="text-right text-sm whitespace-nowrap">
                            {priceFor(s.price)}
                          </span>
                          <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-5">
        <div className="rounded-3xl bg-secondary p-8 text-center">
          <h2 className="text-2xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Send us a photo of your brows or lashes on WhatsApp and we'll recommend the
            right treatment before you book.
          </p>
          <Link
            to="/book"
            className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
