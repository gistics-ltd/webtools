import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fullAddress, siteConfig } from "@/config/site";

export function ContactSection() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.map.directionsQuery,
  )}`;

  return (
    <section id="contact" className="section-pad bg-surface" aria-labelledby="contact-heading">
      <div className="container-page">
        <SectionHeading
          id="contact-heading"
          eyebrow="Contact"
          title="Let’s go the distance."
          description="Ask about a vehicle, an airport pickup or a long-drive itinerary. Phone and email are the quickest ways to reach the team."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="rounded-3xl border border-line bg-paper p-5 sm:p-6">
            <dl className="space-y-6 text-sm">
              <div className="flex gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-peach text-flame">
                  <MapPin aria-hidden="true" size={17} />
                </span>
                <div>
                  <dt className="font-bold text-ink">Office</dt>
                  <dd className="mt-0.5 text-ink-muted">{fullAddress}</dd>
                  <a
                    href={directionsUrl}
                    className="focusable mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-ink underline underline-offset-4"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Get directions
                    <Navigation aria-hidden="true" size={13} />
                  </a>
                </div>
              </div>

              {/* <div className="flex gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-ink">
                  <Phone aria-hidden="true" size={17} />
                </span>
                <div>
                  <dt className="font-bold text-ink">Phone</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${siteConfig.phone.tel}`}
                      className="focusable text-ink-muted underline underline-offset-4 hover:text-ink"
                    >
                      {siteConfig.phone.display}
                    </a>
                  </dd>
                </div>
              </div> */}

              <div className="flex gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-sage text-ink">
                  <Mail aria-hidden="true" size={17} />
                </span>
                <div className="min-w-0">
                  <dt className="font-bold text-ink">Email</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="focusable break-all text-ink-muted underline underline-offset-4 hover:text-ink"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-blush text-flame">
                  <Clock aria-hidden="true" size={17} />
                </span>
                <div>
                  <dt className="font-bold text-ink">Opening hours</dt>
                  <dd className="mt-0.5 space-y-0.5 text-ink-muted">
                    {siteConfig.openingHours.map((entry) => (
                      <p key={entry.label}>
                        {entry.label}:{" "}
                        {entry.opens && entry.closes
                          ? `${entry.opens}–${entry.closes}`
                          : "Closed"}
                      </p>
                    ))}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <a href={`tel:${siteConfig.phone.tel}`} className="btn-primary">
                <Phone aria-hidden="true" size={16} />
                Give Us a Call
              </a>
              <a href="#quote" className="btn-outline-dark">
                Estimate your quote
              </a>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl border border-line bg-paper">
              <iframe
                title="Map showing Gistics Limited in Kampala, Uganda"
                src={siteConfig.map.embedSrc}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full"
              />
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">
              Map data © Google. Use the directions link for turn-by-turn navigation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
