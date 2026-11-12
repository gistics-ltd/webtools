import { z } from "zod";
import { fleet } from "@/data/fleet";
import { routes } from "@/data/routes";

const MAX_PASSENGERS = 60;

const kampalaToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Enter a valid date")
  .refine((value) => value >= kampalaToday(), "Choose today or a future date");

const vehicleSlug = z
  .string()
  .trim()
  .min(1, "Choose a vehicle")
  .refine((value) => fleet.some((vehicle) => vehicle.slug === value), "Choose a vehicle from the list");

const routeId = z
  .string()
  .trim()
  .min(1, "Choose a route")
  .refine((value) => routes.some((route) => route.id === value), "Choose a route from the list");

export const estimateSelectionSchema = z.object({
  passengers: z.coerce
    .number()
    .int("Enter a whole number of passengers")
    .min(1, "At least one passenger is required")
    .max(MAX_PASSENGERS, "Contact us for groups larger than 60"),
  vehicleSlug,
  routeId,
  days: z.coerce
    .number()
    .int("Enter a whole number of days")
    .min(1, "At least one day is required")
    .max(365, "Contact us for hires longer than a year"),
  withDriver: z.boolean(),
});

export const quoteRequestSchema = estimateSelectionSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Keep your name under 100 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number we can reach you on")
    .max(30, "Keep your phone number under 30 characters")
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces, brackets, + or - only"),
  email: z
    .string()
    .trim()
    .max(254, "Keep your email under 254 characters")
    .email("Enter a valid email address"),
  pickupDate: isoDate,
  pickupLocation: z
    .string()
    .trim()
    .min(2, "Enter a pickup location")
    .max(200, "Keep the pickup location under 200 characters"),
  notes: z.string().trim().max(2_000, "Keep notes under 2,000 characters").optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree to be contacted before sending",
  }),
  /** Honeypot. Real users leave this empty; the route silently accepts bots. */
  companyWebsite: z.string().max(200).optional(),
  /** ISO timestamp set when the quote form is revealed. */
  startedAt: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid form timestamp"),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type EstimateSelectionInput = z.infer<typeof estimateSelectionSchema>;

export const quoteLimits = {
  maxPassengers: MAX_PASSENGERS,
} as const;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) {
      result[key] = issue.message;
    }
  }
  return result;
}
