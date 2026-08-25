import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, MapPin, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/layout";
import { ImageSlot, Tbc } from "@/components/site/image-slot";
import { whatsappLink, GENERAL_ENQUIRY } from "@/components/site/whatsapp";
import {
  BUSINESS,
  CATEGORIES,
  LOCATIONS,
  SERVICES,
  formatNaira,
  priceFor,
  servicesByCategory,
} from "@/lib/clinic";

const TITLE = "St. Claire's Beauty Clinic — Microblading & Lash Studio in Ikeja, Lagos";
const DESCRIPTION =
  "Semi-permanent brows, lashes, lip blush and eyeliner in Ikeja, Lagos. Book online and secure your appointment with a ₦20,000 booking fee.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: BUSINESS.name,
          alternateName: BUSINESS.brandLine,
          telephone: BUSINESS.phones,
          sameAs: [BUSINESS.instagram],
          address: {
            "@type": "PostalAddress",
            streetAddress: "12 Amore Street, Off Toyin",
            addressLocality: "Ikeja",
            addressRegion: "Lagos",
            addressCountry: "NG",
          },
        }),
      },
    ],
  }),
  component: Home,
});

const FEATURED = ["spmu", "lashes", "lip-eyeliner", "brows-touch-up"] as const;

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-10 md:pt-16">
        <div className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">{BUSINESS.brandLine}</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.02] md:text-7xl">
              Brows, lashes and lips,
              <br />
              made to look like you.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              A semi-permanent makeup and lash studio in Ikeja, Lagos. Every set is
              mapped to your features, placed by hand, and finished to last.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book an Appointment
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href={whatsappLink(GENERAL_ENQUIRY)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-sm transition-colors hover:bg-secondary"
              >
                <MessageCircle className="size-4" aria-hidden />
                Chat on WhatsApp
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden />
              12 Amore Street, Off Toyin, Ikeja · Lekki coming soon
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ImageSlot label="Hero — brow result" ratio="aspect-[3/4]" className="col-span-1" />
            <div className="flex flex-col gap-3">
              <ImageSlot label="Lash close-up" ratio="aspect-square" />
              <ImageSlot label="Clinic interior" ratio="aspect-square" />
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs strip */}
      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
          {FEATURED.map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id)!;
            const count = servicesByCategory(id).length;
            return (
              <Link
                key={id}
                to="/services"
                hash={id}
                className="group font-display text-3xl text-muted-foreground transition-colors hover:text-foreground md:text-4xl"
              >
                {cat.shortName}
                <sup className="ml-1 font-sans text-[0.6rem] tracking-widest">{count}</sup>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.filter((s) =>
            [
              "spmu-microblading",
              "spmu-ombre",
              "spmu-combo",
              "lash-volume",
              "lip-both",
              "wing-eyeliner",
            ].includes(s.id),
          ).map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group rounded-3xl bg-secondary p-4 transition-colors hover:bg-accent"
            >
              <ImageSlot
                label={`${s.name} result`}
                ratio="aspect-[4/3]"
                className="border-border/60 bg-background"
              />
              <div className="flex items-end justify-between gap-3 px-1 pt-4">
                <div>
                  <p className="text-sm">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {priceFor(s.price)}
                  </p>
                </div>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Prices shown as Ikeja / Lekki where they differ.
        </p>
      </section>

      {/* Brand statement */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="max-w-2xl text-4xl leading-[1.08] md:text-5xl">
          Considered work,
          <br />
          not a house style.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Every appointment starts with mapping — your bone structure, your natural
            hair growth, the way you already wear your face. The shape is agreed
            before any pigment is placed.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            We work across microblading, ombre, combo and nano brows, lash extensions,
            lip blush and eyeliner, with touch-up pricing for returning clients and for
            work started elsewhere.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-[3rem]">
          <ImageSlot label="Clinic / treatment room" ratio="aspect-[16/9]" className="rounded-[3rem]" />
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl">Results</h2>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            See more on Instagram →
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Brows — before & after", "Lashes", "Lip blush", "Eyeliner"].map((label) => (
            <ImageSlot key={label} label={label} />
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-3xl md:text-4xl">Why clients choose St. Claire's</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Shape mapped to you",
              body: "Brow design is agreed with you before any pigment or blade touches the skin.",
            },
            {
              icon: ShieldCheck,
              title: "Clean, professional studio",
              body: "Single-use tools and a treatment space kept to clinic standards.",
            },
            {
              icon: Clock,
              title: "Care after the appointment",
              body: "Touch-up pricing for returning clients, plus colour correction when work needs rescuing.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl bg-secondary p-7">
              <Icon className="size-5" aria-hidden />
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-3xl md:text-4xl">Locations</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {LOCATIONS.map((l) => (
            <div key={l.id} className="rounded-3xl border border-border p-7">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl">{l.name}</h3>
                {!l.active && <Tbc>Opening details pending</Tbc>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {l.address ?? "Exact address to be confirmed by the clinic."}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Opening hours: <Tbc />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-3xl md:text-4xl">Client words</h2>
        <div className="mt-6 rounded-3xl border border-dashed border-border p-10 text-center">
          <Tbc>Testimonials awaiting the clinic's approval</Tbc>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Only reviews supplied and verified by St. Claire's will be published here.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="rounded-[2.5rem] bg-primary px-7 py-14 text-center text-primary-foreground md:px-16 md:py-20">
          <h2 className="text-4xl md:text-5xl">Ready when you are</h2>
          <p className="mx-auto mt-4 max-w-md text-sm opacity-80">
            Pick your service, choose a time, and secure it with the{" "}
            {formatNaira(BUSINESS.bookingFee)} booking fee. Confirmation comes through
            WhatsApp once your transfer is verified.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/book"
              className="rounded-full bg-background px-7 py-4 text-sm font-medium text-foreground"
            >
              Book an Appointment
            </Link>
            <a
              href={whatsappLink(GENERAL_ENQUIRY)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-primary-foreground/30 px-7 py-4 text-sm"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
