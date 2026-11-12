import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";

/** Reserved placeholder domain used if NEXT_PUBLIC_SITE_URL is not set. */
const FALLBACK_SITE_URL = "https://gistics.co.ug";

export const SITE_TITLE = "Car Hire in Kampala, Uganda | Gistics";
export const SITE_DESCRIPTION =
  "Affordable car hire for city trips, airport transfers, long-distance travel and corporate teams. Get a price estimate before you book.";
export const OG_IMAGE_ALT = "Gistics Limited car hire company in Kampala and across Uganda";
export const OG_IMAGE_URL = "/opengraph-image";
export const TWITTER_IMAGE_URL = "/twitter-image";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configured || FALLBACK_SITE_URL;
  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: SITE_TITLE,
      template: `%s | ${siteConfig.name}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: "/",
      siteName: siteConfig.name,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [{ url: TWITTER_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },
    category: "travel",
  };
}

type JsonLdObject = Record<string, unknown>;

export function localBusinessJsonLd(): JsonLdObject {
  const url = getSiteUrl();
  const address: JsonLdObject = {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  };
  if (siteConfig.address.street) address.streetAddress = siteConfig.address.street;
  if (siteConfig.address.postalCode) address.postalCode = siteConfig.address.postalCode;

  const openingHoursSpecification = siteConfig.openingHours
    .filter((entry) => entry.opens && entry.closes)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days,
      opens: entry.opens,
      closes: entry.closes,
    }));

  return {
    "@type": "AutoRental",
    "@id": `${url}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url,
    logo: absoluteUrl("/brand/gistics-logo-red.png"),
    image: absoluteUrl("/images/hero-image.png"),
    telephone: siteConfig.phone.tel,
    email: siteConfig.email,
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification,
    areaServed: [
      { "@type": "City", name: "Kampala" },
      { "@type": "City", name: "Entebbe" },
      { "@type": "Country", name: "Uganda" },
    ],
    priceRange: siteConfig.priceRange,
    sameAs: siteConfig.socialProfiles,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car hire services in Uganda",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          provider: { "@id": `${url}/#business` },
          areaServed: "Uganda",
        },
      })),
    },
  };
}

export function websiteJsonLd(): JsonLdObject {
  const url = getSiteUrl();
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: siteConfig.name,
    inLanguage: siteConfig.lang,
    publisher: { "@id": `${url}/#business` },
  };
}

export function faqJsonLd(): JsonLdObject {
  return {
    "@type": "FAQPage",
    "@id": `${getSiteUrl()}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [localBusinessJsonLd(), websiteJsonLd(), faqJsonLd()],
  };
}
