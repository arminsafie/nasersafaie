"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

export default function Nav() {
  const { t, locale, toggleLocale, content } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const LINKS: { href: string; label: string }[] = [
    { href: "#overview", label: t.nav.overview },
    { href: "#research", label: t.nav.research },
    { href: "#record", label: t.nav.record },
    { href: "#teaching", label: t.nav.teaching },
    { href: "#publications", label: t.nav.publications },
    { href: "#contact", label: t.nav.contact },
  ];

  // Close the mobile menu on Escape and lock background scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="theme-dark paper-grain sticky top-0 z-50 isolate border-b border-line-soft bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 md:gap-4 md:px-10 md:py-4">
        <a
          href="#overview"
          className="touch-manipulation font-mono text-[13px] uppercase tracking-[0.18em] text-ink-soft hover:text-navy-tint transition-colors"
        >
          {content.siteName[locale]}
        </a>
        <nav
          aria-label="Section"
          className="hidden gap-7 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted md:flex"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-navy-tint transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={
              locale === "en" ? "Switch to Persian" : "تغییر به انگلیسی"
            }
            className="touch-manipulation flex min-h-11 items-center gap-1 border border-navy-tint/60 bg-navy/20 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-navy-tint active:bg-navy/45 md:hover:bg-navy/35 md:hover:text-ink transition-colors"
          >
            <span className={locale === "en" ? "text-ink" : undefined}>
              EN
            </span>
            <span aria-hidden="true" className="text-navy-tint/50">
              /
            </span>
            <span className={locale === "fa" ? "text-ink" : undefined}>
              فا
            </span>
          </button>
          <a
            href={`mailto:${content.email}`}
            className="touch-manipulation hidden font-mono text-[12px] uppercase tracking-[0.14em] text-moss hover:text-navy-tint transition-colors sm:inline"
          >
            {t.nav.email} ↗
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            className="touch-manipulation -me-1.5 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 active:bg-bg-panel md:hidden"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-5 bg-navy-tint transition-transform ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-px w-5 bg-navy-tint transition-transform ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav-menu"
        className={`overflow-hidden border-t border-line-soft transition-[max-height] duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <nav
          aria-label="Section"
          className="flex flex-col gap-1 px-6 py-2 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-soft"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="touch-manipulation flex min-h-12 items-center border-b border-line-soft hover:text-navy-tint transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`mailto:${content.email}`}
            onClick={() => setMenuOpen(false)}
            className="touch-manipulation flex min-h-12 items-center text-moss hover:text-navy-tint transition-colors"
          >
            {t.nav.email} ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
