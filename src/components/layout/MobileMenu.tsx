"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { primaryNavigation, sectionHref } from "@/config/navigation";

export function MobileMenu({ onHome }: { onHome: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="focusable inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink/40"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-y border-line bg-surface p-5 shadow-xl"
        >
          <nav aria-label="Mobile navigation">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {primaryNavigation.map((link) => (
                <li key={link.id}>
                  <a
                    href={sectionHref(link.id, onHome)}
                    onClick={() => setOpen(false)}
                    className="focusable block rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
