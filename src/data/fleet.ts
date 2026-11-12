export type Transmission = "Automatic" | "Manual";

export type Vehicle = {
  slug: string;
  name: string;
  seats: number;
  transmission: Transmission;
  fuel: string;
  features: string[];
  /** Excluding VAT. Placeholder values only. */
  // [[CONFIRM: real daily rate for every vehicle]]
  dailyRateUGX: number;
  // [[CONFIRM: real driver fee for every vehicle]]
  driverFeePerDayUGX: number;
  image: string;
  imageAlt: string;
  /** Placeholder vehicles are shown with a muted, "on request" treatment. */
  disabledLook?: boolean;
  badge?: string;
};

/**
 * Placeholder fleet. Every specification and rate below is unconfirmed.
 * [[CONFIRM: exact fleet list, seats, transmission, fuel and rates]]
 */
export const fleet: Vehicle[] = [
  {
    slug: "toyota-land-cruiser-prado-tx",
    name: "Toyota Land Cruiser Prado TX",
    seats: 6,
    transmission: "Automatic",
    fuel: "Petrol",
    features: [
      "Comfortable 7-seat 4x4",
      "Air conditioning",
      "Good for upcountry roads",
      "Luggage space for safari bags",
    ],
    dailyRateUGX: 300_000,
    driverFeePerDayUGX: 0,
    image: "/images/fleet/toyota-land-cruiser-prado.jpg",
    imageAlt: "Toyota Land Cruiser Prado 4x4 available for car hire in Kampala",
    badge: "Popular",
  },
  {
    slug: "toyota-land-cruiser-v8",
    name: "Toyota Land Cruiser V8",
    seats: 6,
    transmission: "Automatic",
    fuel: "Petrol",
    features: [
      "Premium full-size 4x4",
      "Air conditioning",
      "Strong for long safari routes",
      "Generous luggage capacity",
    ],
    dailyRateUGX: 500_000,
    driverFeePerDayUGX: 0,
    image: "/images/fleet/toyota-land-cruiser-v8.jpg",
    imageAlt: "Toyota Land Cruiser V8 for chauffeur-driven safari car hire in Uganda",
  },
  {
    slug: "toyota-hiace-van",
    name: "Toyota Hiace van",
    seats: 12,
    transmission: "Automatic",
    fuel: "Petrol",
    features: [
      "14-seat passenger van",
      "Air conditioning",
      "Good for groups and staff transport",
      "Roof luggage space on request",
    ],
    dailyRateUGX: 400_000,
    driverFeePerDayUGX: 0,
    image: "/images/fleet/toyota-hiace-van.jpg",
    imageAlt: "Toyota Hiace 14-seat van for group car hire in Kampala",
    disabledLook: true,
    badge: "On request",
  },
  // {
  //   slug: "safari-land-cruiser-pop-up",
  //   name: "Safari Land Cruiser with pop-up roof",
  //   seats: 6,
  //   transmission: "Manual",
  //   fuel: "Diesel",
  //   features: [
  //     "Pop-up roof for game viewing",
  //     "Air conditioning",
  //     "Built for national park tracks",
  //     "Cool box space on request",
  //   ],
  //   dailyRateUGX: 700_000,
  //   driverFeePerDayUGX: 150_000,
  //   image: "/images/fleet/safari-land-cruiser-pop-up.jpg",
  //   imageAlt: "Safari Land Cruiser with pop-up roof for Uganda national park car hire",
  //   disabledLook: true,
  //   badge: "On request",
  // },
  // {
  //   slug: "toyota-alphard-noah",
  //   name: "Toyota Alphard / Noah",
  //   seats: 8,
  //   transmission: "Automatic",
  //   fuel: "Petrol",
  //   features: [
  //     "Comfortable people carrier",
  //     "Air conditioning",
  //     "Good for airport transfers",
  //     "Flexible seating and luggage",
  //   ],
  //   dailyRateUGX: 400_000,
  //   driverFeePerDayUGX: 100_000,
  //   image: "/images/fleet/toyota-alphard-noah.jpg",
  //   imageAlt: "Toyota Alphard people carrier for Kampala airport transfers",
  //   disabledLook: true,
  //   badge: "On request",
  // },
  // {
  //   slug: "toyota-coaster-bus",
  //   name: "Toyota Coaster",
  //   seats: 29,
  //   transmission: "Manual",
  //   fuel: "Diesel",
  //   features: [
  //     "29-seat minibus",
  //     "Air conditioning",
  //     "For large groups and events",
  //     "Driver included on request",
  //   ],
  //   dailyRateUGX: 600_000,
  //   driverFeePerDayUGX: 150_000,
  //   image: "/images/fleet/toyota-coaster-bus.jpg",
  //   imageAlt: "Toyota Coaster bus for large group and event car hire in Uganda",
  //   disabledLook: true,
  //   badge: "On request",
  // },
  // {
  //   slug: "toyota-premio-allion",
  //   name: "Toyota Premio / Allion",
  //   seats: 4,
  //   transmission: "Automatic",
  //   fuel: "Petrol",
  //   features: [
  //     "Affordable sedan",
  //     "Air conditioning",
  //     "Easy to drive in Kampala traffic",
  //     "Good for city meetings",
  //   ],
  //   dailyRateUGX: 250_000,
  //   driverFeePerDayUGX: 80_000,
  //   image: "/images/fleet/toyota-premio-allion.jpg",
  //   imageAlt: "Toyota Premio sedan for affordable self-drive car hire in Kampala",
  //   disabledLook: true,
  //   badge: "On request",
  // },
];

export const largestVehicleSeats = Math.max(...fleet.map((vehicle) => vehicle.seats));

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return fleet.find((vehicle) => vehicle.slug === slug);
}
