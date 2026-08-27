# St. Claire's Bookings

ST. CLAIRE'S BEAUTY CLINIC — WEBSITE BUILDOUT MASTER INSTRUCTION

## 1. PROJECT OVERVIEW

Build a modern, elegant, mobile-first website and lightweight appointment-booking system for:

**Brand:** St. Claire's / Flawless Reflections by St. Claire  

**Instagram:** https://www.instagram.com/st.clairesbeautyclinic/  

**Primary location currently supplied:** 12 Amore Street, Off Toyin, Ikeja, Lagos  

**Phone:** 09033296288, 08138461997

Business focus:

- Semi-permanent makeup (SPMU)

- Brows

- Brow touch-ups

- Lashes

- Lip blush

- Eyeliner

- Facials

- Waxing

- Other beauty services as confirmed by the business

IMPORTANT: The website is primarily a **beauty service discovery + appointment booking system**. It is NOT just a brochure website.

The business owner's most important customer data point is the client's **WhatsApp number**. WhatsApp should therefore be treated as the primary communication channel.

---

# 2. PRIMARY BUSINESS OBJECTIVE

The website must make it extremely easy for a client coming from Instagram, Google, Facebook or an advert to:

1. Discover a service.

2. Understand the service and price.

3. Choose a location.

4. Choose an available date/time.

5. Enter their name and WhatsApp number.

6. Create a booking.

7. Receive bank-transfer instructions for the ₦20,000 booking fee.

8. Send proof of payment through WhatsApp.

9. Have the business verify the transfer.

10. Receive booking confirmation through WhatsApp.

The website should NOT use an online payment gateway in this version.

Payment is by **bank transfer only**.

---

# 3. IMPORTANT IMPLEMENTATION PRINCIPLE

Keep the system **wide enough to grow but extremely simple to operate**.

Recommended architecture:

**Frontend**

- Modern responsive website

- Mobile-first

- Optimized for Instagram traffic

- Fast loading

**Backend/data**

- Google Sheets

**Automation/API**

- Google Apps Script

**Communication**

- WhatsApp

**Payment**

- Manual bank transfer

Do NOT introduce a complicated custom backend/database unless absolutely necessary.

Google Sheets should act as the operational data source, while the website provides the polished client experience.

---

# 4. DO NOT INVENT BUSINESS INFORMATION

Only use information supplied in this document or verified from the business's official Instagram/page/materials.

If information is missing:

- Mark it as `TO BE CONFIRMED`

- Do not invent prices.

- Do not invent opening hours.

- Do not invent the Lekki address.

- Do not invent artists' names.

- Do not invent service durations.

- Do not invent policies.

- Do not invent testimonials.

The site may use clearly labelled placeholders during development, but the production site must not contain fabricated business information.

---

# 5. INSTAGRAM RESEARCH — REQUIRED

Before finalizing the design/content, inspect the official Instagram account:

https://www.instagram.com/st.clairesbeautyclinic/

The purpose is to understand:

- Brand personality

- Visual identity

- Logo

- Brand colors

- Typography/style

- Clinic interior

- Treatment rooms

- Staff/artists

- Before/after results

- Brow work

- Lash work

- Lip work

- Facial work

- Waxing work

- Client experience

- Contact information

- Locations

- Additional services

- Frequently repeated offers/promotions

- Useful captions and business positioning

Use the Instagram account as a **research/reference source**, not as permission to copy captions wholesale.

### IMPORTANT FOR LOVABLE / AI BUILDERS

If direct Instagram image retrieval is unavailable because of Instagram restrictions, do NOT fabricate images.

Instead:

1. Use the Instagram URL as the source reference.

2. Ask the user/business owner to upload the preferred images.

3. Build image slots/components so the supplied images can be dropped in later.

4. Do not use random beauty-stock images as if they were St. Claire's actual work.

5. If stock imagery is temporarily used during prototyping, clearly treat it as placeholder imagery and replace it before launch.

Lovable should specifically inspect the Instagram profile if its browsing/integration capabilities allow it and use the discovered visual information to influence the design.

---

# 6. BRAND POSITIONING

Working brand presentation:

**FLAWLESS REFLECTIONS BY ST. CLAIRE**

The experience should feel:

- Elegant

- Feminine

- Premium

- Clean

- Professional

- Trustworthy

- Modern

- Warm

- Results-focused

Avoid making the site look like a generic salon template.

Do not overuse the word "luxury."

The website should communicate confidence and expertise without sounding exaggerated.

