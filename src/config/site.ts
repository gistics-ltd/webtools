/**
 * Central business configuration.
 */

export type OpeningHours = {
  /** Schema.org day names. */
  days: string[];
  /** Human-readable label. */
  label: string;
  opens: string | null;
  closes: string | null;
};

export const siteConfig = {
  name: "Gistics Limited",
  shortName: "Gistics",
  legalName: "Gistics Limited",
  tagline: "We get you there.",
  description:
    "Car hire in Kampala and across Uganda, with chauffeur-driven vehicles for city trips, airport transfers, long-distance and corporate travel.",
  locale: "en_UG",
  lang: "en-UG",
  currency: "UGX",
  timeZone: "Africa/Kampala",

  phone: {
    display: "+256 760 980 640",
    tel: "+256760980640",
  },
  whatsapp: {
    display: null,
    number: null,
  },
  email: "gisticslimited19@gmail.com",

  address: {
    street: "Nosep Building Plot 104, Semawata Road, Ntinda",
    city: "Kampala",
    region: "Central Region",
    country: "UG",
    countryName: "Uganda",
    postalCode: null as string | null,
  },

  // Approximate Kampala city-centre coordinates.
  // [[CONFIRM: exact office coordinates]]
  geo: {
    latitude: 0.3492185,
    longitude: 32.6121871,
  },

  // [[CONFIRM: real opening hours, including public holidays]]
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      label: "Monday to Friday",
      opens: "09:00",
      closes: "17:00",
    },
    {
      days: ["Saturday"],
      label: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
    {
      days: ["Sunday"],
      label: "Sunday",
      opens: "09:00",
      closes: "14:00",
    },
  ] satisfies OpeningHours[],

  priceRange: "UGX",

  // [[CONFIRM: social profile URLs (Facebook, Instagram, LinkedIn, X)]]
  socialProfiles: [] as string[],

  map: {
    embedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.74421135037!2d32.6121870754591!3d0.3492184639738368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dba32f3e64b39%3A0x73cd106bbeabc4fc!2s104%20Semawata%20Rd%2C%20Kampala!5e0!3m2!1sen!2sug!4v1794291540020!5m2!1sen!2sug",
    directionsQuery: "Plot 104, Semawata Road, Ntinda",
  },
} as const;

export const fullAddress = [
  siteConfig.address.street,
  siteConfig.address.city,
  siteConfig.address.region,
  siteConfig.address.countryName,
]
  .filter(Boolean)
  .join(", ");
