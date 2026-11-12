export type PageSection = {
  id: string;
  label: string;
};

export const pageSections: PageSection[] = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "quote", label: "Get a quote" },
  { id: "fleet", label: "Fleet" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const primaryNavigation: PageSection[] = [
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function sectionHref(id: string, onHome: boolean): string {
  return onHome ? `#${id}` : `/#${id}`;
}
