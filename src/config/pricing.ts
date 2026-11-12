/**
 * Pricing rules. Every number here is an obviously fake placeholder.
 */
export const pricingConfig = {
  currency: "UGX",
  vatPct: 18,
  roundToUGX: 1_000,

  /** Display-only USD conversion. Not a live FX rate. */
  usdDisplayRateUGX: 3_800,

  /** 1–30 days is the normal online range; longer stays are quoted manually. */
  maxStandardDays: 30,
  minDays: 1,
  maxDays: 365,

  /** Highest matching tier wins. Discount applies to the vehicle base only. */
  longStayTiers: [
    { minDays: 30, discountPct: 0 },
    { minDays: 14, discountPct: 0 },
    { minDays: 7, discountPct: 0 },
  ],
} as const;

export type LongStayTier = (typeof pricingConfig.longStayTiers)[number];
