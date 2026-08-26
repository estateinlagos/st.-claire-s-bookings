import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/layout";
import { paymentProofMessage, whatsappLink } from "@/components/site/whatsapp";
import { lookupBooking } from "@/lib/booking.functions";
import { ERRORS, type Booking } from "@/lib/booking-types";
import { formatNaira } from "@/lib/clinic";

const TITLE = "Check Your Booking — St. Claire's Beauty Clinic";
const DESCRIPTION =
  "Enter your St. Claire's booking reference to see whether your appointment is awaiting payment verification or confirmed.";

export const Route = createFileRoute("/booking-status")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/booking-status" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/booking-status" }],
  }),
  component: BookingStatusPage,
});

function statusCopy(b: Booking) {
  if (b.bookingStatus === "CONFIRMED" || b.paymentStatus === "VERIFIED")
    return { tone: "good", text: ERRORS.confirmed };
  if (b.bookingStatus === "EXPIRED")
    return {
      tone: "bad",
      text: "This hold expired and the slot has been released. Please book again.",
    };
  if (b.bookingStatus === "CANCELLED")
    return { tone: "bad", text: "This booking was cancelled." };
  if (b.bookingStatus === "COMPLETED")
    return { tone: "good", text: "This appointment has been completed." };
  return { tone: "pending", text: ERRORS.paymentPending };
}

function BookingStatusPage() {
  const [ref, setRef] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const lookupFn = useServerFn(lookupBooking);
  const mutation = useMutation({
    mutationFn: lookupFn,
    onSuccess: (res) => {
      setBooking(res.booking);
      setNotFound(!res.booking);
    },
  });

  const status = booking ? statusCopy(booking) : null;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 pt-12 pb-20 md:pt-20">
        <p className="eyebrow">Booking</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Check your booking</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Enter the reference we gave you, e.g. SC-AB12CD.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (ref.trim().length < 3) return;
            mutation.mutate({ data: { bookingId: ref.trim().toUpperCase() } });
          }}
        >
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="SC-AB12CD"
            aria-label="Booking reference"
            className="flex-1 rounded-2xl border border-input bg-background px-4 py-3.5 text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Check
          </button>
        </form>

        {notFound && (
          <p className="mt-6 text-sm text-destructive">
            We couldn't find that reference. Please check it and try again, or contact us
            on WhatsApp.
          </p>
        )}

        {booking && status && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] tracking-wider uppercase ${
                status.tone === "good"
                  ? "bg-whatsapp text-whatsapp-foreground"
                  : status.tone === "bad"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-accent text-accent-foreground"
              }`}
            >
              {booking.bookingStatus.replace("_", " ")}
            </span>
            <p className="mt-4 text-sm">{status.text}</p>

            <dl className="mt-6 space-y-2 text-sm">
              {[
                ["Reference", booking.bookingId],
                ["Name", booking.clientName],
                ["Service", booking.serviceName],
                ["Location", booking.locationName],
                ["Date", booking.appointmentDate],
                ["Time", booking.appointmentTime],
                ["Payment", booking.paymentStatus.replace("_", " ")],
                ["Booking fee", formatNaira(booking.bookingFee)],
                [
                  "Balance",
                  booking.balance === null ? "—" : formatNaira(booking.balance),
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>

            {booking.paymentStatus === "UNPAID" && (
              <a
                href={whatsappLink(paymentProofMessage(booking))}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-medium text-whatsapp-foreground"
              >
                <MessageCircle className="size-4" aria-hidden />
                Send your receipt on WhatsApp
              </a>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Need a new appointment?{" "}
          <Link to="/book" className="underline">
            Book here
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}
