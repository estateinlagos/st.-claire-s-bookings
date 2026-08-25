import { BUSINESS, formatNaira } from "@/lib/clinic";
import type { Booking } from "@/lib/booking-types";

export function whatsappLink(message?: string, number = BUSINESS.whatsapp) {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const GENERAL_ENQUIRY = `Hello St. Claire's, I'd like to ask about your services.`;

export function paymentProofMessage(b: Booking) {
  return [
    `Hello St. Claire's, I have made my ${formatNaira(b.bookingFee)} booking fee payment.`,
    ``,
    `Booking Ref: ${b.bookingId}`,
    `Name: ${b.clientName}`,
    `WhatsApp: ${b.whatsapp}`,
    `Service: ${b.serviceName}`,
    `Location: ${b.locationName}`,
    `Date: ${b.appointmentDate}`,
    `Time: ${b.appointmentTime}`,
    `Amount Paid: ${formatNaira(b.bookingFee)}`,
    ``,
    `I have attached my payment receipt.`,
  ].join("\n");
}
