"use client";

import { useLocale } from "@/lib/LocaleProvider";

const INTERESTS: { label: string; italic?: boolean }[] = [
  { label: "Fusarium graminearum", italic: true },
  { label: "Fusarium head blight" },
  { label: "Mycotoxins" },
  { label: "Rhizoctonia", italic: true },
  { label: "Macrophomina", italic: true },
  { label: "Biological control" },
  { label: "Endophytic fungi" },
  { label: "Molecular diagnostics" },
  { label: "Plant viruses" },
  { label: "Machine learning for disease detection" },
  { label: "Imaging & phenotyping" },
];

export default function Research() {
  const { t } = useLocale();

  return (
    <section id="research" className="theme-light paper-grain border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy">
              {t.research.eyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl leading-tight text-ink md:text-4xl">
              {t.research.heading}
            </h2>
          </div>
          <div className="space-y-5 text-[16px] leading-relaxed text-ink-soft">
            <p>{t.research.p1}</p>
            <p>{t.research.p2}</p>
          </div>
        </div>

        {/* scientific keywords stay in Latin/English in both languages, as
            they would in a Persian-language CV too */}
        <ul className="mt-14 flex flex-wrap gap-2.5" aria-label="Research keywords">
          {INTERESTS.map((tag) => (
            <li
              key={tag.label}
              dir="ltr"
              className="border border-line px-3.5 py-1.5 font-mono text-[12.5px] tracking-[0.01em] text-ink-soft"
            >
              {tag.italic ? <i>{tag.label}</i> : tag.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
