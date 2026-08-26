import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  Copy,
  Loader2,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/layout";
import { paymentProofMessage, whatsappLink } from "@/components/site/whatsapp";
import {
  BUSINESS,
  LOCATIONS,
  SERVICES,
  CATEGORIES,
  formatNaira,
  priceAmount,
  priceFor,
  type LocationId,
} from "@/lib/clinic";
import {
  ERRORS,
  createBookingSchema,
  type Booking,
} from "@/lib/booking-types";
import { getAvailability, submitBooking } from "@/lib/booking.functions";

const TITLE = "Book an Appointment — St. Claire's Beauty Clinic, Lagos";
const DESCRIPTION =
  "Book brows, lashes, lip blush or eyeliner at St. Claire's Beauty Clinic in Ikeja, Lagos. Choose a time and secure it with the ₦20,000 booking fee.";

export const Route = createFileRoute("/book")({
  validateSearch: z.object({ service: z.string().optional() }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/book" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Location", "Date & time", "Your details"] as const;

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState(search.service ? 1 : 0);
  const [serviceSlug, setServiceSlug] = useState<string | null>(
    search.service ?? null,
  );
  const [locationId, setLocationId] = useState<LocationId | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientName: "",
    whatsapp: "",
    email: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [booking, setBooking] = useState<Booking | null>(null);

  const service = useMemo(
    () => SERVICES.find((s) => s.slug === serviceSlug) ?? null,
    [serviceSlug],
  );

  const availabilityFn = useServerFn(getAvailability);
  const availability = useQuery({
    queryKey: ["availability", locationId],
    enabled: Boolean(locationId),
    queryFn: () => availabilityFn({ data: { locationId: locationId! } }),
  });

  const submitFn = useServerFn(submitBooking);
  const mutation = useMutation({
    mutationFn: submitFn,
    onSuccess: (res) => {
      if (res.ok) {
        setBooking(res.booking);
        window.scrollTo({ top: 0 });
        return;
      }
      if (res.code === "SLOT_TAKEN") {
        toast.error(ERRORS.slotTaken);
        setTime(null);
        setStep(2);
        void availability.refetch();
      } else if (res.code === "INVALID_SERVICE") {
        toast.error(ERRORS.invalidService);
        setStep(0);
      } else {
        toast.error(ERRORS.bookingFailed);
      }
    },
    onError: () => toast.error(ERRORS.bookingFailed),
  });

  if (booking) return <BookingCreated booking={booking} />;

  const days = availability.data ?? [];
  const selectedDay = days.find((d) => d.date === date);

  function handleSubmit() {
    if (!service || !locationId || !date || !time) return;
    const parsed = createBookingSchema.safeParse({
      clientName: form.clientName,
      whatsapp: form.whatsapp,
      email: form.email || undefined,
      serviceId: service.id,
      locationId,
      appointmentDate: date,
      appointmentTime: time,
      notes: form.notes || undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ data: parsed.data });
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 pt-10 pb-16 md:pt-16">
        <p className="eyebrow">Booking</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Book an appointment</h1>

        {/* Progress */}
        <ol className="mt-8 flex items-center gap-2 text-[0.7rem] tracking-wider uppercase">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="size-3" aria-hidden /> : i + 1}
              </span>
              <span className="hidden text-muted-foreground sm:inline">{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8">
          {step === 0 && (
            <div>
              <h2 className="text-2xl">Choose a service</h2>
              <div className="mt-6 space-y-8">
                {CATEGORIES.filter((c) => !c.pending).map((cat) => {
                  const items = SERVICES.filter(
                    (s) => s.category === cat.id && s.bookable,
                  );
                  if (!items.length) return null;
                  return (
                    <div key={cat.id}>
                      <h3 className="eyebrow">{cat.name}</h3>
                      <div className="mt-3 grid gap-2">
                        {items.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setServiceSlug(s.slug);
                              void navigate({
                                to: "/book",
                                search: { service: s.slug },
                                replace: true,
                              });
                              setStep(1);
                            }}
                            className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                              serviceSlug === s.slug
                                ? "border-primary bg-secondary"
                                : "border-border hover:bg-secondary"
                            }`}
                          >
                            <span className="text-sm">{s.name}</span>
                            <span className="text-xs whitespace-nowrap text-muted-foreground">
                              {priceFor(s.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Touch-ups priced on assessment, facials and waxing aren't bookable online
                yet — message us on WhatsApp and we'll arrange it.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl">Choose a location</h2>
              <div className="mt-6 grid gap-3">
                {LOCATIONS.map((l) => {
                  const disabled = !l.active || !service?.locations.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        setLocationId(l.id);
                        setDate(null);
                        setTime(null);
                        setStep(2);
                      }}
                      className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
                        disabled
                          ? "cursor-not-allowed border-dashed border-border opacity-60"
                          : locationId === l.id
                            ? "border-primary bg-secondary"
                            : "border-border hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-base">{l.name}</span>
                        {service && !disabled && (
                          <span className="text-sm">
                            {priceFor(service.price, l.id)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.active
                          ? l.address
                          : "Not yet open for online booking — details to be confirmed."}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl">Choose a date & time</h2>
              {availability.isLoading && (
                <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Checking availability…
                </p>
              )}
              {availability.isError && (
                <p className="mt-6 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="size-4" aria-hidden />
                  {ERRORS.bookingFailed}
                </p>
              )}
              {!availability.isLoading && days.length === 0 && !availability.isError && (
                <p className="mt-6 text-sm text-muted-foreground">
                  {ERRORS.invalidDate}
                </p>
              )}

              {days.length > 0 && (
                <>
                  <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
                    {days.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => {
                          setDate(d.date);
                          setTime(null);
                        }}
                        className={`shrink-0 rounded-2xl border px-4 py-3 text-center text-xs transition-colors ${
                          date === d.date
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {prettyDate(d.date)}
                      </button>
                    ))}
                  </div>

                  {selectedDay && (
                    <div className="mt-6">
                      <h3 className="eyebrow">Available times</h3>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {selectedDay.slots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                              time === t
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:bg-secondary"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!date || !time}
                    onClick={() => setStep(3)}
                    className="mt-8 w-full rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          )}

          {step === 3 && service && locationId && date && time && (
            <div>
              <h2 className="text-2xl">Your details</h2>
              <div className="mt-6 space-y-4">
                <Field
                  label="Full name"
                  required
                  value={form.clientName}
                  error={errors["clientName"]}
                  onChange={(v) => setForm((f) => ({ ...f, clientName: v }))}
                  placeholder="Your full name"
                />
                <Field
                  label="WhatsApp number"
                  required
                  value={form.whatsapp}
                  error={errors["whatsapp"]}
                  onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
                  placeholder="08012345678"
                  type="tel"
                  hint="We confirm every appointment on WhatsApp, so this must be reachable."
                />
                <Field
                  label="Email (optional)"
                  value={form.email}
                  error={errors["email"]}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="you@example.com"
                  type="email"
                />
                <div>
                  <label className="text-sm" htmlFor="notes">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Anything we should know before your appointment"
                  />
                </div>
              </div>

              <dl className="mt-8 space-y-2 rounded-2xl bg-secondary p-5 text-sm">
                <Row label="Service" value={service.name} />
                <Row label="Location" value={LOCATIONS.find((l) => l.id === locationId)!.name} />
                <Row label="Date" value={prettyDate(date)} />
                <Row label="Time" value={time} />
                <Row
                  label="Service price"
                  value={priceFor(service.price, locationId)}
                />
                <Row
                  label="Booking fee due now"
                  value={formatNaira(BUSINESS.bookingFee)}
                />
                <Row
                  label="Balance at appointment"
                  value={(() => {
                    const p = priceAmount(service.price, locationId);
                    return p === null ? "—" : formatNaira(p - BUSINESS.bookingFee);
                  })()}
                />
              </dl>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {mutation.isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                Reserve this slot
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Reserving holds your slot temporarily. It is only confirmed after we
                verify your {formatNaira(BUSINESS.bookingFee)} transfer.
              </p>
            </div>
          )}

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already booked?{" "}
          <Link to="/booking-status" className="underline">
            Check your booking status
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {hint && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function BookingCreated({ booking }: { booking: Booking }) {
  const [copied, setCopied] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-5 pt-12 pb-20 md:pt-20">
        <p className="eyebrow">Step 1 of 2 complete</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Slot reserved</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {ERRORS.paymentPending} Your slot is held while you transfer the booking fee
          and send your receipt.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6">
          <p className="eyebrow">Booking reference</p>
          <p className="mt-2 font-display text-4xl">{booking.bookingId}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <Row label="Name" value={booking.clientName} />
            <Row label="WhatsApp" value={booking.whatsapp} />
            <Row label="Service" value={booking.serviceName} />
            <Row label="Location" value={booking.locationName} />
            <Row label="Date" value={prettyDate(booking.appointmentDate)} />
            <Row label="Time" value={booking.appointmentTime} />
            <Row
              label="Service price"
              value={booking.servicePrice ? formatNaira(booking.servicePrice) : "—"}
            />
            <Row label="Booking fee" value={formatNaira(booking.bookingFee)} />
            <Row
              label="Balance at appointment"
              value={booking.balance === null ? "—" : formatNaira(booking.balance)}
            />
          </dl>
        </div>

        <div className="mt-6 rounded-3xl bg-secondary p-6">
          <h2 className="text-2xl">Transfer {formatNaira(booking.bookingFee)}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Account name" value={BUSINESS.bank.accountName} />
            <Row label="Bank" value={BUSINESS.bank.bankName} />
            <Row label="Account number" value={BUSINESS.bank.accountNumber} />
          </dl>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(BUSINESS.bank.accountNumber);
              setCopied(true);
              toast.success("Account number copied");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-xs"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy account number
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            The booking fee is non-refundable and goes toward your service total.
          </p>
        </div>

        <a
          href={whatsappLink(paymentProofMessage(booking))}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-medium text-whatsapp-foreground"
        >
          <MessageCircle className="size-4" aria-hidden />
          Send your receipt on WhatsApp
        </a>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Attach your transfer receipt to the pre-filled message. We confirm your
          appointment on WhatsApp once the transfer is verified.
        </p>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/booking-status" className="underline">
            Check this booking later
          </Link>{" "}
          using reference {booking.bookingId}.
        </p>
      </div>
    </SiteLayout>
  );
}