---

# 7. WEBSITE STRUCTURE

Create the following primary pages/sections:

## HOME

- Hero

- Primary CTA: Book an Appointment

- Secondary CTA: WhatsApp

- Short brand introduction

- Featured services

- Before/after/results

- Why choose St. Claire's

- Locations

- Client testimonials (only verified/supplied)

- Instagram/social proof

- Final booking CTA

## SERVICES

Organize services into categories:

### SEMI-PERMANENT MAKEUP (SPMU)

- Microblading

- Ombre

- Combo

- Nano Blading

- Nano Combo

- Henna Brows

- Brow Lamination & Tint

- Laminated Henna

### BROWS TOUCH-UP

- 4 weeks–11 months

- 4 weeks–11 months (Nano)

- 1 year–17 months

- 1 year–17 months (Nano)

- 18 months and above — Full Price

- Not our brows — Full Price

- Color correction

- Color correction with service

### BROWS — SENIOR ARTIST

- Microblading

- Ombre

- Combo

### LASHES

- Classic

- Hybrid

- Volume

- Mega Volume

- Wispy Extra

- Lash Removal

### LIP BLUSH & EYELINER

- One Lip

- Both Lips

- Wing Eyeliner

- Laser Removal

### FACIALS

TO BE CONFIRMED.

### WAXING

TO BE CONFIRMED.

### OTHER SERVICES

TO BE CONFIRMED.

---

# 8. CURRENT VERIFIED PRICING

## BROWS — HEAD ARTIST

Pricing format is:

**IKEJA / LEKKI**

- Microblading — ₦120,000 / ₦140,000

- Ombre — ₦130,000 / ₦150,000

- Combo — ₦135,000 / ₦155,000

- Nano Blading — ₦202,500 / ₦222,500

- Nano Combo — ₦262,500 / ₦282,500

- Henna Brows — ₦23,000 / ₦28,000

- Brow Lamination & Tint — ₦37,000 / ₦40,000

- Laminated Henna — ₦35,000 / ₦42,000

## BROWS TOUCH-UP — IKEJA / LEKKI

- 4 weeks–11 months — ₦70,000 / ₦85,000

- 4 weeks–11 months (Nano) — ₦90,000 / ₦105,000

- 1 year–17 months — ₦85,000 / ₦100,000

- 1 year–17 months (Nano) — ₦100,000 / ₦115,000

- 18 months and above — Full Price

- Not our brows — Full Price

- Color correction — ₦40,000

- Color correction with service — Full Price + ₦40,000

## BROWS — SENIOR ARTIST

- Microblading — ₦85,000

- Ombre — ₦90,000

- Combo — ₦90,000

## LASHES — IKEJA / LEKKI

- Classic — ₦23,000 / ₦24,000

- Hybrid — ₦28,000 / ₦30,000

- Volume — ₦35,000 / ₦37,000

- Mega Volume — ₦42,000 / ₦45,000

- Wispy Extra — ₦8,000

- Lash Removal — ₦5,000

## LIP BLUSH & EYELINER — IKEJA / LEKKI

- One Lip — ₦90,000 / ₦110,000

- Both Lips — ₦120,000 / ₦140,000

- Wing Eyeliner — ₦80,000 / ₦100,000

- Laser Removal — ₦40,000

Do not alter these prices without explicit instruction.

---

# 9. LOCATION STRUCTURE

Current known location:

**IKEJA**

12 Amore Street, Off Toyin, Ikeja, Lagos

A second location is referred to as:

**LEKKI**

The exact Lekki address is NOT yet confirmed.

Do not invent it.

Build the system so locations are database/configuration-driven and a second location can be activated once the exact details are supplied.

---

# 10. BOOKING WORKFLOW

This is the most important functional requirement.

Recommended customer journey:

**Service**

↓

**Location**

↓

**Date**

↓

**Available Time**

↓

**Client Details**

↓

**Booking Reference**

↓

**Bank Transfer Instructions**

↓

**Send Proof of Payment via WhatsApp**

↓

**Staff Verification**

↓

**Booking Confirmed**

Do not make this complicated.

---

# 11. CLIENT INFORMATION

At minimum collect:

### Required

- Full Name

- WhatsApp Number

- Service

- Location

- Appointment Date

- Appointment Time

### Optional

- Email

- Notes

WhatsApp number is the most important contact field.

Validate the WhatsApp number before accepting the booking.

---

# 12. AVAILABILITY SYSTEM

Do NOT hard-code appointment dates into the frontend.

