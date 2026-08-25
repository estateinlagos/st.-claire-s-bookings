import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin } from "lucide-react";
import { BUSINESS, LOCATIONS } from "@/lib/clinic";
import { Tbc } from "./image-slot";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">{BUSINESS.brandLine}</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Semi-permanent brows, lashes, lip blush and eyeliner in Lagos.
            Appointments are secured with a {"₦20,000"} booking fee.
          </p>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Instagram className="size-4" aria-hidden />
            {BUSINESS.instagramHandle}
          </a>
        </div>

        <div>
          <h2 className="eyebrow">Visit</h2>
          <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
            {LOCATIONS.map((l) => (
              <li key={l.id}>
                <p className="text-foreground">{l.name}</p>
                {l.address ? (
                  <p className="mt-1 flex gap-2">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                    {l.address}
                  </p>
                ) : (
                  <p className="mt-1">
                    <Tbc>Address to be confirmed</Tbc>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {BUSINESS.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p}`} className="inline-flex items-center gap-2 hover:text-foreground">
                  <Phone className="size-3.5" aria-hidden />
                  {p}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <Link to="/services" className="hover:text-foreground">
                Services & pricing
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-foreground">
                Book an appointment
              </Link>
            </li>
            <li>
              <Link to="/booking-status" className="hover:text-foreground">
                Check a booking
              </Link>
            </li>
            <li>
              <Link to="/policies" className="hover:text-foreground">
                Booking policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BUSINESS.brandLine}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
