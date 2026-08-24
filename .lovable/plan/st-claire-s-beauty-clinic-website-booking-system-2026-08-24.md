# St. Claire's Beauty Clinic — Website + Booking System

## Note on Instagram

Instagram blocks automated access, so I cannot pull photos, logo or captions from
`@st.clairesbeautyclinic`. Nothing will be invented. Every photo position becomes a labelled
image slot ("Awaiting approved photo") that you fill by uploading images to the chat — I then
drop them in. Same for logo, testimonials, founder story and opening hours.

## Design direction

Style reference: the uploaded editorial skincare layout — soft warm neutrals, generous
whitespace, large rounded-corner cards, quiet serif display headings paired with a clean sans,
restrained motion. Applied to a feminine, premium, results-focused beauty clinic — not a
generic salon template. Mobile-first throughout, with sticky "Book an Appointment" and a
floating WhatsApp button.

## Pages

- **Home** — hero, brand intro, featured service categories, results gallery slots, why
  St. Claire's, locations, testimonials slot, Instagram strip, final booking CTA
- **Services** — all categories with Ikeja / Lekki pricing exactly as supplied
- **Service detail** — one page per major service: description, both prices, what to expect,
  prep/aftercare (marked TO BE CONFIRMED until supplied), gallery slots, FAQs, book button
- **Book** — the booking flow
- **About**, **Locations**, **Contact**, **Policies** (booking fee, 24h notice, no-show)
- **Booking status page** — reference lookup showing pending / confirmed state

## Booking flow

Service → Location → Date → Time → Name + WhatsApp (+ optional email, notes) → booking
reference → bank transfer instructions (Providus, Flawless Reflection by St.Claire,
5401862352, ₦20,000) → pre-filled WhatsApp receipt message. Nothing says "confirmed" until
staff verify the transfer.

WhatsApp number validated for Nigerian format and normalised to `+234...`.

## Google Sheets + Apps Script backend

Data and logic live in Google Sheets, as specified. The site holds no booking database.

Tabs and columns exactly as you listed: SERVICES, LOCATIONS, ARTISTS, WORKING_HOURS,
BLOCKED_DATES, BOOKINGS, plus a CONFIG tab for booking fee, hold minutes and slot interval.

The Apps Script web app exposes: `getServices`, `getLocations`, `getAvailability`,
`createBooking`, `getBooking`. It validates every field server-side, recomputes availability
from working hours minus bookings, blocked ranges and service duration, uses `LockService` to
prevent two clients taking the same slot, generates `SC-XXXXXX` references, writes TEMP_HOLD /
UNPAID rows, and expires stale holds on each read. Frontend availability is never trusted.

Statuses: TEMP_HOLD, PAYMENT_PENDING, CONFIRMED, CANCELLED, COMPLETED, EXPIRED and
UNPAID, PROOF_SUBMITTED, VERIFIED, REJECTED.

Staff work in the Sheet itself: a bookings view with a clickable "Chat on WhatsApp" formula
column, and dropdowns for the two status fields. No separate admin database.

## What you need to do (one-time)

1. I generate the Apps Script code and the sheet layout.
2. You create the spreadsheet, paste the script, deploy it as a web app, and give me the
   deployment URL + a shared secret. I store the secret securely and call the script from
   server-side code only — never from the browser.

Until the URL exists, the site runs against a local mock of the same API so the whole flow is
clickable and testable, then switches over with no UI changes.

## Placeholders (nothing invented)

Lekki address, opening hours, facials menu, waxing menu, other services, service durations,
artist names, artist schedules, refund treatment on 24h+ cancellation, prep/aftercare,
contraindications, testimonials, founder story, all photos — each rendered as a visible
`TO BE CONFIRMED` marker.

## Technical notes

- TanStack Start; services/prices/locations in one typed config module, not scattered in
  components; Apps Script calls behind a single API layer in server functions.
- Apps Script URL and secret stored as project secrets, read server-side only.
- Per-page SEO metadata targeting Lagos/Ikeja microblading, ombre, nano brows, lashes and lip
  blush; BeautySalon structured data using only the verified Ikeja address and phone numbers.
- Error copy exactly as specified for taken slot, invalid service/date, failure, pending and
  confirmed.

## Build order

1. Design system + home page
2. Services data model, services index, service detail pages
3. Booking UI against the mock API
4. Apps Script + sheet spec delivered to you
5. Wire to the live endpoint, test double-booking, hold expiry, blocked dates, WhatsApp links
6. Swap placeholders for your supplied content and images
