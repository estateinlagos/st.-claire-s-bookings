import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/clinic";
import { whatsappLink, GENERAL_ENQUIRY } from "./whatsapp";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/locations", label: "Locations" },
  { to: "/about", label: "About" },
  { to: "/policies", label: "Policies" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-xl tracking-tight">St. Claire's</span>
          <span className="text-[0.6rem] tracking-[0.24em] text-muted-foreground uppercase">
            Beauty Clinic
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={whatsappLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
          <Link
            to="/book"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book an Appointment
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3.5 text-base"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 py-4">
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Book an Appointment
              </Link>
              <a
                href={whatsappLink(GENERAL_ENQUIRY)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-5 py-3 text-center text-sm"
              >
                Chat on WhatsApp · {BUSINESS.phones[0]}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
