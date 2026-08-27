# Google Sheets + Apps Script backend — setup

The website has no booking database. Bookings, availability and blocked dates
all live in one Google Spreadsheet, and the site talks to it through an Apps
Script web app.

Until `APPS_SCRIPT_URL` is set, the site runs against an in-memory mock with the
exact same API, so the whole flow is clickable and testable.

## 1. Create the spreadsheet

Create one spreadsheet with these tabs. **Row 1 must contain the header names
exactly as written** (lowercase, underscores).

### SERVICES
`service_id | category | service_name | description | ikeja_price | lekki_price | duration_minutes | active | artist_level | notes`

(Reference copy of the menu. Prices shown on the site come from the site's
service config; keep this tab in sync when prices change.)

### LOCATIONS
`location_id | location_name | address | phone | active | opening_notes`

Use `ikeja` and `lekki` as the `location_id` values.

### ARTISTS
`artist_id | artist_name | artist_level | ikeja | lekki | active`

### WORKING_HOURS
`location_id | day_of_week | start_time | end_time | active`

`day_of_week`: 0 = Sunday … 6 = Saturday. Times as `09:00`, `18:00`.
One row per working day per location. **This is what generates availability —
if this tab is empty, no dates appear on the site.**

### BLOCKED_DATES
`date | location_id | artist_id | start_time | end_time | reason`

Leave `start_time`/`end_time` empty to block the whole day.

### BOOKINGS
`booking_id | created_at | client_name | whatsapp | email | service | location | artist | appointment_date | appointment_time | service_price | booking_fee | balance | payment_status | booking_status | proof_status | notes | hold_expires_at`

The script appends rows here in exactly this column order.

### CONFIG
`key | value`

| key                      | suggested value |
| ------------------------ | --------------- |
| booking_fee              | 20000           |
| hold_minutes             | 45              |
| slot_interval_minutes    | 120             |
| availability_days        | 45              |
| minimum_lead_hours       | 24              |

## 2. Add the script

Extensions → Apps Script → replace `Code.gs` with the file next to this README.

Project Settings → Script Properties → add:

- `SHARED_SECRET` = a long random string (keep it private)

## 3. Deploy

Deploy → New deployment → **Web app**
- Execute as: **Me**
- Who has access: **Anyone**

Copy the `/exec` URL.

## 4. Give the website the credentials

Send the deployment URL and the shared secret back in chat. They are stored as
project secrets (`APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`) and only ever read
server-side — never in the browser.

## 5. Day-to-day staff workflow (in the Sheet)

1. Open the **BOOKINGS** tab; new rows arrive as `TEMP_HOLD` / `UNPAID`.
2. When a receipt arrives on WhatsApp, set `payment_status` to `PROOF_SUBMITTED`.
3. Confirm the transfer in the bank app, then set `payment_status` to `VERIFIED`
   and `booking_status` to `CONFIRMED`.
4. Send the client their confirmation on WhatsApp.

Handy helper column — paste into a spare column to get a one-click chat link:

```
=IF(D2="";"";HYPERLINK("https://wa.me/"&SUBSTITUTE(SUBSTITUTE(D2;"+";"");"'";"");"Chat with client"))
```

Set data validation dropdowns on `booking_status`
(`TEMP_HOLD, PAYMENT_PENDING, CONFIRMED, CANCELLED, COMPLETED, EXPIRED`) and
`payment_status` (`UNPAID, PROOF_SUBMITTED, VERIFIED, REJECTED`).

Blocking time off: add a row to **BLOCKED_DATES**. Those slots disappear from
the site immediately.
