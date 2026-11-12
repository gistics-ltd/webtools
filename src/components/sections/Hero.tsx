import { existsSync } from "node:fs";
import path from "node:path";
import { CheckCircle2, Phone, Zap } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const trustItems = [
  "Chauffeur-driven",
  "Airport pickups",
  "Upcountry & safari trips",
  "Responsive support",
];

const heroSrc = "/images/hero/hero-image.png";

export function Hero() {
  const heroAvailable = existsSync(path.join(process.cwd(), "public", heroSrc));

  return (
    <section
      id="top"
      className="flex min-h-full flex-col bg-surface"
      aria-labelledby="hero-heading"
    >
      <div className="grid flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="relative z-10 flex flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
          <p className="eyebrow flex items-center gap-2 text-flame">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-flame" />
            we get you there
          </p>

          <h1
            id="hero-heading"
            className="mt-5 max-w-2xl font-display text-[3.45rem] font-normal leading-[0.98] tracking-[-0.035em] text-ink sm:text-7xl xl:text-[4.8rem]"
          >
            Car hire in <span className="text-flame">Kampala</span> &amp; across Uganda.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Chauffeur-driven vehicles for city trips, airport transfers, long-distance
            travel and corporate teams. Get a price estimate before you book.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#quote" className="btn-primary">
              <Zap aria-hidden="true" size={17} />
              Get an instant estimate
            </a>
            <a
              href={`tel:${siteConfig.phone.tel}`}
              aria-label={`Call ${siteConfig.phone.display}`}
              title={`Call ${siteConfig.phone.display}`}
              className="focusable inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-brand-white"
            >
              <Phone aria-hidden="true" size={19} />
            </a>
          </div>
        </div>

        <div className="relative z-0 hidden min-h-[600px] lg:-ml-10 lg:block xl:-ml-16">
          {heroAvailable ? (
            <Image
              src={heroSrc}
              alt="Gistics Limited car hire vehicle on a road in Uganda"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="40vw"
              className="object-contain"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,var(--gold-soft),transparent_50%),linear-gradient(145deg,var(--peach),var(--blush))]"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-frame/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface/10"
          />
        </div>
      </div>

      <div className="border-t border-line/30 bg-surface">
        <div className="container-page py-4.5">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-ink-muted sm:text-sm">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" size={15} className="text-flame" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