Availability must be generated from Google Sheets + Apps Script.

The system should consider:

- Location

- Artist

- Working days

- Working hours

- Existing bookings

- Blocked dates

- Blocked time periods

- Service duration

The client should only see genuinely available dates/times.

---

# 13. GOOGLE SHEETS STRUCTURE

Create a Google Spreadsheet with these logical tabs.

## SERVICES

Suggested columns:

- service_id

- category

- service_name

- description

- ikeja_price

- lekki_price

- duration_minutes

- active

- artist_level

- notes

## LOCATIONS

Suggested columns:

- location_id

- location_name

- address

- phone

- active

- opening_notes

## ARTISTS

Suggested columns:

- artist_id

- artist_name

- artist_level

- ikeja

- lekki

- active

Do not invent artist names.

## WORKING_HOURS

Suggested columns:

- location_id

- day_of_week

- start_time

- end_time

- active

Actual hours must be confirmed by St. Claire's.

## BLOCKED_DATES

Suggested columns:

- date

- location_id

- artist_id

- start_time

- end_time

- reason

## BOOKINGS

Suggested columns:

- booking_id

- created_at

- client_name

- whatsapp

- email

- service

- location

- artist

- appointment_date

- appointment_time

- service_price

- booking_fee

- balance

- payment_status

- booking_status

- proof_status

- notes

---

# 14. BOOKING STATUS MODEL

Use simple statuses.

### Booking Status

- TEMP_HOLD

- PAYMENT_PENDING

- CONFIRMED

- CANCELLED

- COMPLETED

- EXPIRED

### Payment Status

- UNPAID

- PROOF_SUBMITTED

- VERIFIED

- REJECTED

A booking is NOT confirmed just because the client completed the website form.

The appointment becomes confirmed only after St. Claire's verifies the ₦20,000 bank transfer.

---

# 15. TEMPORARY SLOT HOLD

When a customer selects a slot and submits a booking:

- Create a temporary hold.

- Prevent another customer from taking the same slot.

- Give the client a reasonable payment/proof window.

- If the hold expires without payment/proof, release the slot.

Suggested initial hold period: 30–60 minutes.

Make this configurable rather than hard-coded.

Apps Script should prevent double-booking using server-side validation and appropriate locking.

---

# 16. PAYMENT

Payment method:

**BANK TRANSFER ONLY**

Booking fee:

**₦20,000**

The ₦20,000 is:

- Required to secure the preferred time slot.

- Part payment toward the total service cost.

- Strictly non-refundable.

### Payment details

**Account Name:** Flawless Reflection by St.Claire  

**Bank:** Providus Bank  

**Account Number:** 5401862352

Display these clearly after the booking is created.

Do NOT integrate Stripe, Paystack, Flutterwave or another online payment gateway unless explicitly requested later.

---

# 17. PAYMENT PROOF / WHATSAPP

The website should generate a WhatsApp link after the booking is created.

The message should be pre-filled with:

- Booking reference

- Client name

- WhatsApp number

- Service

- Location

- Appointment date

- Appointment time

- Booking fee

Example:

"Hello St. Claire's, I have made my ₦20,000 booking fee payment.

Booking Ref: SC-XXXXXX

Name: [Name]

Service: [Service]

Location: [Location]

Date: [Date]

Time: [Time]

Amount Paid: ₦20,000

I have attached my payment receipt."

The client then attaches the bank transfer receipt and sends it through WhatsApp.

IMPORTANT:

The website does not need to automatically read or verify the receipt.

Staff verifies the transfer manually.

---

# 18. WHATSAPP NUMBER

The client's WhatsApp number must be stored with every booking.

The admin view should make it very easy to click:

**Chat with Client on WhatsApp**

The WhatsApp link should use the stored number.

Do not expose client WhatsApp numbers publicly.

---

# 19. ADMIN WORKFLOW

Do not build a complicated custom admin dashboard initially unless it materially improves usability.

Google Sheets can be the operational backend.

Staff should be able to:

1. See bookings.

2. Identify payment-pending bookings.

3. Verify bank transfer.

4. Change payment status to VERIFIED.

5. Change booking status to CONFIRMED.

6. See client WhatsApp number.

7. Open WhatsApp chat.

8. Block dates/times.

9. Manage service prices.

10. Manage locations and artists as needed.

If a simple dashboard is added, it should sit on top of the Sheet rather than creating a separate data source.

---

# 20. CANCELLATION / RESCHEDULING POLICY

