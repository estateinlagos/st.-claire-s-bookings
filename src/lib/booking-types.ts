import { z } from "zod";

export type BookingStatus =
  | "TEMP_HOLD"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export type PaymentStatus =
  | "UNPAID"
  | "PROOF_SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface Booking {
  bookingId: string;
  createdAt: string;
  clientName: string;
  whatsapp: string;
  email: string | null;
  serviceId: string;
  serviceName: string;
  locationId: string;
  locationName: string;
  artist: string | null;
  appointmentDate: string; // yyyy-MM-dd
  appointmentTime: string; // HH:mm
  servicePrice: number | null;
  bookingFee: number;
  balance: number | null;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  holdExpiresAt: string | null;
  notes: string | null;
}

export interface AvailabilityDay {
  date: string; // yyyy-MM-dd
  slots: string[]; // HH:mm
}

/** Nigerian mobile number, accepted as 080..., +23480..., 23480... */
export const whatsappSchema = z
  .string()
  .trim()
  .min(1, "Please enter your WhatsApp number.")
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .refine(
    (v) => /^(?:\+?234|0)(70|71|80|81|90|91|81|78)\d{8}$/.test(v),
    "Enter a valid Nigerian WhatsApp number, e.g. 08012345678.",
  )
  .transform((v) => normaliseWhatsapp(v));

export function normaliseWhatsapp(raw: string): string {
  const v = raw.replace(/[\s()+-]/g, "");
  if (v.startsWith("234")) return `+${v}`;
  if (v.startsWith("0")) return `+234${v.slice(1)}`;
  return `+234${v}`;
}

export const createBookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
  whatsapp: whatsappSchema,
  email: z
    .string()
    .trim()
    .max(120)
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().min(1, "Please select a valid service."),
  locationId: z.enum(["ikeja", "lekki"]),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select an available appointment date."),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Please select a time."),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const ERRORS = {
  slotTaken:
    "That appointment slot has just been booked. Please choose another time.",
  invalidService: "Please select a valid service.",
  invalidDate: "Please select an available appointment date.",
  bookingFailed:
    "We couldn't complete your booking. Please try again or contact us on WhatsApp.",
  paymentPending: "Your appointment is currently awaiting payment verification.",
  confirmed: "Your appointment has been confirmed.",
} as const;
