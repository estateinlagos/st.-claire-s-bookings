/**
 * Server-only booking data access.
 *
 * The operational backend is a Google Spreadsheet driven by an Apps Script
 * web app (see docs/apps-script/Code.gs). Until the deployment URL and shared
 * secret are configured, an in-memory mock implementing the exact same API
 * contract is used so the whole flow is testable.
 */
import type {
  AvailabilityDay,
  Booking,
  CreateBookingInput,
} from "./booking-types";
import { SERVICES, LOCATIONS, priceAmount, BUSINESS } from "./clinic";

const HOLD_MINUTES = 45;
const SLOT_TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];

function config() {
  return {
    url: process.env["APPS_SCRIPT_URL"] ?? "",
    secret: process.env["APPS_SCRIPT_SECRET"] ?? "",
  };
}

export function isLive() {
  return Boolean(config().url);
}

async function callAppsScript<T>(
  action: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const { url, secret } = config();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, secret, payload }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Apps Script ${action} failed [${res.status}]: ${body}`);
    throw new Error("BOOKING_BACKEND_ERROR");
  }
  const json = (await res.json()) as { ok: boolean; error?: string; data?: T };
  if (!json.ok) throw new Error(json.error ?? "BOOKING_BACKEND_ERROR");
  return json.data as T;
}

/* ────────────────────────── mock store ────────────────────────── */

const mockBookings = new Map<string, Booking>();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function expireHolds() {
  const now = Date.now();
  for (const b of mockBookings.values()) {
    if (
      b.bookingStatus === "TEMP_HOLD" &&
      b.holdExpiresAt &&
      new Date(b.holdExpiresAt).getTime() < now
    ) {
      b.bookingStatus = "EXPIRED";
    }
  }
}

function slotTaken(locationId: string, date: string, time: string) {
  expireHolds();
  for (const b of mockBookings.values()) {
    if (
      b.locationId === locationId &&
      b.appointmentDate === date &&
      b.appointmentTime === time &&
      ["TEMP_HOLD", "PAYMENT_PENDING", "CONFIRMED", "COMPLETED"].includes(
        b.bookingStatus,
      )
    ) {
      return true;
    }
  }
  return false;
}

function mockAvailability(locationId: string, days: number): AvailabilityDay[] {
  expireHolds();
  const out: AvailabilityDay[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue; // closed Sundays (mock only)
    const date = toDateKey(d);
    const slots = SLOT_TIMES.filter((t) => !slotTaken(locationId, date, t));
    if (slots.length) out.push({ date, slots });
  }
  return out;
}

function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++)
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `SC-${s}`;
}

/* ────────────────────────── public API ────────────────────────── */

export async function fetchAvailability(
  locationId: string,
  days = 45,
): Promise<AvailabilityDay[]> {
  if (isLive()) {
    return callAppsScript<AvailabilityDay[]>("getAvailability", {
      locationId,
      days,
    });
  }
  return mockAvailability(locationId, days);
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  const service = SERVICES.find((s) => s.id === input.serviceId);
  if (!service || !service.bookable) throw new Error("INVALID_SERVICE");
  const location = LOCATIONS.find((l) => l.id === input.locationId);
  if (!location || !location.active) throw new Error("INVALID_LOCATION");
  if (!service.locations.includes(location.id)) throw new Error("INVALID_SERVICE");

  if (isLive()) {
    return callAppsScript<Booking>("createBooking", {
      ...input,
      serviceName: service.name,
      locationName: location.name,
      bookingFee: BUSINESS.bookingFee,
      servicePrice: priceAmount(service.price, location.id),
    });
  }

  if (slotTaken(location.id, input.appointmentDate, input.appointmentTime)) {
    throw new Error("SLOT_TAKEN");
  }

  const price = priceAmount(service.price, location.id);
  const booking: Booking = {
    bookingId: makeRef(),
    createdAt: new Date().toISOString(),
    clientName: input.clientName,
    whatsapp: input.whatsapp,
    email: input.email || null,
    serviceId: service.id,
    serviceName: service.name,
    locationId: location.id,
    locationName: location.name,
    artist: null,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    servicePrice: price,
    bookingFee: BUSINESS.bookingFee,
    balance: price === null ? null : price - BUSINESS.bookingFee,
    paymentStatus: "UNPAID",
    bookingStatus: "TEMP_HOLD",
    holdExpiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(),
    notes: input.notes || null,
  };
  mockBookings.set(booking.bookingId, booking);
  return booking;
}

export async function fetchBooking(
  bookingId: string,
): Promise<Booking | null> {
  const ref = bookingId.trim().toUpperCase();
  if (isLive()) {
    return callAppsScript<Booking | null>("getBooking", { bookingId: ref });
  }
  expireHolds();
  return mockBookings.get(ref) ?? null;
}
