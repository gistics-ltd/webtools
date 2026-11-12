"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { pricingConfig } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { fleet, largestVehicleSeats } from "@/data/fleet";
import { routes } from "@/data/routes";
import { formatNumber, formatUGX, formatUsdApprox } from "@/lib/format";
import {
  calculateEstimate,
  cheapestVehicle,
  defaultVehicleForPassengers,
  filterVehiclesBySeats,
} from "@/lib/pricing";
import {
  formatZodErrors,
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/lib/quote-schema";

type SuccessState = { requestId: string };
type FormFields = {
  fullName: string;
  phone: string;
  email: string;
  pickupDate: string;
  pickupLocation: string;
  notes: string;
  consent: boolean;
};

const emptyForm: FormFields = {
  fullName: "",
  phone: "",
  email: "",
  pickupDate: "",
  pickupLocation: "",
  notes: "",
  consent: false,
};

const driverOptions = [
  // { value: false, title: "Self-drive", description: "You drive the vehicle." },
  { value: true, title: "With driver", description: "A driver is included." },
] as const;

function kampalaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: siteConfig.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function NumberStepper({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  decreaseLabel,
  increaseLabel,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  const clamp = (next: number) => Math.min(max, Math.max(min, Number.isFinite(next) ? next : min));

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          aria-label={decreaseLabel}
          className="focusable inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:border-ink/30 hover:bg-paper"
        >
          <Minus aria-hidden="true" size={18} />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(clamp(Number.parseInt(event.target.value, 10)))}
          className="input-base max-w-24 text-center"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          aria-label={increaseLabel}
          className="focusable inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:border-ink/30 hover:bg-paper"
        >
          <Plus aria-hidden="true" size={18} />
        </button>
      </div>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}

export function QuoteCalculator() {
  const [passengers, setPassengers] = useState(2);
  const [days, setDays] = useState(2);
  const [routeId, setRouteId] = useState(routes[0]?.id ?? "");
  const [withDriver, setWithDriver] = useState(true);
  const [vehicleSlug, setVehicleSlug] = useState(
    () => defaultVehicleForPassengers(fleet, 2)?.slug ?? fleet[0]?.slug ?? "",
  );

  const eligibleVehicles = useMemo(() => filterVehiclesBySeats(fleet, passengers), [passengers]);
  const vehicle =
    eligibleVehicles.find((item) => item.slug === vehicleSlug) ?? cheapestVehicle(eligibleVehicles);
  const route = routes.find((item) => item.id === routeId) ?? routes[0];

  useEffect(() => {
    const onSelectVehicle = (event: Event) => {
      const detail = (event as CustomEvent<{ slug?: string }>).detail;
      if (!detail?.slug) return;
      const selected = fleet.find((item) => item.slug === detail.slug);
      if (!selected) return;
      setVehicleSlug(selected.slug);
      setPassengers((current) => (current > selected.seats ? 1 : current));
    };

    window.addEventListener("gistics:select-vehicle", onSelectVehicle);
    return () => window.removeEventListener("gistics:select-vehicle", onSelectVehicle);
  }, []);

  const estimate = useMemo(() => {
    if (!vehicle || !route) return null;
    return calculateEstimate({ vehicle, route, days, withDriver });
  }, [vehicle, route, days, withDriver]);

  const groupTooLarge = passengers > largestVehicleSeats;
  const longTerm = days > pricingConfig.maxStandardDays;
  const priced = estimate && !estimate.isCustomRoute ? estimate : null;

  const [showForm, setShowForm] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const minDate = useMemo(() => kampalaToday(), []);

  function openForm() {
    if (!showForm) {
      setStartedAt(new Date().toISOString());
      setShowForm(true);
      window.setTimeout(() => {
        formRef.current?.querySelector<HTMLInputElement>("input[name='fullName']")?.focus();
      }, 60);
      return;
    }

    formRef.current?.scrollIntoView({ block: "start" });
    formRef.current?.querySelector<HTMLInputElement>("input[name='fullName']")?.focus();
  }

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function buildMailto(payload: QuoteRequestInput, totalLabel: string): string {
    const subject = `Quote request: ${vehicle?.name ?? "Vehicle"} – ${payload.days} day(s) – ${route?.name ?? "Route"}`;
    const body = [
      "Hello Gistics Limited,",
      "",
      "Please confirm this car hire request:",
      `Name: ${payload.fullName}`,
      `Phone: ${payload.phone}`,
      `Email: ${payload.email}`,
      `Pickup date: ${payload.pickupDate}`,
      `Pickup location: ${payload.pickupLocation}`,
      `Vehicle: ${vehicle?.name ?? payload.vehicleSlug}`,
      `Passengers: ${payload.passengers}`,
      `Days: ${payload.days}`,
      `Route: ${route?.name ?? payload.routeId}`,
      `Driver: ${payload.withDriver ? "With driver" : "Self-drive"}`,
      `Estimate (excl. VAT): ${totalLabel}`,
      "",
      `Notes: ${payload.notes || "None"}`,
      "",
      "This request was prepared on the Gistics Limited website.",
    ].join("\n");
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!vehicle || !route) return;

    const payload = {
      passengers,
      vehicleSlug: vehicle.slug,
      routeId: route.id,
      days,
      withDriver,
      ...form,
      companyWebsite: honeypot,
      startedAt: startedAt ?? new Date().toISOString(),
    };

    const parsed = quoteRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors = formatZodErrors(parsed.error);
      setErrors(nextErrors);
      setServerError(null);
      const firstName = Object.keys(nextErrors)[0];
      if (firstName) {
        formRef.current
          ?.querySelector<HTMLElement>(`[name='${firstName}']`)
          ?.scrollIntoView({ block: "center" });
      }
      return;
    }

    setSubmitting(true);
    setServerError(null);
    setFallbackHref(null);

    const totalLabel = priced ? formatUGX(priced.totalExVatUGX) : "Price on request";

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok: true; requestId: string }
        | { ok: false; error?: string }
        | null;

      if (response.ok && data && "ok" in data && data.ok === true) {
        setSuccess({ requestId: data.requestId });
        return;
      }

      setServerError(
        data && "error" in data && data.error
          ? data.error
          : "We could not send your request just now. Please email us instead.",
      );
      setFallbackHref(buildMailto(parsed.data, totalLabel));
    } catch {
      setServerError(
        "We could not reach the quote service. Please email us instead.",
      );
      setFallbackHref(buildMailto(parsed.data, totalLabel));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const whatsappText = encodeURIComponent(
      `Hello Gistics, I have just sent a car hire quote request. Reference: ${success.requestId}`,
    );
    return (
      <div className="rounded-3xl border border-line bg-peach p-6 sm:p-8" role="status">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-ink" size={30} />
          <div>
            <h3 className="font-display text-3xl font-medium text-ink">Request received</h3>
            <p className="mt-2 text-ink-muted">
              Thank you, {form.fullName.split(" ")[0] || "there"}. We have sent your request to our
              team and will respond shortly.
            </p>
            <p className="mt-3 rounded-xl bg-frame px-4 py-3 font-mono text-sm font-bold text-gold">
              Reference: {success.requestId}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {/* {siteConfig.whatsapp.number ? (
            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${whatsappText}`}
              className="btn-dark"
              rel="noopener noreferrer"
              target="_blank"
            >
              Continue on WhatsApp
            </a>
          ) : null} */}
          <a href={`tel:${siteConfig.phone.tel}`} className="btn-outline-dark">
            <Phone aria-hidden="true" size={18} />
            Call the team
          </a>
          <button
            type="button"
            className="focusable rounded-md px-4 py-3 font-bold text-ink underline"
            onClick={() => {
              setSuccess(null);
              setForm(emptyForm);
              setShowForm(false);
              setStartedAt(null);
            }}
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
      <div className="rounded-3xl border border-line bg-surface p-5 text-ink sm:p-6">
        <h3 className="font-display text-2xl font-medium text-ink">1. Build your estimate</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Tell us the basics. Nothing is charged and no payment is taken online.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <NumberStepper
            id="passengers"
            label="Passengers / seats needed"
            hint={`Largest single vehicle: ${largestVehicleSeats} seats`}
            value={passengers}
            onChange={setPassengers}
            min={1}
            max={60}
            decreaseLabel="Remove one passenger"
            increaseLabel="Add one passenger"
          />
          <NumberStepper
            id="days"
            label="Number of days"
            hint="Rates are per day. Excludes VAT."
            value={days}
            onChange={setDays}
            min={1}
            max={365}
            decreaseLabel="Remove one day"
            increaseLabel="Add one day"
          />
        </div>

        {groupTooLarge ? (
          <div className="mt-5 rounded-2xl bg-blush p-4 text-sm text-ink">
            <p className="font-bold">For larger groups we can arrange multiple vehicles.</p>
            <p className="mt-1">
              Contact us with your group size and itinerary and we will put a suitable combination
              together.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href="#contact" className="btn-outline-dark !min-h-10 !px-4 !py-2 text-sm">
                Contact us
              </a>
              {siteConfig.whatsapp.number ? (
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  className="focusable inline-flex min-h-10 items-center rounded-full bg-ink px-4 py-2 text-sm font-bold text-brand-white"
                >
                  <Phone aria-hidden="true" size={16} />
                  Call
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-5">
          <div>
            <label htmlFor="vehicle" className="field-label">
              Vehicle
            </label>
            <select
              id="vehicle"
              value={vehicle?.slug ?? ""}
              onChange={(event) => setVehicleSlug(event.target.value)}
              className="input-base"
              disabled={eligibleVehicles.length === 0}
            >
              {eligibleVehicles.length === 0 ? (
                <option value="">No single vehicle available</option>
              ) : null}
              {eligibleVehicles.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} · {item.seats} seats
                  {item.disabledLook ? " (on request)" : ""}
                </option>
              ))}
            </select>
            <p className="field-hint">
              Available vehicles are filtered by the number of seats you need.{" "}
              {/* {vehicle ? `${vehicle.transmission}, ${vehicle.fuel.toLowerCase()}.` : ""} */}
            </p>
          </div>

          <div>
            <label htmlFor="route" className="field-label">
              Route
            </label>
            <select
              id="route"
              value={routeId}
              onChange={(event) => setRouteId(event.target.value)}
              className="input-base"
            >
              {routes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="field-label">Driver option</legend>
            <div className="grid grid-cols-2 gap-3">
              {driverOptions.map((option) => (
                <label key={option.title} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="driverOption"
                    checked={withDriver === option.value}
                    onChange={() => setWithDriver(option.value)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-16 flex-col justify-center rounded-2xl border border-line bg-surface px-3 py-2 text-sm text-ink peer-checked:border-ink peer-checked:bg-gold-soft peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                    <span className="inline-flex items-center gap-2 font-bold">
                      {option.value ? (
                        <UserRound aria-hidden="true" size={16} />
                      ) : (
                        <ShieldCheck aria-hidden="true" size={16} />
                      )}
                      {option.title}
                    </span>
                    <span className="mt-0.5 text-xs text-ink-muted">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {longTerm ? (
          <div className="mt-5 rounded-2xl bg-gold-soft p-4 text-sm text-ink">
            <p className="font-bold">Hire longer than 30 days?</p>
            <p className="mt-1">
              The online estimate is a starting point only. Contact us for long-term and monthly
              rates.
            </p>
            <a href="#contact" className="focusable mt-2 inline-block font-bold underline">
              Request long-term rates
            </a>
          </div>
        ) : null}
      </div>

      <div>
        <div
          className="rounded-3xl bg-frame p-5 text-brand-white shadow-[0_18px_50px_rgba(28,59,56,0.24)] sm:p-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3 className="text-sm font-bold tracking-[0.18em] text-gold uppercase">Your estimate</h3>

          {!vehicle || !route ? (
            <p className="mt-4 text-brand-white/70">
              Choose a vehicle and route, or contact us for a custom arrangement.
            </p>
          ) : estimate?.isCustomRoute ? (
            <div className="mt-4">
              <p className="text-3xl font-extrabold text-gold">Price on request</p>
              <p className="mt-2 text-sm text-brand-white/70">
                Custom routes need a quick review. Send the form and we will price it for you. You
                can still proceed now.
              </p>
            </div>
          ) : priced ? (
            <>
              <div className="mt-4">
                <p className="text-xs font-bold tracking-wide text-brand-white/55 uppercase">
                  Estimated total, excluding VAT
                </p>
                <p className="mt-1 text-4xl font-extrabold text-gold">
                  {formatUGX(priced.totalExVatUGX)}
                </p>
                <p className="mt-1 text-sm text-brand-white/75">
                  {formatUsdApprox(priced.usdApprox)} at {formatUGX(priced.usdRateUGX)}/US$
                </p>
              </div>

              <dl className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-brand-white/75">
                    {vehicle.name} × {formatNumber(days)} {days === 1 ? "day" : "days"}
                  </dt>
                  <dd className="shrink-0 font-semibold">{formatUGX(priced.baseUGX)}</dd>
                </div>
                {priced.discountPct > 0 ? (
                  <div className="flex justify-between gap-4 text-gold">
                    <dt>Long-stay discount ({priced.discountPct}%)</dt>
                    <dd className="shrink-0 font-semibold">−{formatUGX(priced.discountUGX)}</dd>
                  </div>
                ) : null}
                {priced.routeChargeUGX > 0 ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-brand-white/75">Route charge</dt>
                    <dd className="shrink-0 font-semibold">{formatUGX(priced.routeChargeUGX)}</dd>
                  </div>
                ) : null}
                {/* <div className="flex justify-between gap-4">
                  <dt className="text-brand-white/75">Driver fee</dt>
                  <dd className="shrink-0 font-semibold">
                    {priced.driverFeeUGX > 0 ? formatUGX(priced.driverFeeUGX) : "Not selected"}
                  </dd>
                </div> */}
                <div className="flex justify-between gap-4 border-t border-white/15 pt-2 text-base">
                  <dt className="font-bold text-brand-white">Total excl. VAT</dt>
                  <dd className="shrink-0 font-extrabold text-gold">
                    {formatUGX(priced.totalExVatUGX)}
                  </dd>
                </div>
              </dl>
            </>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-brand-white/60">
            Estimate only, excluding VAT ({pricingConfig.vatPct}%), and not a confirmed price. Final
            price depends on dates, availability and trip details.
          </p>

          {!groupTooLarge ? (
            <button
              type="button"
              onClick={openForm}
              className="btn-primary mt-5 w-full"
              aria-expanded={showForm}
              aria-controls="quote-form"
            >
              {showForm ? "Go to the form" : "Get my full quote"}
            </button>
          ) : null}
        </div>
      </div>

      {showForm && !groupTooLarge ? (
        <div
          id="quote-form"
          ref={formRef}
          className="rounded-3xl border border-line bg-surface p-5 text-ink sm:p-6 lg:col-span-2"
        >
          <h3 className="font-display text-2xl font-medium text-ink">2. Send your request</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Your estimate is recalculated on our end. We will confirm availability and the final
            price by email, phone or WhatsApp.
          </p>

          <div className="mt-4 rounded-2xl bg-frame p-4 text-sm text-brand-white">
            <p className="font-bold text-gold">Read-only estimate summary</p>
            <p className="mt-1 text-brand-white/85">
              {vehicle?.name} · {days} {days === 1 ? "day" : "days"} · {route?.name} ·{" "}
              {/* {withDriver ? "With driver" : "Self-drive"} */}
            </p>
            <p className="mt-1 font-extrabold">
              {priced ? `${formatUGX(priced.totalExVatUGX)} excl. VAT` : "Price on request"}
            </p>
          </div>

          <form className="mt-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="field-label">
                  Full name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className="input-base"
                />
                <FieldError id="fullName-error" message={errors.fullName} />
              </div>

              <div>
                <label htmlFor="phone" className="field-label">
                  Phone / WhatsApp <span aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="input-base"
                />
                <FieldError id="phone-error" message={errors.phone} />
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="input-base"
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              <div>
                <label htmlFor="pickupDate" className="field-label">
                  Pickup date <span aria-hidden="true">*</span>
                </label>
                <input
                  id="pickupDate"
                  name="pickupDate"
                  type="date"
                  min={minDate}
                  required
                  value={form.pickupDate}
                  onChange={(event) => updateField("pickupDate", event.target.value)}
                  aria-invalid={Boolean(errors.pickupDate)}
                  aria-describedby={errors.pickupDate ? "pickupDate-error" : undefined}
                  className="input-base"
                />
                <FieldError id="pickupDate-error" message={errors.pickupDate} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickupLocation" className="field-label">
                  Pickup location <span aria-hidden="true">*</span>
                </label>
                <input
                  id="pickupLocation"
                  name="pickupLocation"
                  autoComplete="street-address"
                  required
                  placeholder="Hotel, airport, office or neighbourhood"
                  value={form.pickupLocation}
                  onChange={(event) => updateField("pickupLocation", event.target.value)}
                  aria-invalid={Boolean(errors.pickupLocation)}
                  aria-describedby={errors.pickupLocation ? "pickupLocation-error" : undefined}
                  className="input-base"
                />
                <FieldError id="pickupLocation-error" message={errors.pickupLocation} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="field-label">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Flight number, itinerary, child seats, extra stops…"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="input-base min-h-24"
                />
                <FieldError id="notes-error" message={errors.notes} />
              </div>
            </div>

            <div
              className="absolute top-auto -left-[9999px] h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="companyWebsite">Company website</label>
              <input
                id="companyWebsite"
                name="companyWebsite"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="flex items-start gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  checked={form.consent}
                  onChange={(event) => updateField("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  className="mt-0.5 size-5 shrink-0 accent-ink"
                />
                <span>
                  I agree to be contacted by Gistics Limited about this request.
                  <span aria-hidden="true">*</span>
                </span>
              </label>
              <FieldError id="consent-error" message={errors.consent} />
            </div>

            {serverError ? (
              <div className="mt-4 rounded-2xl bg-blush p-4 text-sm text-ink" role="alert">
                <p className="flex items-start gap-2 font-bold">
                  <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
                  {serverError}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {fallbackHref ? (
                    <a
                      href={fallbackHref}
                      className="btn-outline-dark !min-h-10 !px-4 !py-2 text-sm"
                    >
                      Email us instead
                    </a>
                  ) : null}
                  {siteConfig.whatsapp.number ? (
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp.number}`}
                      className="btn-dark !min-h-10 !px-4 !py-2 text-sm"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      WhatsApp us
                    </a>
                  ) : null}
                  <a
                    href={`tel:${siteConfig.phone.tel}`}
                    className="focusable inline-flex min-h-10 items-center rounded-md px-2 py-2 text-sm font-bold underline"
                  >
                    Call the team
                  </a>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                    Sending…
                  </>
                ) : (
                  "Send my quote request"
                )}
              </button>
              <p className="text-xs text-ink-muted">
                No payment is taken online. We will confirm the final price before you book.
              </p>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
