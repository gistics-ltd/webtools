import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FleetSection } from "@/components/sections/FleetSection";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { QuoteSection } from "@/components/sections/QuoteSection";
import {
  buildJsonLdGraph,
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  TWITTER_IMAGE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    languages: {
      "en-UG": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Gistics Limited",
    locale: "en_UG",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: TWITTER_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildJsonLdGraph()} />
      <Hero />
      <Intro />
      <QuoteSection />
      {/* <FleetSection /> */}
      <FaqSection />
      <ContactSection />
    </>
  );
}
