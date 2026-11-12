import { sectionHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

export function Footer({ onHome }: { onHome: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line/20 bg-surface px-5 py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 lg:px-12">
      <Logo tone="ink" />

      <div className="order-3 w-full text-center text-[11px] leading-relaxed text-ink-muted sm:order-none sm:w-auto sm:text-xs sm:text-center">
        © {year} {siteConfig.name}
        <p>
          Designed by{" "}
          <a
            href="https://bdesignhub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="focusable rounded-sm font-semibold underline underline-offset-4 hover:text-ink"
          >
            BDesignHub
          </a>
          .
        </p>
      </div>

      <nav aria-label="Footer navigation" className="flex items-center gap-3 sm:gap-5">
        <a
          href={sectionHref("contact", onHome)}
          className="focusable hidden rounded-sm text-xs font-semibold text-ink-muted hover:text-ink sm:block"
        >
          Contact
        </a>
        <a
          href={sectionHref("quote", onHome)}
          className="focusable inline-flex min-h-9 items-center rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-brand-white transition-colors hover:bg-ink-soft"
        >
          Get a quote
        </a>
      </nav>
    </footer>
  );
}
