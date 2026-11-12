import { describe, expect, it } from "vitest";
import { pricingConfig } from "@/config/pricing";
import { fleet } from "@/data/fleet";
import { routes } from "@/data/routes";
import {
  calculateEstimate,
  cheapestVehicle,
  defaultVehicleForPassengers,
  filterVehiclesBySeats,
  getLongStayDiscountPct,
  roundToNearest,
} from "./pricing";

const prado = fleet.find((vehicle) => vehicle.slug === "toyota-land-cruiser-prado")!;
const kampala = routes.find((route) => route.id === "within-kampala-wakiso")!;
const airports = routes.find((route) => route.id === "entebbe-airport-kampala")!;
const custom = routes.find((route) => route.id === "custom")!;

describe("roundToNearest", () => {
  it("rounds to the nearest 1,000 UGX", () => {
    expect(roundToNearest(1_234, 1_000)).toBe(1_000);
    expect(roundToNearest(1_500, 1_000)).toBe(2_000);
    expect(roundToNearest(1_000, 1_000)).toBe(1_000);
  });

  it("falls back to whole-number rounding for a non-positive step", () => {
    expect(roundToNearest(12.6, 0)).toBe(13);
  });
});

describe("getLongStayDiscountPct", () => {
  it("returns no discount below seven days", () => {
    expect(getLongStayDiscountPct(1)).toBe(0);
    expect(getLongStayDiscountPct(6)).toBe(0);
  });

  it("applies the configured tier at each threshold", () => {
    for (const tier of pricingConfig.longStayTiers) {
      expect(getLongStayDiscountPct(tier.minDays)).toBe(tier.discountPct);
    }
    expect(getLongStayDiscountPct(365)).toBe(
      pricingConfig.longStayTiers[0]?.discountPct ?? 0,
    );
  });
});

describe("calculateEstimate", () => {
  it("calculates base, route fee, driver fee and excludes VAT", () => {
    const result = calculateEstimate({
      vehicle: prado,
      route: airports,
      days: 3,
      withDriver: true,
    });

    expect(result.isCustomRoute).toBe(false);
    if (result.isCustomRoute) return;

    expect(result.baseUGX).toBe(1_350_000);
    expect(result.routeChargeUGX).toBe(150_000);
    expect(result.driverFeeUGX).toBe(360_000);
    expect(result.discountPct).toBe(0);
    expect(result.totalExVatUGX).toBe(1_860_000);
    expect(result.vatUGX).toBe(335_000);
    expect(result.totalIncVatUGX).toBe(2_195_000);
  });

  it("applies the long-stay discount to the vehicle base only", () => {
    const result = calculateEstimate({
      vehicle: prado,
      route: kampala,
      days: 7,
      withDriver: false,
    });

    if (result.isCustomRoute) throw new Error("expected priced estimate");
    const base = prado.dailyRateUGX * 7;
    const discount = base * (result.discountPct / 100);
    expect(result.discountPct).toBe(getLongStayDiscountPct(7));
    expect(result.discountUGX).toBe(Math.round(discount));
    expect(result.totalExVatUGX).toBe(roundToNearest(base - discount, pricingConfig.roundToUGX));
  });

  it("adds the route uplift percentage on top of the base", () => {
    const bwindi = routes.find((route) => route.id === "kampala-bwindi-kabale")!;
    const result = calculateEstimate({
      vehicle: prado,
      route: bwindi,
      days: 4,
      withDriver: false,
    });

    if (result.isCustomRoute) throw new Error("expected priced estimate");
    expect(result.baseUGX).toBe(1_800_000);
    expect(result.routeChargeUGX).toBe(1_160_000);
    expect(result.totalExVatUGX).toBe(2_960_000);
  });

  it("returns no auto-estimate for custom routes", () => {
    const result = calculateEstimate({
      vehicle: prado,
      route: custom,
      days: 5,
      withDriver: true,
    });
    expect(result).toEqual({ isCustomRoute: true });
  });

  it("rounds the total to the nearest 1,000 UGX", () => {
    const result = calculateEstimate({
      vehicle: prado,
      route: kampala,
      days: 1,
      withDriver: true,
    });

    if (result.isCustomRoute) throw new Error("expected priced estimate");
    expect(result.totalExVatUGX % 1_000).toBe(0);
  });

  it("treats zero or negative days as one day", () => {
    const result = calculateEstimate({
      vehicle: prado,
      route: kampala,
      days: 0,
      withDriver: false,
    });
    if (result.isCustomRoute) throw new Error("expected priced estimate");
    expect(result.baseUGX).toBe(prado.dailyRateUGX);
  });
});

describe("seat filtering", () => {
  it("returns only vehicles with at least the requested seats", () => {
    const eligible = filterVehiclesBySeats(fleet, 8);
    expect(eligible.length).toBeGreaterThan(0);
    expect(eligible.every((vehicle) => vehicle.seats >= 8)).toBe(true);
  });

  it("returns no vehicles when the group is larger than the fleet", () => {
    expect(filterVehiclesBySeats(fleet, 60)).toEqual([]);
  });

  it("normalises fractional and zero passenger counts", () => {
    expect(filterVehiclesBySeats(fleet, 0).length).toBe(fleet.length);
    expect(filterVehiclesBySeats(fleet, 4.8).length).toBe(filterVehiclesBySeats(fleet, 4).length);
  });

  it("defaults to the cheapest eligible vehicle", () => {
    const cheapest = defaultVehicleForPassengers(fleet, 4);
    const eligible = filterVehiclesBySeats(fleet, 4);
    expect(cheapest).toEqual(cheapestVehicle(eligible));
  });
});
