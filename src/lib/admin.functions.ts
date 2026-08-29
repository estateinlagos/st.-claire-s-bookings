import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  checkPasscode,
  listBookings,
  updateBooking,
  isLive,
} from "./booking.server";

const passcodeField = z.string().min(1).max(120);

const bookingStatus = z.enum([
  "TEMP_HOLD",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "EXPIRED",
]);

const paymentStatus = z.enum([
  "UNPAID",
  "PROOF_SUBMITTED",
  "VERIFIED",
  "REJECTED",
]);

export const staffSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ passcode: passcodeField }).parse(data),
  )
  .handler(async ({ data }) => ({ ok: checkPasscode(data.passcode) }));

export const staffBookings = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ passcode: passcodeField }).parse(data),
  )
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) {
      return { ok: false as const, bookings: [], live: false };
    }
    return { ok: true as const, bookings: await listBookings(), live: isLive() };
  });

export const staffUpdateBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        passcode: passcodeField,
        bookingId: z.string().min(3).max(20),
        bookingStatus: bookingStatus.optional(),
        paymentStatus: paymentStatus.optional(),
        artist: z.string().trim().max(80).optional(),
        notes: z.string().trim().max(500).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) return { ok: false as const };
    const { passcode: _passcode, ...rest } = data;
    const booking = await updateBooking(rest);
    return booking
      ? { ok: true as const, booking }
      : { ok: false as const };
  });
