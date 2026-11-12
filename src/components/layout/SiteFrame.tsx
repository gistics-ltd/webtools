"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pageSections } from "@/config/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const scrollRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState(pageSections[0]!.id);

  useEffect(() => {
    if (!onHome) return;
    const container = scrollRef.current;
    if (!container) return;

    let frame = 0;

    const update = () => {
      const marker =
        container.getBoundingClientRect().top + Math.max(140, container.clientHeight * 0.35);
      let current = pageSections[0]!.id;

      for (const section of pageSections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) {
          current = section.id;
        }
      }

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
        current = pageSections[pageSections.length - 1]!.id;
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const keepDocumentStill = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const container = scrollRef.current;
      const element = document.getElementById(hash);
      if (!container || !element) return;
      keepDocumentStill();
      const top =
        container.scrollTop +
        element.getBoundingClientRect().top -
        container.getBoundingClientRect().top;
      container.scrollTo({ top, behavior: "instant" });
      keepDocumentStill();
    };

    window.addEventListener("scroll", keepDocumentStill, { passive: true });
    window.addEventListener("hashchange", applyHash);
    window.addEventListener("load", keepDocumentStill);

    const timers = [0, 150, 500, 1000].map((delay) =>
      window.setTimeout(delay === 0 ? applyHash : keepDocumentStill, delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", keepDocumentStill);
      window.removeEventListener("hashchange", applyHash);
      window.removeEventListener("load", keepDocumentStill);
    };
  }, [pathname]);

  function goToSection(id: string) {
    const container = scrollRef.current;
    const element = document.getElementById(id);
    if (!container || !element) return;
    const top =
      container.scrollTop + element.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollTo({ top, behavior: "smooth" });
  }

  function handleHashLinkClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const id = link.getAttribute("href")?.slice(1);
    if (!id || !document.getElementById(id) || !scrollRef.current) return;

    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    goToSection(id);
  }

  return (
    <div
      onClick={handleHashLinkClick}
      className="flex h-svh flex-col overflow-hidden bg-surface"
    >
      <Header />
      <div className="flex min-h-0 flex-1">
        {onHome ? (
          <aside className="hidden w-20 shrink-0 lg:flex">
            <nav
              aria-label="Page sections"
              className="relative flex w-full flex-col items-center justify-center gap-7 py-10"
            >
              <span aria-hidden="true" className="absolute bottom-16 top-16 w-px bg-line" />
              {pageSections.map((section) => {
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(section.id)}
                    aria-label={`Scroll to ${section.label}`}
                    aria-current={active ? "true" : undefined}
                    className="group relative z-10 flex size-8 items-center justify-center rounded-full"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        active
                          ? "size-2.5 scale-125 bg-ink ring-4 ring-ink/10"
                          : "size-2 bg-ink/25 group-hover:bg-flame"
                      }`}
                    />
                    <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold text-brand-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        ) : null}

        <main
          id="main-content"
          ref={scrollRef}
          className="page-scroll flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain scroll-smooth"
        >
          {children}
        </main>
      </div>
      <Footer onHome={onHome} />
    </div>
  );
}
