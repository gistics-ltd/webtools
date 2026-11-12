"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { primaryNavigation, sectionHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <header className="relative z-30 flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-line/20 bg-surface/90 px-5 backdrop-blur-sm sm:px-8 lg:px-12">
      <div className="flex items-center gap-8">
        <MobileMenu onHome={onHome} />
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {primaryNavigation.map((link) => (
              <li key={link.id}>
                <a
                  href={sectionHref(link.id, onHome)}
                  className="focusable rounded-sm text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`tel:${siteConfig.phone.tel}`}
          aria-label={`Call ${siteConfig.phone.display}`}
          title={`Call ${siteConfig.phone.display}`}
          className="focusable inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
        >
          <Phone aria-hidden="true" size={17} />
        </a>
        <a
          href={sectionHref("quote", onHome)}
          className="btn-primary !min-h-10 !px-4 !py-2 text-sm"
        >
          Get a quote
        </a>
      </div>
    </header>
  );
}
