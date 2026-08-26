"use client";

import Mycelium from "./Mycelium";
import { useLocale } from "@/lib/LocaleProvider";

export default function Contact() {
  const { t, content } = useLocale();

  return (
    <section id="contact" className="theme-dark paper-grain border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy-tint">
          {t.contact.eyebrow}
        </p>
        <h2 className="font-display mt-4 max-w-lg text-3xl leading-tight text-ink md:text-4xl">
          {t.contact.heading}
        </h2>

        <div className="mt-12 grid gap-10 border-t border-line-soft pt-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {t.contact.emailLabel}
            </p>
            <a
              href={`mailto:${content.email}`}
              dir="ltr"
              className="mt-2 block text-start text-[15px] text-ink hover:text-rust transition-colors"
            >
              {content.email}
            </a>
            <a
              href={`mailto:${content.email2}`}
              dir="ltr"
              className="mt-1 block text-start text-[15px] text-ink-soft hover:text-rust transition-colors"
            >
              {content.email2}
            </a>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {t.contact.telLabel}
            </p>
            <p className="mt-2 text-[15px] text-ink-soft" dir="ltr">
              {content.phone}
            </p>
            <p className="mt-1 text-[15px] text-ink-muted" dir="ltr">
              {t.contact.faxLabel} {content.fax}
            </p>
          </div>
          <div className="sm:col-span-2 md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {t.contact.deptLabel}
            </p>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {t.contact.deptValue}
            </p>
          </div>
        </div>
      </div>

      <Mycelium
        flip
        className="mx-auto h-10 w-full max-w-6xl px-6 text-line md:px-10"
      />

      <div className="mx-auto max-w-6xl px-6 pb-10 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          © {new Date().getFullYear()} Naser Safaie · {t.contact.footer}
        </p>
      </div>
    </section>
  );
}