Current supplied policy:

### Booking Fee

The ₦20,000 booking fee is strictly non-refundable.

### Cancellation / Rescheduling

A 24-hour notice is required to reschedule or cancel.

### No-show

If the client does not show up, the ₦20,000 booking fee is forfeited as a cancellation fee.

IMPORTANT:

The exact treatment of the ₦20,000 when a client gives 24+ hours notice but cancels/reschedules needs final business confirmation.

Do not invent a refund/credit rule.

---

# 21. BOOKING CONFIRMATION

After payment verification, staff should be able to send/trigger a WhatsApp confirmation.

The confirmation should include:

- St. Claire's

- Booking reference

- Client name

- Service

- Location

- Artist, if applicable

- Date

- Time

- Total service price

- ₦20,000 paid

- Remaining balance

- Address

- Relevant appointment instructions

---

# 22. SERVICE DETAIL PAGES

Each major service should have:

- Service name

- Short description

- Price

- Location pricing

- Duration (only once confirmed)

- Who it is suitable for

- What to expect

- Preparation

- Aftercare

- Before/after images

- FAQs

- Book button

Do not invent medical/contraindication information. Any SPMU safety/eligibility content must be supplied or professionally verified before publication.

---

# 23. DESIGN REQUIREMENTS

Mobile-first.

The site will likely receive substantial traffic from Instagram.

Prioritize:

- Fast loading

- Large, clear CTA buttons

- Easy scrolling

- Excellent image presentation

- Simple booking flow

- WhatsApp visibility

- Clear pricing

- Trust signals

- Strong before/after presentation

Avoid:

- Overly complicated animations

- Slow video backgrounds

- Huge blocks of text

- Generic salon-template appearance

- Excessive popups

- Confusing navigation

Primary CTA:

**BOOK AN APPOINTMENT**

Secondary CTA:

**CHAT ON WHATSAPP**

---

# 24. HOMEPAGE HERO

Do not permanently lock in a slogan before reviewing the Instagram branding.

The hero should communicate:

- St. Claire's beauty expertise

- Main treatment categories

- Lagos location

- Appointment CTA

Use real St. Claire's photography wherever possible.

---

# 25. IMAGE STRATEGY

Priority order:

1. Official St. Claire's photos supplied by the business.

2. Images from the official Instagram account, where use is authorized/appropriate.

3. Professional images supplied by the business.

4. Temporary placeholder images only during development.

Never represent another clinic's work as St. Claire's work.

Build reusable image galleries for:

- Brows

- Lashes

- Lips

- Eyeliner

- Facials

- Waxing

- Clinic

- Team

Include alt text for SEO/accessibility.

---

# 26. SEO

Create a foundation for local SEO around:

- St. Claire's Beauty Clinic

- Beauty clinic in Lagos

- Beauty clinic Ikeja

- Microblading Lagos

- Microblading Ikeja

- Ombre brows Lagos

- Nano brows Lagos

- Lash extensions Lagos

- Lip blush Lagos

- Brow services Lagos

Do not keyword-stuff.

Create clean page titles, meta descriptions, headings, URLs and image alt text.

Use LocalBusiness/BeautySalon structured data only with verified business information.

---

# 27. INSTAGRAM INTEGRATION

Include an Instagram section or link to the official profile.

The goal is to show social proof and drive discovery.

If an automated Instagram feed is technically unreliable, do not make the entire site dependent on it.

A curated gallery controlled by the website/admin is preferable for stability.

---

# 28. TECHNICAL REQUIREMENTS

Apps Script endpoints must:

- Validate incoming data.

- Validate service/location/date/time.

- Check availability server-side.

- Prevent double booking.

- Generate unique booking IDs.

- Write bookings to Google Sheets.

- Return clear success/error responses.

- Never trust frontend availability alone.

Use server-side locking where needed to prevent race conditions.

Never expose Google Sheet credentials or private keys in frontend code.

Keep secrets/configuration out of public source.

---

# 29. ERROR STATES

Design clear messages for:

### Slot already taken

"That appointment slot has just been booked. Please choose another time."

### Invalid service

"Please select a valid service."

### Invalid date

"Please select an available appointment date."

### Booking failure

"We couldn't complete your booking. Please try again or contact us on WhatsApp."

### Payment pending

"Your appointment is currently awaiting payment verification."

### Confirmed

"Your appointment has been confirmed."

---

# 30. FUTURE-READY BUT NOT OVERBUILT

Keep the architecture ready for future additions:

- Online payment gateway

