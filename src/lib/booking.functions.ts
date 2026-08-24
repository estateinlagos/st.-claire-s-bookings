import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBookingSchema } from "./booking-types";
import {
  createBooking,
  fetchAvailability,
  fetchBooking,
} from "./booking.server";

export const getAvailability = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ locationId: z.enum(["ikeja", "lekki"]) }).parse(data),
  )
  .handler(async ({ data }) => fetchAvailability(data.locationId));

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createBookingSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const booking = await createBooking(data);
      return { ok: true as const, booking };
    } catch (err) {
      const code = err instanceof Error ? err.message : "UNKNOWN";
      return { ok: false as const, code };
    }
  });

export const lookupBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ bookingId: z.string().min(3).max(20) }).parse(data),
  )
  .handler(async ({ data }) => ({
    booking: await fetchBooking(data.bookingId),
  }));
