import type { Metadata } from "next";
import { Home, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center bg-paper px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-2xl">
        <p className="eyebrow text-flame">404 · Page not found</p>
        <p
          aria-hidden="true"
          className="mt-2 font-display text-7xl leading-none tracking-[-0.04em] text-ink sm:text-8xl"
        >
          4<span className="text-flame">0</span>4
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] text-ink sm:text-4xl">
          This road doesn&apos;t lead anywhere.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
          The page may have moved, or the address may be mistyped. Let&apos;s get you back to the
          journey.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            <Home aria-hidden="true" size={17} />
            Back to home
          </Link>
          {/* <Link href="/#quote" className="btn-secondary">
            Get a quote
          </Link>
          <Link href="/#contact" className="btn-secondary">
            <MessageCircle aria-hidden="true" size={17} />
            Contact us
          </Link> */}
        </div>
        {/* <p className="mt-6 text-sm text-ink-muted">
          Or call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="focusable font-bold text-ink underline underline-offset-4"
          >
            <Phone aria-hidden="true" className="mr-1 inline" size={14} />
            {siteConfig.phone.display}
          </a>
          .
        </p> */}
      </div>
    </div>
  );
}
