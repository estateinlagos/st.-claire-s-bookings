import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  staffBookings,
  staffSignIn,
  staffUpdateBooking,
} from "@/lib/admin.functions";
import type {
  Booking,
  BookingStatus,
  PaymentStatus,
} from "@/lib/booking-types";
import { BUSINESS, formatNaira } from "@/lib/clinic";
import { whatsappLink } from "@/components/site/whatsapp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — St. Claire's Beauty Clinic" },
      {
        name: "description",
        content:
          "Private staff dashboard for managing St. Claire's Beauty Clinic appointments, deposits and client follow-ups.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Staff Dashboard — St. Claire's" },
      {
        property: "og:description",
        content: "Private appointment and deposit management dashboard.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const STORAGE_KEY = "stclaire.staff.passcode";

const BOOKING_STATUSES: BookingStatus[] = [
  "TEMP_HOLD",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "EXPIRED",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "UNPAID",
  "PROOF_SUBMITTED",
  "VERIFIED",
  "REJECTED",
];

const LABEL: Record<string, string> = {
  TEMP_HOLD: "Holding",
  PAYMENT_PENDING: "Awaiting payment",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
  UNPAID: "Unpaid",
  PROOF_SUBMITTED: "Receipt sent",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

const TONE: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  COMPLETED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  VERIFIED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  PAYMENT_PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
  PROOF_SUBMITTED: "bg-amber-50 text-amber-800 ring-amber-200",
  TEMP_HOLD: "bg-muted text-muted-foreground ring-border",
  UNPAID: "bg-muted text-muted-foreground ring-border",
  CANCELLED: "bg-rose-50 text-rose-800 ring-rose-200",
  REJECTED: "bg-rose-50 text-rose-800 ring-rose-200",
  EXPIRED: "bg-rose-50 text-rose-800 ring-rose-200",
};

function Pill({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        TONE[value] ?? "bg-muted text-muted-foreground ring-border"
      }`}
    >
      {LABEL[value] ?? value}
    </span>
  );
}

/* ───────────────────────── date helpers ───────────────────────── */

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function key(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function startOfWeek(d: Date) {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - ((out.getDay() + 6) % 7)); // Monday
  return out;
}
function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
const LONG = new Intl.DateTimeFormat("en-NG", {
  weekday: "short",
  day: "numeric",
  month: "short",
});
const RANGE = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/* ───────────────────────── page ───────────────────────── */

function AdminPage() {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPasscode(sessionStorage.getItem(STORAGE_KEY));
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-screen bg-muted/40" />;

  if (!passcode) {
    return (
      <SignIn
        onSignedIn={(code) => {
          sessionStorage.setItem(STORAGE_KEY, code);
          setPasscode(code);
        }}
      />
    );
  }

  return (
    <Dashboard
      passcode={passcode}
      onSignOut={() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setPasscode(null);
      }}
    />
  );
}

/* ───────────────────────── sign in ───────────────────────── */

function SignIn({ onSignedIn }: { onSignedIn: (code: string) => void }) {
  const signIn = useServerFn(staffSignIn);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setPending(true);
    try {
      const res = await signIn({ data: { passcode: value.trim() } });
      if (res.ok) onSignedIn(value.trim());
      else toast.error("That passcode isn't recognised.");
    } catch {
      toast.error("Couldn't sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {BUSINESS.name}
        </p>
        <h1 className="mt-2 font-serif text-3xl text-foreground">
          Staff dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the staff passcode to view today's appointments and deposits.
        </p>

        <div className="mt-6 space-y-2">
          <Label htmlFor="passcode">Staff passcode</Label>
          <Input
            id="passcode"
            type="password"
            autoComplete="current-password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={pending}>
          {pending ? "Checking…" : "Open dashboard"}
        </Button>
      </form>
    </main>
  );
}

/* ───────────────────────── dashboard ───────────────────────── */

type View = "week" | "all";

function Dashboard({
  passcode,
  onSignOut,
}: {
  passcode: string;
  onSignOut: () => void;
}) {
  const fetchBookings = useServerFn(staffBookings);
  const update = useServerFn(staffUpdateBooking);
  const qc = useQueryClient();

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [view, setView] = useState<View>("week");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const query = useQuery({
    queryKey: ["staff-bookings"],
    queryFn: () => fetchBookings({ data: { passcode } }),
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (query.data && !query.data.ok) {
      toast.error("Your session expired. Please sign in again.");
      onSignOut();
    }
  }, [query.data, onSignOut]);

  const mutation = useMutation({
    mutationFn: (vars: {
      bookingId: string;
      bookingStatus?: BookingStatus;
      paymentStatus?: PaymentStatus;
    }) => update({ data: { passcode, ...vars } }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Booking updated.");
        void qc.invalidateQueries({ queryKey: ["staff-bookings"] });
      } else {
        toast.error("Couldn't update that booking.");
      }
    },
    onError: () => toast.error("Couldn't update that booking."),
  });

  const all = useMemo<Booking[]>(
    () => (query.data?.ok ? query.data.bookings : []),
    [query.data],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => key(addDays(weekStart, i))),
    [weekStart],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((b) => {
      if (view === "week" && !weekDays.includes(b.appointmentDate)) return false;
      if (statusFilter !== "all" && b.bookingStatus !== statusFilter)
        return false;
      if (!term) return true;
      return (
        b.clientName.toLowerCase().includes(term) ||
        b.bookingId.toLowerCase().includes(term) ||
        b.serviceName.toLowerCase().includes(term) ||
        b.whatsapp.includes(term)
      );
    });
  }, [all, view, weekDays, statusFilter, search]);

  const todayKey = key(new Date());
  const stats = useMemo(() => {
    const live = all.filter(
      (b) => !["CANCELLED", "EXPIRED"].includes(b.bookingStatus),
    );
    return {
      today: live.filter((b) => b.appointmentDate === todayKey).length,
      thisWeek: live.filter((b) => weekDays.includes(b.appointmentDate)).length,
      awaiting: all.filter((b) => b.paymentStatus === "PROOF_SUBMITTED").length,
      deposits: all
        .filter((b) => b.paymentStatus === "VERIFIED")
        .reduce((sum, b) => sum + b.bookingFee, 0),
    };
  }, [all, weekDays, todayKey]);

  return (
    <div className="min-h-screen bg-muted/40 lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <div className="px-2">
          <p className="font-serif text-lg leading-tight text-foreground">
            St. Claire's
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Staff dashboard
          </p>
        </div>

        <nav className="mt-8 space-y-1">
          <SideItem icon={LayoutDashboard} label="Appointments" active />
          <SideItem icon={CalendarDays} label="Schedule" hint="In the Sheet" />
          <SideItem icon={Users} label="Clients" hint="In the Sheet" />
          <SideItem icon={Wallet} label="Deposits" hint="In the Sheet" />
        </nav>

        <button
          onClick={onSignOut}
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Appointments</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {query.data?.live
                ? "Live data from the booking spreadsheet."
                : "Sample data — connect the booking spreadsheet to see real bookings."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ref, service"
                className="w-56 pl-9"
                aria-label="Search bookings"
              />
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut} className="lg:hidden">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat icon={Clock3} label="Today" value={String(stats.today)} />
          <Stat icon={CalendarDays} label="This week" value={String(stats.thisWeek)} />
          <Stat
            icon={CheckCircle2}
            label="Receipts to verify"
            value={String(stats.awaiting)}
          />
          <Stat
            icon={Wallet}
            label="Deposits verified"
            value={formatNaira(stats.deposits)}
          />
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous week"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
                disabled={view === "all"}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-52 text-center text-sm font-medium text-foreground">
                {view === "all"
                  ? "All upcoming bookings"
                  : `${RANGE.format(weekStart)} – ${RANGE.format(addDays(weekStart, 6))}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                aria-label="Next week"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
                disabled={view === "all"}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44" aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {BOOKING_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex rounded-lg border border-border p-0.5">
                {(["week", "all"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      view === v
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v === "week" ? "Weekly" : "All"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {query.isLoading ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Loading bookings…
            </p>
          ) : rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No bookings match this view.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Deposit</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((b) => (
                    <TableRow key={b.bookingId}>
                      <TableCell>
                        <span className="block font-medium text-foreground">
                          {b.clientName}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {b.bookingId} · {b.whatsapp}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-52 text-sm">
                        {b.serviceName}
                      </TableCell>
                      <TableCell className="text-sm">{b.locationName}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {LONG.format(new Date(`${b.appointmentDate}T00:00:00`))}
                      </TableCell>
                      <TableCell className="text-sm">{b.appointmentTime}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatNaira(b.bookingFee)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {b.balance === null ? "—" : formatNaira(b.balance)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={b.paymentStatus}
                          onValueChange={(v) =>
                            mutation.mutate({
                              bookingId: b.bookingId,
                              paymentStatus: v as PaymentStatus,
                            })
                          }
                        >
                          <SelectTrigger
                            className="h-8 w-36 border-none bg-transparent p-0 shadow-none focus:ring-0"
                            aria-label={`Payment status for ${b.clientName}`}
                          >
                            <Pill value={b.paymentStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {LABEL[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={b.bookingStatus}
                          onValueChange={(v) =>
                            mutation.mutate({
                              bookingId: b.bookingId,
                              bookingStatus: v as BookingStatus,
                            })
                          }
                        >
                          <SelectTrigger
                            className="h-8 w-40 border-none bg-transparent p-0 shadow-none focus:ring-0"
                            aria-label={`Booking status for ${b.clientName}`}
                          >
                            <Pill value={b.bookingStatus} />
                          </SelectTrigger>
                          <SelectContent>
                            {BOOKING_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {LABEL[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <a
                            href={whatsappLink(
                              `Hello ${b.clientName}, this is ${BUSINESS.name} regarding your appointment ${b.bookingId}.`,
                              b.whatsapp.replace(/\D/g, ""),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`Message ${b.clientName} on WhatsApp`}
                          >
                            <MessageCircle className="size-4" />
                          </a>
                          {b.paymentStatus === "PROOF_SUBMITTED" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                mutation.mutate({
                                  bookingId: b.bookingId,
                                  paymentStatus: "VERIFIED",
                                  bookingStatus: "CONFIRMED",
                                })
                              }
                            >
                              Confirm
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs text-muted-foreground">
          Changes made here write straight back to the booking spreadsheet. Always
          confirm the transfer in the Providus app before marking a deposit as
          verified.
        </p>
      </main>
    </div>
  );
}

function SideItem({
  icon: Icon,
  label,
  active,
  hint,
}: {
  icon: typeof Users;
  label: string;
  active?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
      {hint && (
        <span className="ml-auto text-[10px] uppercase tracking-wide opacity-70">
          {hint}
        </span>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-serif text-2xl text-foreground">{value}</p>
    </div>
  );
}
