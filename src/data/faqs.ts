export type Faq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * FAQ copy. Policy-dependent answers deliberately use general wording; the
 * specific policy must be confirmed before launch.
 * [[CONFIRM: fuel policy, included mileage, driver hours, minimum driver age,
 * required documents, cross-border fees, park fees and cancellation terms]]
 */
export const faqs: Faq[] = [
  {
    id: "cost",
    question: "How much does car hire cost in Kampala or Uganda?",
    answer:
      "The price depends on the vehicle, the number of days and the route. Use the instant estimate on this page for a guide, then send your trip details for a written quote. The estimate and all advertised rates exclude VAT (18%), and the final price depends on dates, availability and trip details.",
  },
  {
    id: "with-driver",
    question: "Can I hire a car with a driver in Uganda?",
    answer:
      "Yes. Chauffeur-driven car hire is available for city runs, airport transfers, corporate travel and upcountry trips.",
  },
  {
    id: "fuel",
    question: "Is fuel included?",
    answer:
      "No. Fuel is not included in the car hire price. We set this out clearly in your written quote before you confirm, so there are no surprises on collection. Ask us if you would like a fuel-inclusive quote for an upcountry or safari trip.",
  },
  {
    id: "process",
    question: "How does the quote process work?",
    answer:
      "Start with the instant estimate on this page, then choose “Get my full quote” and send your name, contact details, pickup date and location. Your estimate is recalculated on our server and emailed to our team with a reference number. We respond by email to confirm availability and the final price. No payment is taken on this website.",
  },
  {
    id: "cross-border",
    question: "Can I travel to Kenya or Rwanda?",
    answer:
      "Cross-border car hire can be arranged for Kenya and Rwanda, but it requires advance planning and the correct vehicle paperwork. Contact us for a conversation.",
  },
  {
    id: "long-term",
    question: "Do you offer corporate or monthly car hire?",
    answer:
      "Yes. Corporate and long-term car hire in Kampala is available for businesses, NGOs, projects and events. Monthly rates depend on the vehicle, driver and expected mileage, so contact us with your requirements. For stays longer than 30 days, the online estimate is only a starting point.",
  },
];
