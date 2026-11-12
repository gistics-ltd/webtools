import { describe, expect, it } from "vitest";
import { formatZodErrors, quoteRequestSchema } from "./quote-schema";

const validRequest = {
  passengers: 2,
  vehicleSlug: "toyota-land-cruiser-prado",
  routeId: "entebbe-airport-kampala",
  days: 3,
  withDriver: true,
  fullName: "Test Customer",
  phone: "+256 700 000 000",
  email: "customer@example.com",
  pickupDate: "2099-01-15",
  pickupLocation: "Entebbe International Airport",
  notes: "Arriving on KQ 410.",
  consent: true,
  companyWebsite: "",
  startedAt: new Date("2099-01-01T10:00:00.000Z").toISOString(),
};

describe("quoteRequestSchema", () => {
  it("accepts a valid request", () => {
    const result = quoteRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("coerces numeric fields from strings", () => {
    const result = quoteRequestSchema.safeParse({
      ...validRequest,
      passengers: "4",
      days: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passengers).toBe(4);
      expect(result.data.days).toBe(10);
    }
  });

  it("rejects an unknown vehicle", () => {
    const result = quoteRequestSchema.safeParse({
      ...validRequest,
      vehicleSlug: "space-shuttle",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown route", () => {
    const result = quoteRequestSchema.safeParse({ ...validRequest, routeId: "moon" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = quoteRequestSchema.safeParse({ ...validRequest, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires consent", () => {
    const result = quoteRequestSchema.safeParse({ ...validRequest, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects zero days and zero passengers", () => {
    expect(quoteRequestSchema.safeParse({ ...validRequest, days: 0 }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...validRequest, passengers: 0 }).success).toBe(false);
  });

  it("rejects a pickup date in the past", () => {
    const result = quoteRequestSchema.safeParse({
      ...validRequest,
      pickupDate: "2000-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(
      quoteRequestSchema.safeParse({ ...validRequest, pickupDate: "15/01/2099" }).success,
    ).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    expect(quoteRequestSchema.safeParse({ ...validRequest, phone: "call me" }).success).toBe(
      false,
    );
  });
});

describe("formatZodErrors", () => {
  it("returns the first message for each field", () => {
    const result = quoteRequestSchema.safeParse({
      ...validRequest,
      email: "nope",
      fullName: "",
    });
    if (result.success) throw new Error("expected validation failure");
    const errors = formatZodErrors(result.error);
    expect(errors.email).toContain("valid email");
    expect(errors.fullName).toContain("full name");
  });
});
