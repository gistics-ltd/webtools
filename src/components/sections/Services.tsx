import { Building2, CarFront, Mountain, Plane } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

const icons = {
  chauffeur: CarFront,
  airport: Plane,
  safari: Mountain,
  corporate: Building2,
} as const;

export function Services() {
  return (
    <section id="services" className="section-pad bg-paper" aria-labelledby="services-heading">
      <div className="container-page">
        <SectionHeading
          id="services-heading"
          eyebrow="Services"
          title="Car hire for every kind of trip."
          description="From a single airport transfer to a multi-day safari or monthly corporate hire, choose the service that fits your plans. Every request is confirmed by a person."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            const tones = ["bg-gold-soft", "bg-peach", "bg-sage", "bg-blush"];
            return (
              <article
                key={service.slug}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl text-ink ${
                    tones[index % tones.length]
                  }`}
                >
                  <Icon aria-hidden="true" size={19} />
                </span>
                <h3 className="mt-4 text-base font-extrabold leading-snug text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
