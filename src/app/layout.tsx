import type { Metadata, Viewport } from "next";
import { Fraunces, Open_Sans } from "next/font/google";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { siteConfig } from "@/config/site";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F0E7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.lang} className={`${openSans.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="focusable sr-only z-[100] rounded-md bg-gold px-4 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
