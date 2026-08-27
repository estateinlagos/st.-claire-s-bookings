/**
 * St. Claire's Beauty Clinic — booking backend.
 *
 * Deploy: Extensions → Apps Script → paste this file → Deploy → New deployment
 *   Type: Web app · Execute as: Me · Who has access: Anyone
 * Then set Script Properties:  SHARED_SECRET = <a long random string>
 * Give the deployment URL + the same secret to the website (APPS_SCRIPT_URL /
 * APPS_SCRIPT_SECRET).
 *
 * Every request is POST JSON: { action, secret, payload }
 * Every response is JSON:     { ok: true, data } | { ok: false, error }
 */

var SS = SpreadsheetApp.getActiveSpreadsheet();

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    if (req.secret !== props_('SHARED_SECRET')) return out_(false, null, 'UNAUTHORIZED');

    switch (req.action) {
      case 'getAvailability':
        return out_(true, getAvailability_(req.payload));
      case 'createBooking':
        return out_(true, createBooking_(req.payload));
      case 'getBooking':
        return out_(true, getBooking_(req.payload));
      default:
        return out_(false, null, 'UNKNOWN_ACTION');
    }
  } catch (err) {
    return out_(false, null, String(err && err.message ? err.message : err));
  }
}

function out_(ok, data, error) {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: ok, data: data, error: error || null })
  ).setMimeType(ContentService.MimeType.JSON);
}

function props_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/* ───────────────────────── sheet helpers ───────────────────────── */

function rows_(tab) {
  var sheet = SS.getSheetByName(tab);
  if (!sheet) throw new Error('MISSING_TAB_' + tab);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0].map(function (h) { return String(h).trim(); });
  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function config_(key, fallback) {
  var found = rows_('CONFIG').filter(function (r) { return r.key === key; })[0];
  return found ? found.value : fallback;
}

function dateKey_(d) {
  return Utilities.formatDate(d, SS.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
}

function hhmm_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, SS.getSpreadsheetTimeZone(), 'HH:mm');
  }
  return String(value).slice(0, 5);
}

