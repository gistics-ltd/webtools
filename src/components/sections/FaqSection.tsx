import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faqs";

export function FaqSection() {
  return (
    <section id="faq" className="section-pad bg-paper" aria-labelledby="faq-heading">
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-8">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Frequent Questions, answered."
            description="Practical answers about car hire prices in Uganda, airport pickups, long-term travel."
          />
          {/* <a href="#quote" className="btn-primary mt-6">
            Get an instant estimate
          </a> */}
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-2xl border border-line bg-surface px-5 py-4 open:border-ink/25"
            >
              <summary className="focusable flex cursor-pointer list-none items-start justify-between gap-4 rounded-sm text-left text-sm font-bold leading-snug text-ink marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  size={18}
                  className="mt-0.5 shrink-0 text-flame transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
