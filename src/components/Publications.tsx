"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";
import { fillTemplate } from "@/lib/content-types";

type SortMode = "newest" | "oldest" | "cited";

export default function Publications() {
  const { t, content } = useLocale();
  const publications = content.publications;
  const YEARS = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [publications]
  );

  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = publications.filter((p) => {
      if (year !== "all" && String(p.year) !== year) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "oldest") return a.year - b.year || a.num - b.num;
      if (sort === "cited") return (b.cited ?? -1) - (a.cited ?? -1);
      return b.year - a.year || b.num - a.num;
    });
    return list;
  }, [publications, query, year, sort]);

  const pubT = t.publicationsSection;

  return (
    <section id="publications" className="theme-light paper-grain border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-navy">
              {pubT.eyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl leading-tight text-ink md:text-4xl">
              {pubT.heading}
            </h2>
          </div>
          <p className="font-mono text-[12.5px] uppercase tracking-[0.1em] text-ink-muted">
            {fillTemplate(pubT.entriesLabel, {
              shown: filtered.length,
              total: publications.length,
            })}
          </p>
        </div>

        <p className="mt-3 max-w-xl text-[13.5px] text-ink-muted">
          {pubT.languageNote}
        </p>

        {/* controls */}
        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">{pubT.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pubT.searchPlaceholder}
              className="w-full border border-line bg-bg px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-muted focus:border-navy"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">{pubT.allYears}</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-line bg-bg px-4 py-3 font-mono text-[13px] uppercase tracking-[0.05em] text-ink-soft focus:border-navy sm:w-40"
            >
              <option value="all">{pubT.allYears}</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="relative block">
            <span className="sr-only">{pubT.sortNewest}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="w-full border border-line bg-bg px-4 py-3 font-mono text-[13px] uppercase tracking-[0.05em] text-ink-soft focus:border-navy sm:w-44"
            >
              <option value="newest">{pubT.sortNewest}</option>
              <option value="oldest">{pubT.sortOldest}</option>
              <option value="cited">{pubT.sortCited}</option>
            </select>
          </label>
        </div>

        {/* list — publication text itself stays in its original published
            language/direction (mostly English), even when the UI is Persian */}
        <div className="index-scroll mt-8 max-h-[640px] overflow-y-auto border-t border-line-soft" dir="ltr">
          {filtered.length === 0 ? (
            <p className="py-14 text-center text-[15px] text-ink-muted" dir="auto">
              {fillTemplate(pubT.noMatch, { query })}
            </p>
          ) : (
            filtered.map((p) => (
              <article
                key={`${p.category}-${p.num}`}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line-soft py-5 sm:grid-cols-[5rem_1fr] md:grid-cols-[6rem_1fr]"
              >
                <div className="font-mono text-[12px] text-ink-muted">
                  <div className="text-navy">{p.year}</div>
                  <div className="mt-0.5">
                    No. {String(p.num).padStart(3, "0")}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15.5px] leading-snug text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
                    {p.authors}
                  </p>
                  <p className="mt-1 text-[13.5px] italic leading-relaxed text-ink-soft">
                    {p.venue}
                  </p>
                  <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.05em] text-ink-muted">
                    {p.cited !== null && (
                      <span className="text-moss">
                        Cited {p.cited}×
                      </span>
                    )}
                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-line-soft text-ink-muted hover:text-navy hover:border-navy transition-colors break-all"
                      >
                        doi.org/{p.doi}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