function toMinutes_(hhmm) {
  var parts = String(hhmm).split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

function fromMinutes_(mins) {
  var h = Math.floor(mins / 60), m = mins % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

var LIVE_STATUSES = ['TEMP_HOLD', 'PAYMENT_PENDING', 'CONFIRMED', 'COMPLETED'];

/* ───────────────────────── hold expiry ───────────────────────── */

function expireHolds_() {
  var sheet = SS.getSheetByName('BOOKINGS');
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return;
  var headers = values[0];
  var statusCol = headers.indexOf('booking_status');
  var expiryCol = headers.indexOf('hold_expires_at');
  var now = new Date();
  for (var r = 1; r < values.length; r++) {
    if (values[r][statusCol] !== 'TEMP_HOLD') continue;
    var expiry = values[r][expiryCol];
    if (expiry && new Date(expiry) < now) {
      sheet.getRange(r + 1, statusCol + 1).setValue('EXPIRED');
    }
  }
}

/* ───────────────────────── availability ───────────────────────── */

function getAvailability_(payload) {
  expireHolds_();
  var locationId = String(payload.locationId);
  var horizon = Number(payload.days || config_('availability_days', 45));
  var slotStep = Number(config_('slot_interval_minutes', 120));
  var leadHours = Number(config_('minimum_lead_hours', 24));

  var hours = rows_('WORKING_HOURS').filter(function (h) {
    return String(h.location_id) === locationId && String(h.active).toUpperCase() !== 'FALSE';
  });
  var blocked = rows_('BLOCKED_DATES').filter(function (b) {
    return !b.location_id || String(b.location_id) === locationId;
  });
  var booked = rows_('BOOKINGS').filter(function (b) {
    return String(b.location) === locationId && LIVE_STATUSES.indexOf(String(b.booking_status)) >= 0;
  });

  var out = [];
  var today = new Date();
  var earliest = new Date(today.getTime() + leadHours * 3600000);

  for (var i = 0; i <= horizon; i++) {
    var day = new Date(today.getTime() + i * 86400000);
    var key = dateKey_(day);
    var dow = day.getDay();

    var todaysHours = hours.filter(function (h) { return Number(h.day_of_week) === dow; });
    if (!todaysHours.length) continue;

    var fullDayBlock = blocked.some(function (b) {
      return dateKey_(new Date(b.date)) === key && !b.start_time;
    });
    if (fullDayBlock) continue;

    var slots = [];
    todaysHours.forEach(function (h) {
      var start = toMinutes_(hhmm_(h.start_time));
      var end = toMinutes_(hhmm_(h.end_time));
      for (var m = start; m + slotStep <= end; m += slotStep) {
        var t = fromMinutes_(m);
        var when = new Date(key + 'T' + t + ':00');
        if (when < earliest) continue;

        var isBlocked = blocked.some(function (b) {
          if (dateKey_(new Date(b.date)) !== key || !b.start_time) return false;
          return m >= toMinutes_(hhmm_(b.start_time)) && m < toMinutes_(hhmm_(b.end_time));
        });
        if (isBlocked) return;

        var isBooked = booked.some(function (b) {
          return dateKey_(new Date(b.appointment_date)) === key && hhmm_(b.appointment_time) === t;
        });
        if (!isBooked && slots.indexOf(t) < 0) slots.push(t);
      }
    });

    if (slots.length) out.push({ date: key, slots: slots.sort() });
  }
  return out;
}

/* ───────────────────────── create booking ───────────────────────── */

function createBooking_(p) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // server-side locking prevents double booking
  try {
    expireHolds_();

    var taken = rows_('BOOKINGS').some(function (b) {
      return String(b.location) === String(p.locationId)
        && dateKey_(new Date(b.appointment_date)) === String(p.appointmentDate)
        && hhmm_(b.appointment_time) === String(p.appointmentTime)
        && LIVE_STATUSES.indexOf(String(b.booking_status)) >= 0;
    });
    if (taken) throw new Error('SLOT_TAKEN');

    var fee = Number(p.bookingFee || config_('booking_fee', 20000));
    var price = p.servicePrice === null || p.servicePrice === undefined ? '' : Number(p.servicePrice);
    var holdMinutes = Number(config_('hold_minutes', 45));
    var ref = makeRef_();
    var now = new Date();
    var expires = new Date(now.getTime() + holdMinutes * 60000);

    SS.getSheetByName('BOOKINGS').appendRow([
      ref,
      now,
      p.clientName,
      "'" + p.whatsapp,
      p.email || '',
      p.serviceName,
      p.locationId,
      '',
      p.appointmentDate,
      p.appointmentTime,
      price,
      fee,
      price === '' ? '' : price - fee,
      'UNPAID',
      'TEMP_HOLD',
      'NONE',
      p.notes || '',
      expires,
    ]);

    return {
      bookingId: ref,
      createdAt: now.toISOString(),
      clientName: p.clientName,
      whatsapp: p.whatsapp,
      email: p.email || null,
      serviceId: p.serviceId,
      serviceName: p.serviceName,
      locationId: p.locationId,
      locationName: p.locationName,
      artist: null,
      appointmentDate: p.appointmentDate,
      appointmentTime: p.appointmentTime,
      servicePrice: price === '' ? null : price,
      bookingFee: fee,
      balance: price === '' ? null : price - fee,
      paymentStatus: 'UNPAID',
      bookingStatus: 'TEMP_HOLD',
      holdExpiresAt: expires.toISOString(),
      notes: p.notes || null,
    };
  } finally {
    lock.releaseLock();
  }
}

function makeRef_() {
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var s = '';
  for (var i = 0; i < 6; i++) s += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return 'SC-' + s;
}

/* ───────────────────────── read booking ───────────────────────── */

function getBooking_(p) {
  expireHolds_();
  var ref = String(p.bookingId).toUpperCase();
  var row = rows_('BOOKINGS').filter(function (b) {
    return String(b.booking_id).toUpperCase() === ref;
  })[0];
  if (!row) return null;

  var price = row.service_price === '' ? null : Number(row.service_price);
  return {
    bookingId: String(row.booking_id),
    createdAt: new Date(row.created_at).toISOString(),
    clientName: String(row.client_name),
    whatsapp: String(row.whatsapp).replace(/^'/, ''),
    email: row.email || null,
    serviceId: '',
    serviceName: String(row.service),
    locationId: String(row.location),
    locationName: String(row.location),
    artist: row.artist || null,
    appointmentDate: dateKey_(new Date(row.appointment_date)),
    appointmentTime: hhmm_(row.appointment_time),
    servicePrice: price,
    bookingFee: Number(row.booking_fee),
    balance: row.balance === '' ? null : Number(row.balance),
    paymentStatus: String(row.payment_status),
    bookingStatus: String(row.booking_status),
    holdExpiresAt: row.hold_expires_at ? new Date(row.hold_expires_at).toISOString() : null,
    notes: row.notes || null,
  };
}
