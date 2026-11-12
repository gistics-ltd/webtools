import { Fuel, Gauge, Users } from "lucide-react";
import Image from "next/image";
import { QuoteRequestButton } from "@/components/fleet/QuoteRequestButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fleet } from "@/data/fleet";
import { formatUGX } from "@/lib/format";

export function FleetSection() {
  return (
    <section id="fleet" className="section-pad bg-paper" aria-labelledby="fleet-heading">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="fleet-heading"
            eyebrow="Fleet"
            title="A vehicle for every itinerary."
            description="Land Cruisers for safari, a Prado for upcountry comfort, or a van for the whole group. Guide rates exclude VAT and availability is confirmed on request."
          />
          <a
            href="#contact"
            className="focusable shrink-0 text-sm font-bold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            Ask about a vehicle
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((vehicle) => (
            <article
              key={vehicle.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-[0_18px_40px_rgba(24,21,18,0.08)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                <Image
                  src={vehicle.image}
                  alt={vehicle.imageAlt}
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                  className={`h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03] ${
                    vehicle.disabledLook ? "saturate-[0.75]" : ""
                  }`}
                />
                {vehicle.badge ? (
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                      vehicle.disabledLook
                        ? "bg-surface/95 text-ink-muted"
                        : "bg-gold text-ink"
                    }`}
                  >
                    {vehicle.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-base font-extrabold leading-snug text-ink">
                  {vehicle.name}
                </h3>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Users aria-hidden="true" size={13} />
                    {vehicle.seats} seats
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Gauge aria-hidden="true" size={13} />
                    {vehicle.transmission}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Fuel aria-hidden="true" size={13} />
                    {vehicle.fuel}
                  </span>
                </p>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                    From
                  </span>
                  <span className="text-lg font-extrabold text-ink">
                    {formatUGX(vehicle.dailyRateUGX)}
                  </span>
                  <span className="text-xs font-semibold text-ink-muted">/ day</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                  Excludes VAT (18%). Driver extra.
                </p>

                <div className="mt-auto pt-4">
                  <QuoteRequestButton
                    vehicleSlug={vehicle.slug}
                    vehicleName={vehicle.name}
                    muted={vehicle.disabledLook}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          Need a larger group or a long-term arrangement?{" "}
          <a href="#contact" className="focusable font-bold text-ink underline underline-offset-4">
            Tell us what you need
          </a>
          .
        </p>
      </div>
    </section>
  );
}
