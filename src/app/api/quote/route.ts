import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getVehicleBySlug } from "@/data/fleet";
import { getRouteById } from "@/data/routes";
import { isSmtpConfigured, sendQuoteEmails } from "@/lib/email";
import { calculateEstimate } from "@/lib/pricing";
import { checkRateLimit } from "@/lib/rate-limit";
import { formatZodErrors, quoteRequestSchema } from "@/lib/quote-schema";

export const runtime = "nodejs";

const MIN_SUBMIT_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function newRequestId(): string {
  return `GST-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = checkRateLimit(`quote:${ip}`);

  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "RATE_LIMITED",
        error: "Too many requests from this connection. Please try again later or send us an email.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_JSON", error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION",
        error: "Please check the highlighted fields and try again.",
        fields: formatZodErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot: pretend success so bots do not learn the trap.
  if (data.companyWebsite && data.companyWebsite.trim().length > 0) {
    return NextResponse.json({ ok: true, requestId: newRequestId() });
  }

  const startedAt = Date.parse(data.startedAt);
  const age = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || age < MIN_SUBMIT_MS || age > MAX_FORM_AGE_MS) {
    return NextResponse.json(
      {
        ok: false,
        code: "TIMING",
        error: "Please take a moment to review the form, then try sending it again.",
      },
      { status: 400 },
    );
  }

  const vehicle = getVehicleBySlug(data.vehicleSlug);
  const route = getRouteById(data.routeId);

  if (!vehicle || !route) {
    return NextResponse.json(
      { ok: false, code: "UNKNOWN_OPTION", error: "Choose a vehicle and route from the list." },
      { status: 400 },
    );
  }

  if (data.passengers > vehicle.seats) {
    return NextResponse.json(
      {
        ok: false,
        code: "SEATS",
        error: "That vehicle has fewer seats than your group. Please choose a larger vehicle.",
      },
      { status: 400 },
    );
  }

  // Never trust a client-provided price: recompute from config/data.
  const estimate = calculateEstimate({
    vehicle,
    route,
    days: data.days,
    withDriver: data.withDriver,
  });

  if (!isSmtpConfigured()) {
    console.error("[quote] SMTP is not configured; request could not be emailed");
    return NextResponse.json(
      {
        ok: false,
        code: "EMAIL_UNAVAILABLE",
        error:
          "Our email service is not available right now. Please use the email below so your request is not lost.",
      },
      { status: 503 },
    );
  }

  const requestId = newRequestId();
  const submittedAt = new Date();

  try {
    await sendQuoteEmails({
      request: data,
      vehicleName: vehicle.name,
      routeName: route.name,
      estimate,
      requestId,
      submittedAt,
    });

    return NextResponse.json({ ok: true, requestId });
  } catch (error) {
    // Log server-side only; never leak mail credentials, stack traces or PII.
    console.error(
      "[quote] failed to send quote email",
      requestId,
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      {
        ok: false,
        code: "SEND_FAILED",
        error:
          "We could not send your request just now. Please use the email below so your request is not lost.",
      },
      { status: 502 },
    );
  }
}
