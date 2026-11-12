import { QuoteCalculator } from "@/components/quote/QuoteCalculator";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function QuoteSection() {
  return (
    <section id="quote" className="section-pad bg-surface" aria-labelledby="quote-heading">
      <div className="container-page">
        <SectionHeading
          id="quote-heading"
          eyebrow="Get a quote"
          title="Estimate your travel price in a minute."
          description="Choose your vehicle, route and days for an instant estimate. Rates are in Ugandan shillings and exclude VAT (18%)."
        />
        <div className="mt-8">
          <QuoteCalculator />
        </div>
      </div>
    </section>
  );
}
