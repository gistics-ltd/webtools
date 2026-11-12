import { CheckCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const highlights = [
  "Transparent pricing",
  "Well-maintained vehicles",
  "Professional drivers",
  "Flexible routes",
  "Quick quote response",
];

export function Intro() {
  return (
    <section id="about" className="section-pad bg-paper pt-20" aria-labelledby="intro-heading">
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:items-start lg:gap-14">
        <div>
          <SectionHeading
            id="intro-heading"
            eyebrow="About Gistics Limited"
            title="Explore Uganda, and beyond."
          />
          <div className="mt-5 max-w-2xl space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            <p>
              Gistics Limited is a Ugandan car hire company serving residents, visitors and
              corporate teams who need reliable transport. Whether you need a car in Kampala for a
              few days, an airport transfer to Entebbe, or a 4x4 for a long-distance trip, we will
              help you choose the right vehicle and driver.
            </p>
            <p>
              Trips can stay within Kampala, run upcountry to Jinja, Kabale, Fort Portal or Gulu, or
              cross into Kenya and Rwanda with the right arrangements.
            </p>
          </div>
        </div>

        <aside className="rounded-3xl bg-peach py-6 pb-12 px-10 sm:py-4 sm:px-10 sm:pb-12">
          {/* <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-surface text-flame">
            <PackageCheck aria-hidden="true" size={21} />
          </span> */}
          <h3 className="mt-4 font-display text-2xl font-medium leading-tight text-ink">
            Skip the hassle. Rent with us.
          </h3>
          <ul className="mt-5 space-y-2 text-sm font-semibold text-ink">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle aria-hidden="true" size={15} className="text-flame" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
