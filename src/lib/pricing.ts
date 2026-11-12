import { pricingConfig } from "@/config/pricing";
import type { Route } from "@/data/routes";
import type { Vehicle } from "@/data/fleet";

export type EstimateSelection = {
  vehicle: Vehicle;
  route: Route;
  days: number;
  withDriver: boolean;
};

export type EstimateBreakdown = {
  baseUGX: number;
  discountPct: number;
  discountUGX: number;
  routeChargeUGX: number;
  driverFeeUGX: number;
  subtotalUGX: number;
  totalExVatUGX: number;
  vatPct: number;
  vatUGX: number;
  totalIncVatUGX: number;
  usdApprox: number;
  usdRateUGX: number;
  isCustomRoute: false;
};

export type EstimateResult = EstimateBreakdown | { isCustomRoute: true };

export function roundToNearest(value: number, step: number): number {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
}

export function getLongStayDiscountPct(days: number): number {
  for (const tier of pricingConfig.longStayTiers) {
    if (days >= tier.minDays) return tier.discountPct;
  }
  return 0;
}

/**
 * PURE estimate function shared by the browser and the API route.
 *
 * base       = daily rate × days
 * routeCost  = route flat fee + (base × route uplift %)
 * driverCost = driver daily fee × days (only when a driver is selected)
 * discount   = base × long-stay %
 * total      = roundToNearest1000(base + routeCost + driverCost − discount)
 *
 * Custom routes return { isCustomRoute: true } because they cannot be priced
 * automatically. VAT is excluded from the total and reported separately.
 */
export function calculateEstimate(selection: EstimateSelection): EstimateResult {
  if (selection.route.custom) {
    return { isCustomRoute: true };
  }

  const { vehicle, route, withDriver } = selection;
  const days = Math.max(1, Math.floor(selection.days));

  const base = vehicle.dailyRateUGX * days;
  const routeCharge = route.flatFeeUGX + base * route.perDayUpliftPct;
  const driverFee = withDriver ? vehicle.driverFeePerDayUGX * days : 0;
  const discountPct = getLongStayDiscountPct(days);
  const discount = base * (discountPct / 100);

  const subtotal = base + routeCharge + driverFee;
  const totalExVat = roundToNearest(subtotal - discount, pricingConfig.roundToUGX);
  const vat = roundToNearest(totalExVat * (pricingConfig.vatPct / 100), pricingConfig.roundToUGX);

  return {
    baseUGX: base,
    discountPct,
    discountUGX: Math.round(discount),
    routeChargeUGX: Math.round(routeCharge),
    driverFeeUGX: Math.round(driverFee),
    subtotalUGX: Math.round(subtotal),
    totalExVatUGX: totalExVat,
    vatPct: pricingConfig.vatPct,
    vatUGX: Math.round(vat),
    totalIncVatUGX: roundToNearest(totalExVat + vat, pricingConfig.roundToUGX),
    usdApprox: Math.round(totalExVat / pricingConfig.usdDisplayRateUGX),
    usdRateUGX: pricingConfig.usdDisplayRateUGX,
    isCustomRoute: false,
  };
}

/** Seat filtering used by the client filter and unit tests. */
export function filterVehiclesBySeats(vehicles: Vehicle[], passengers: number): Vehicle[] {
  const seats = Math.max(1, Math.floor(passengers));
  return vehicles.filter((vehicle) => vehicle.seats >= seats);
}

/** Cheapest eligible vehicle; ties keep the source order. */
export function cheapestVehicle(vehicles: Vehicle[]): Vehicle | undefined {
  return [...vehicles].sort((a, b) => a.dailyRateUGX - b.dailyRateUGX)[0];
}

export function defaultVehicleForPassengers(
  vehicles: Vehicle[],
  passengers: number,
): Vehicle | undefined {
  return cheapestVehicle(filterVehiclesBySeats(vehicles, passengers));
}
