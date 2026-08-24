/**
 * Single source of truth for St. Claire's business data.
 *
 * Only verified information supplied by the business is present here.
 * Anything unconfirmed is explicitly `null` / TBC and is rendered as a
 * "To be confirmed" marker in the UI. Never invent values in this file.
 */

export const BUSINESS = {
  name: "St. Claire's Beauty Clinic",
  brandLine: "Flawless Reflections by St. Claire",
  instagram: "https://www.instagram.com/st.clairesbeautyclinic/",
  instagramHandle: "@st.clairesbeautyclinic",
  phones: ["09033296288", "08138461997"],
  /** Primary WhatsApp line (international format, no plus). TO BE CONFIRMED which line is preferred. */
  whatsapp: "2349033296288",
  bookingFee: 20000,
  bank: {
    accountName: "Flawless Reflection by St.Claire",
    bankName: "Providus Bank",
    accountNumber: "5401862352",
  },
} as const;

export type LocationId = "ikeja" | "lekki";

export interface ClinicLocation {
  id: LocationId;
  name: string;
  address: string | null;
  phones: string[];
  /** Opening hours are not confirmed yet. */
  openingHours: string | null;
  active: boolean;
}

export const LOCATIONS: ClinicLocation[] = [
  {
    id: "ikeja",
    name: "Ikeja",
    address: "12 Amore Street, Off Toyin, Ikeja, Lagos",
    phones: ["09033296288", "08138461997"],
    openingHours: null,
    active: true,
  },
  {
    id: "lekki",
    name: "Lekki",
    address: null,
    phones: [],
    openingHours: null,
    active: false,
  },
];

export const getLocation = (id: LocationId) =>
  LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0]!;

export type CategoryId =
  | "spmu"
  | "brows-touch-up"
  | "brows-senior-artist"
  | "lashes"
  | "lip-eyeliner"
  | "facials"
  | "waxing"
  | "other";

export interface ServiceCategory {
  id: CategoryId;
  name: string;
  shortName: string;
  blurb: string;
  /** Whole menu still to be supplied by the business. */
  pending?: boolean;
}

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "spmu",
    name: "Semi-Permanent Makeup — Head Artist",
    shortName: "Brows / SPMU",
    blurb:
      "Brow artistry designed around your natural features — microblading, ombre, combo and nano techniques by our head artist.",
  },
  {
    id: "brows-touch-up",
    name: "Brows Touch-Up",
    shortName: "Touch-Ups",
    blurb:
      "Refresh and re-balance existing semi-permanent brows. Pricing depends on how long ago the original work was done.",
  },
  {
    id: "brows-senior-artist",
    name: "Brows — Senior Artist",
    shortName: "Senior Artist",
    blurb:
      "The same signature brow techniques with one of our senior artists.",
  },
  {
    id: "lashes",
    name: "Lashes",
    shortName: "Lashes",
    blurb:
      "Lash extensions mapped to your eye shape, from soft classic sets through to mega volume.",
  },
  {
    id: "lip-eyeliner",
    name: "Lip Blush & Eyeliner",
    shortName: "Lips & Liner",
    blurb:
      "Soft, defined colour for lips and lash lines — plus laser removal for previous work.",
  },
  {
    id: "facials",
    name: "Facials",
    shortName: "Facials",
    blurb: "Full facial menu to be confirmed by the clinic.",
    pending: true,
  },
  {
    id: "waxing",
    name: "Waxing",
    shortName: "Waxing",
    blurb: "Full waxing menu to be confirmed by the clinic.",
    pending: true,
  },
  {
    id: "other",
    name: "Other Services",
    shortName: "Other",
    blurb: "Additional services to be confirmed by the clinic.",
    pending: true,
  },
];

export const getCategory = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)!;

/**
 * A price is either a fixed amount, the same amount at both locations,
 * or a rule that cannot be expressed as a number (e.g. "Full price").
 */
export type Price =
  | { kind: "per-location"; ikeja: number; lekki: number }
  | { kind: "flat"; amount: number }
  | { kind: "rule"; label: string };

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: Price;
  /** Not confirmed yet — never invent. */
  durationMinutes: number | null;
  description: string;
  /** Locations where this service is offered. */
  locations: LocationId[];
  /** Bookable online (rule-priced items need a chat first). */
  bookable: boolean;
}

const perLoc = (ikeja: number, lekki: number): Price => ({
  kind: "per-location",
  ikeja,
  lekki,
});
const flat = (amount: number): Price => ({ kind: "flat", amount });
const rule = (label: string): Price => ({ kind: "rule", label });

const bothLocations: LocationId[] = ["ikeja", "lekki"];

