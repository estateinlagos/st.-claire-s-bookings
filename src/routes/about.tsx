import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/layout";
import { ImageSlot, Tbc } from "@/components/site/image-slot";
import { BUSINESS } from "@/lib/clinic";

const TITLE = "About St. Claire's — Semi-Permanent Makeup Studio in Lagos";
const DESCRIPTION =
  "Flawless Reflections by St. Claire is a semi-permanent makeup and lash studio in Ikeja, Lagos, specialising in brows, lashes, lip blush and eyeliner.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow={BUSINESS.brandLine}
        title="A studio built around your features"
        intro="St. Claire's is a semi-permanent makeup and lash studio in Ikeja, Lagos. Brows, lashes, lip blush and eyeliner — shaped, mapped and placed by hand."
      />

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <ImageSlot label="Studio exterior" ratio="aspect-[4/5]" />
          <ImageSlot label="Treatment room" ratio="aspect-[4/5]" />
          <ImageSlot label="Artist at work" ratio="aspect-[4/5]" />
        </div>

        <section className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-3xl">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The founder's story and the studio's background will be published here once
              supplied by St. Claire's. We won't publish anything the clinic hasn't
              verified.
            </p>
            <p className="mt-4">
              <Tbc>Brand story awaiting the clinic</Tbc>
            </p>
          </div>
          <div>
            <h2 className="text-3xl">Our team</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Work is carried out by our head artist and senior artists, with pricing
              that reflects the artist level you book. Artist names, schedules and
              specialisms will be listed here once confirmed.
            </p>
            <p className="mt-4">
              <Tbc>Artist profiles awaiting the clinic</Tbc>
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">Our work</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {["Brows", "Lashes", "Lips", "Eyeliner"].map((l) => (
              <ImageSlot key={l} label={l} />
            ))}
          </div>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex text-sm underline"
          >
            Follow {BUSINESS.instagramHandle} on Instagram
          </a>
        </section>

        <div className="mt-16 rounded-3xl bg-secondary p-8 text-center">
          <h2 className="text-2xl">Book your appointment</h2>
          <Link
            to="/book"
            className="mt-5 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
