export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: "chauffeur" | "airport" | "safari" | "corporate";
};

export const services: Service[] = [
  {
    slug: "chauffeur-driven-car-hire",
    title: "Chauffeur-driven car hire",
    description:
      "Hire a car with a professional driver for meetings, weddings, events or a stress-free day in Kampala. Choose a sedan, people carrier or 4x4.",
    icon: "chauffeur",
  },
  {
    slug: "entebbe-airport-transfers",
    title: "Airport transfers (Entebbe)",
    description:
      "Pre-book an Entebbe airport pickup or drop-off between the airport and Kampala, your hotel or an upcountry destination.",
    icon: "airport",
  },
  {
    slug: "safari-upcountry-car-hire",
    title: "Safari & upcountry trips",
    description:
      "4x4 car hire for Murchison Falls, Queen Elizabeth National Park, Bwindi, Kibale, Fort Portal and Jinja, with a driver who knows the route.",
    icon: "safari",
  },
  {
    slug: "corporate-long-term-hire",
    title: "Corporate & long-term hire",
    description:
      "Monthly car hire and dedicated vehicles for companies, NGOs, projects and events in Kampala and across Uganda.",
    icon: "corporate",
  },
];
