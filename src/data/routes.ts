export type Route = {
  id: string;
  name: string;
  /** One-off route/transfer charge in UGX. */
  flatFeeUGX: number;
  /** Additional percentage of the vehicle base charged for this route (0.1 = 10%). */
  perDayUpliftPct: number;
  /** Custom routes cannot be auto-priced. */
  custom?: boolean;
};

/**
 * Placeholder route pricing. All fees and uplifts are invented for the MVP.
 * [[CONFIRM: real route fees and upcountry uplifts]]
 */
export const routes: Route[] = [
  {
    id: "within-kampala-wakiso",
    name: "Within Kampala / Wakiso",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  {
    id: "entebbe-airport-kampala",
    name: "Entebbe Airport ⇄ Kampala",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  { id: "kampala-jinja", name: "Kampala–Jinja", flatFeeUGX: 200_000, perDayUpliftPct: 0 },
  {
    id: "kampala-mbarara",
    name: "Kampala–Mbarara",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  {
    id: "kampala-fort-portal-kibale",
    name: "Kampala–Fort Portal / Kibale",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  {
    id: "kampala-bwindi-kabale",
    name: "Kampala–Bwindi / Kabale",
    flatFeeUGX: 600_000,
    perDayUpliftPct: 0,
  },
  {
    id: "kampala-mbale-elgon",
    name: "Kampala–Mbale / Mt Elgon",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  {
    id: "kampala-gulu",
    name: "Kampala–Gulu / Northern Uganda",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
  },
  // {
  //   id: "cross-border",
  //   name: "Cross-border (Kenya / Rwanda)",
  //   flatFeeUGX: 0,
  //   perDayUpliftPct: 0,
  // },
  {
    id: "custom",
    name: "Other / custom route",
    flatFeeUGX: 0,
    perDayUpliftPct: 0,
    custom: true,
  },
];

export function getRouteById(id: string): Route | undefined {
  return routes.find((route) => route.id === id);
}
