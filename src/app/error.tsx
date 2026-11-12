"use client";

import { Home, MessageCircle, Phone, RotateCcw } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full items-center bg-paper px-5 py-14 sm:px-8 lg:px-12">
      <meta name="robots" content="noindex, nofollow" />
      <title>Something went wrong | Gistics Limited</title>
      <div className="mx-auto w-full max-w-2xl">
        <p className="eyebrow text-flame">500 · Server error</p>
        <p
          aria-hidden="true"
          className="mt-2 font-display text-7xl leading-none tracking-[-0.04em] text-ink sm:text-8xl"
        >
          500
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.02em] text-ink sm:text-4xl">
          Something went wrong on our side.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
          We could not finish loading this page. Please try again. If it keeps happening,
          email us and we will help directly.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            <RotateCcw aria-hidden="true" size={17} />
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            <Home aria-hidden="true" size={17} />
            Back to home
          </Link>
          {/* <Link href="/#contact" className="btn-secondary">
            <MessageCircle aria-hidden="true" size={17} />
            Contact us
          </Link> */}
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="focusable font-bold text-ink underline underline-offset-4"
          >
            <Phone aria-hidden="true" className="mr-1 inline" size={14} />
            {siteConfig.phone.display}
          </a>
        </p>
      </div>
    </div>
  );
}