export const SERVICES: Service[] = [
  // ── SPMU / Brows — Head Artist ──────────────────────────────────────────
  {
    id: "spmu-microblading",
    slug: "microblading",
    name: "Microblading",
    category: "spmu",
    price: perLoc(120000, 140000),
    durationMinutes: null,
    description:
      "Fine hair-like strokes drawn into the brow to build shape and density that reads as natural growth.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-ombre",
    slug: "ombre-brows",
    name: "Ombre Brows",
    category: "spmu",
    price: perLoc(130000, 150000),
    durationMinutes: null,
    description:
      "A soft shaded brow, lighter at the front and gradually deeper toward the tail, for a powdered finish.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-combo",
    slug: "combo-brows",
    name: "Combo Brows",
    category: "spmu",
    price: perLoc(135000, 155000),
    durationMinutes: null,
    description:
      "Hair strokes through the front of the brow blended into soft shading through the body and tail.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-nano-blading",
    slug: "nano-blading",
    name: "Nano Blading",
    category: "spmu",
    price: perLoc(202500, 222500),
    durationMinutes: null,
    description:
      "Hair strokes created with a digital nano needle for crisp, refined definition.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-nano-combo",
    slug: "nano-combo",
    name: "Nano Combo",
    category: "spmu",
    price: perLoc(262500, 282500),
    durationMinutes: null,
    description:
      "Nano hair strokes combined with soft shading — our most detailed brow service.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-henna-brows",
    slug: "henna-brows",
    name: "Henna Brows",
    category: "spmu",
    price: perLoc(23000, 28000),
    durationMinutes: null,
    description:
      "A temporary tint that stains both hair and skin to give fuller-looking brows for a few weeks.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-lamination-tint",
    slug: "brow-lamination-and-tint",
    name: "Brow Lamination & Tint",
    category: "spmu",
    price: perLoc(37000, 40000),
    durationMinutes: null,
    description:
      "Brow hairs are set upward and tinted for a fuller, brushed-up shape.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "spmu-laminated-henna",
    slug: "laminated-henna",
    name: "Laminated Henna",
    category: "spmu",
    price: perLoc(35000, 42000),
    durationMinutes: null,
    description:
      "Lamination and henna together — lifted brow hairs plus a tinted skin stain.",
    locations: bothLocations,
    bookable: true,
  },

  // ── Brows Touch-Up ──────────────────────────────────────────────────────
  {
    id: "touchup-4w-11m",
    slug: "touch-up-4-weeks-to-11-months",
    name: "Touch-Up — 4 weeks to 11 months",
    category: "brows-touch-up",
    price: perLoc(70000, 85000),
    durationMinutes: null,
    description:
      "For brows done by St. Claire's between 4 weeks and 11 months ago.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "touchup-4w-11m-nano",
    slug: "touch-up-4-weeks-to-11-months-nano",
    name: "Touch-Up — 4 weeks to 11 months (Nano)",
    category: "brows-touch-up",
    price: perLoc(90000, 105000),
    durationMinutes: null,
    description: "Nano touch-up for work done between 4 weeks and 11 months ago.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "touchup-1y-17m",
    slug: "touch-up-1-year-to-17-months",
    name: "Touch-Up — 1 year to 17 months",
    category: "brows-touch-up",
    price: perLoc(85000, 100000),
    durationMinutes: null,
    description: "For brows done by St. Claire's 1 year to 17 months ago.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "touchup-1y-17m-nano",
    slug: "touch-up-1-year-to-17-months-nano",
    name: "Touch-Up — 1 year to 17 months (Nano)",
    category: "brows-touch-up",
    price: perLoc(100000, 115000),
    durationMinutes: null,
    description: "Nano touch-up for work done 1 year to 17 months ago.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "touchup-18m-plus",
    slug: "touch-up-18-months-and-above",
    name: "Touch-Up — 18 months and above",
    category: "brows-touch-up",
    price: rule("Full price of the original service"),
    durationMinutes: null,
    description:
      "Work done 18 months ago or longer is charged at the full price of the service.",
    locations: bothLocations,
    bookable: false,
  },
  {
    id: "touchup-not-our-brows",
    slug: "touch-up-not-our-brows",
    name: "Touch-Up — not our brows",
    category: "brows-touch-up",
    price: rule("Full price of the service"),
    durationMinutes: null,
    description:
      "Work originally done elsewhere is charged at the full price of the service.",
    locations: bothLocations,
    bookable: false,
  },
  {
    id: "colour-correction",
    slug: "colour-correction",
    name: "Colour Correction",
    category: "brows-touch-up",
    price: flat(40000),
    durationMinutes: null,
    description: "Correcting the tone of existing semi-permanent brow work.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "colour-correction-with-service",
    slug: "colour-correction-with-service",
    name: "Colour Correction with Service",
    category: "brows-touch-up",
    price: rule("Full price + ₦40,000"),
    durationMinutes: null,
    description:
      "Colour correction carried out alongside a full brow service.",
    locations: bothLocations,
    bookable: false,
  },

  // ── Brows — Senior Artist ───────────────────────────────────────────────
  {
    id: "senior-microblading",
    slug: "senior-artist-microblading",
    name: "Microblading — Senior Artist",
    category: "brows-senior-artist",
    price: flat(85000),
    durationMinutes: null,
    description: "Microblading with one of our senior artists.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "senior-ombre",
    slug: "senior-artist-ombre",
    name: "Ombre — Senior Artist",
    category: "brows-senior-artist",
    price: flat(90000),
    durationMinutes: null,
    description: "Ombre brows with one of our senior artists.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "senior-combo",
    slug: "senior-artist-combo",
    name: "Combo — Senior Artist",
    category: "brows-senior-artist",
    price: flat(90000),
    durationMinutes: null,
    description: "Combo brows with one of our senior artists.",
    locations: bothLocations,
    bookable: true,
  },

  // ── Lashes ──────────────────────────────────────────────────────────────
  {
    id: "lash-classic",
    slug: "classic-lashes",
    name: "Classic Lashes",
    category: "lashes",
    price: perLoc(23000, 24000),
    durationMinutes: null,
    description: "One extension applied to each natural lash for a defined, everyday finish.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lash-hybrid",
    slug: "hybrid-lashes",
    name: "Hybrid Lashes",
    category: "lashes",
    price: perLoc(28000, 30000),
    durationMinutes: null,
    description: "A mix of classic and volume fans for texture with a little more fullness.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lash-volume",
    slug: "volume-lashes",
    name: "Volume Lashes",
    category: "lashes",
    price: perLoc(35000, 37000),
    durationMinutes: null,
    description: "Handmade fans for a soft, dense lash line.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lash-mega-volume",
    slug: "mega-volume-lashes",
    name: "Mega Volume Lashes",
    category: "lashes",
    price: perLoc(42000, 45000),
    durationMinutes: null,
    description: "Our fullest, darkest lash set.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lash-wispy-extra",
    slug: "wispy-extra",
    name: "Wispy Extra",
    category: "lashes",
    price: flat(8000),
    durationMinutes: null,
    description: "Add wispy spikes to any lash set.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lash-removal",
    slug: "lash-removal",
    name: "Lash Removal",
    category: "lashes",
    price: flat(5000),
    durationMinutes: null,
    description: "Safe removal of existing lash extensions.",
    locations: bothLocations,
    bookable: true,
  },

  // ── Lip Blush & Eyeliner ────────────────────────────────────────────────
  {
    id: "lip-one",
    slug: "one-lip",
    name: "One Lip",
    category: "lip-eyeliner",
    price: perLoc(90000, 110000),
    durationMinutes: null,
    description: "Lip blush colour on a single lip.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "lip-both",
    slug: "both-lips",
    name: "Both Lips",
    category: "lip-eyeliner",
    price: perLoc(120000, 140000),
    durationMinutes: null,
    description: "Full lip blush — soft, even colour across both lips.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "wing-eyeliner",
    slug: "wing-eyeliner",
    name: "Wing Eyeliner",
    category: "lip-eyeliner",
    price: perLoc(80000, 100000),
    durationMinutes: null,
    description: "Semi-permanent winged liner along the lash line.",
    locations: bothLocations,
    bookable: true,
  },
  {
    id: "laser-removal",
    slug: "laser-removal",
    name: "Laser Removal",
    category: "lip-eyeliner",
    price: flat(40000),
    durationMinutes: null,
    description: "Laser removal of existing semi-permanent pigment.",
    locations: bothLocations,
    bookable: true,
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

export const servicesByCategory = (id: CategoryId) =>
  SERVICES.filter((s) => s.category === id);

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

export function priceFor(price: Price, location?: LocationId): string {
  if (price.kind === "rule") return price.label;
  if (price.kind === "flat") return formatNaira(price.amount);
  if (!location)
    return `${formatNaira(price.ikeja)} / ${formatNaira(price.lekki)}`;
  return formatNaira(location === "ikeja" ? price.ikeja : price.lekki);
}

export function priceAmount(
  price: Price,
  location: LocationId,
): number | null {
  if (price.kind === "rule") return null;
  if (price.kind === "flat") return price.amount;
  return location === "ikeja" ? price.ikeja : price.lekki;
}
