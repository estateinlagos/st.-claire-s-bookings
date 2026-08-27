import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ImageSlot, Tbc } from "@/components/site/image-slot";
import { LOCATIONS } from "@/lib/clinic";

const TITLE = "Locations — Beauty Clinic in Ikeja, Lagos | St. Claire's";
const DESCRIPTION =
  "Visit St. Claire's Beauty Clinic at 12 Amore Street, Off Toyin, Ikeja, Lagos. A second Lekki location is on the way.";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/locations" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Visit"
        title="Locations"
        intro="Pricing differs slightly between locations. Choose your location during booking to see the exact price."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-2">
        {LOCATIONS.map((l) => (
          <section key={l.id} className="rounded-3xl border border-border p-7">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl">{l.name}</h2>
              {!l.active && <Tbc>Not yet bookable online</Tbc>}
            </div>

            <ImageSlot
              label={`${l.name} studio`}
              ratio="aspect-[16/10]"
              className="mt-5"
            />

            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {l.address ?? "Exact address to be confirmed by the clinic."}
              </p>
              {l.phones.length > 0 ? (
                l.phones.map((p) => (
                  <p key={p} className="flex gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <a href={`tel:${p}`} className="hover:text-foreground">
                      {p}
                    </a>
                  </p>
                ))
              ) : (
                <p>
                  Phone: <Tbc />
                </p>
              )}
              <p>
                Opening hours: <Tbc />
              </p>
              <p>
                Google Maps link: <Tbc />
              </p>
            </div>

            {l.active && (
              <Link
                to="/book"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Book at {l.name}
              </Link>
            )}
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
