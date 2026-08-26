"use client";

import { useLocale } from "@/lib/LocaleProvider";

export default function Record() {
  const { t } = useLocale();

  return (
    <section id="record" className="theme-dark paper-grain border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy-tint">
          {t.record.eyebrow}
        </p>
        <h2 className="font-display mt-4 max-w-xl text-3xl leading-tight text-ink md:text-4xl">
          {t.record.heading}
        </h2>

        <ol className="mt-12 border-t border-line-soft">
          {t.record.entries.map((e) => (
            <li
              key={e.when + e.what}
              className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line-soft py-5 sm:grid-cols-[8rem_1fr] md:grid-cols-[10rem_1fr]"
            >
              <span className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-ink-muted">
                {e.when}
              </span>
              <div>
                <p className="font-display text-lg text-ink">{e.what}</p>
                <p className="mt-0.5 text-[14.5px] text-ink-soft">
                  {e.where}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="font-display mt-20 max-w-xl text-2xl leading-tight text-ink md:text-3xl">
          {t.record.projectsHeading}
        </h3>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {t.record.projects.map((p) => (
            <article
              key={p.title}
              className="border border-line bg-bg-panel p-6"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-muted">
                <span>{p.span}</span>
                <span className="text-navy-tint">{p.count}</span>
              </div>
              <h4 className="font-display mt-3 text-xl text-ink">
                {p.title}
              </h4>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