- Automated WhatsApp API

- Email confirmations

- Automated reminders

- Customer profiles

- Booking history

- Loyalty program

- Gift cards

- Memberships

- Promotions

- Multiple artists

- Multiple locations

- Advanced admin dashboard

- Google Calendar synchronization

But DO NOT build these now unless specifically requested.

The first version should be reliable and simple.

---

# 31. LOVABLE-SPECIFIC BUILD INSTRUCTION

When building in Lovable:

1. First inspect the official Instagram profile:

   https://www.instagram.com/st.clairesbeautyclinic/

2. Extract visual direction and business information where available.

3. Do not invent information that Instagram does not provide.

4. Build the frontend first.

5. Build the booking flow before adding decorative features.

6. Use a clean data/service configuration model so services and prices are not scattered throughout components.

7. Prepare Google Apps Script integration through a clear API layer.

8. Keep Google Sheet logic separate from UI components.

9. Make the booking workflow mobile-first.

10. Test all booking edge cases.

11. Test double-booking protection.

12. Test WhatsApp links on mobile.

13. Test that the client's WhatsApp number is captured correctly.

14. Test booking confirmation states.

15. Do not claim a booking is confirmed before payment verification.

If Lovable cannot directly access Instagram assets, pause image implementation and use clearly marked placeholders until real assets are supplied.

---

# 32. REQUIRED TEST SCENARIOS

Before launch test:

### Scenario A

Client books an available slot.

Expected:

- Booking created.

- Unique booking reference.

- Payment pending.

- Slot temporarily held.

### Scenario B

Another client tries to book the same slot.

Expected:

- Slot unavailable.

### Scenario C

Staff verifies payment.

Expected:

- Payment status becomes VERIFIED.

- Booking becomes CONFIRMED.

### Scenario D

Client does not provide proof before hold expiry.

Expected:

- Hold expires.

- Slot becomes available again.

### Scenario E

Client chooses a blocked date.

Expected:

- Date/time cannot be booked.

### Scenario F

Client selects a service unavailable at a location.

Expected:

- Service cannot be selected there.

### Scenario G

Client enters invalid WhatsApp number.

Expected:

- Clear validation error.

### Scenario H

Two users attempt the same slot simultaneously.

Expected:

- Only one booking succeeds.

---

# 33. CONTENT STILL REQUIRED FROM BUSINESS OWNER

Before production launch, collect:

- Exact Lekki address

- Opening hours for each location

- Full facial menu

- Full waxing menu

- Other services

- Service durations

- Artist names

- Artist schedules

- Which artists perform which services

- Final cancellation/rescheduling treatment

- SPMU preparation information

- SPMU aftercare

- Client eligibility/contraindication information

- Logo/high-resolution brand assets

- Approved photographs

- Before/after photos

- Testimonials

- Founder/brand story

- Google Maps links

- Preferred WhatsApp number for business communication

- Any official booking/consultation rules

---

# 34. BUILD ORDER

Do not attempt everything simultaneously.

Recommended order:

### PHASE 1

Research Instagram + collect brand assets.

### PHASE 2

Create sitemap and page structure.

### PHASE 3

Create service/pricing data model.

### PHASE 4

Design homepage and service pages.

### PHASE 5

Build booking UI.

### PHASE 6

Build Google Sheet structure.

### PHASE 7

Build Apps Script API.

### PHASE 8

Connect booking UI to Apps Script.

### PHASE 9

Implement availability checking.

### PHASE 10

Implement temporary slot holds.

### PHASE 11

Implement WhatsApp payment-proof workflow.

### PHASE 12

Implement confirmation workflow.

### PHASE 13

Test extensively.

### PHASE 14

Replace all placeholders with approved business content/images.

### PHASE 15

SEO + performance + launch.

---

# 35. FINAL PRODUCT PRINCIPLE

The finished product should feel extremely simple to the customer:

**"I found the treatment I want → I picked a time → I entered my WhatsApp → I transferred ₦20,000 → I sent my receipt → St. Claire's confirmed me."**

Behind the scenes, Google Sheets + Apps Script handle the complexity.

Do not sacrifice reliability for visual complexity.

The priority order is:

**1. Correct availability**

**2. Correct booking**

**3. Correct WhatsApp capture**

**4. Correct payment verification workflow**

**5. Clear service/pricing information**

**6. Beautiful design**

**7. Advanced features later**

Build the simplest reliable version first.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/06049612-a934-4618-8a57-276fe3f79b79).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
