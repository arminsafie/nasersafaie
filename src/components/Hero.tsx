"use client";

import Image from "next/image";
import Mycelium from "./Mycelium";
import Stamp from "./Stamp";
import WheatMotif from "./WheatMotif";
import { useLocale } from "@/lib/LocaleProvider";

export default function Hero() {
  const { t, content } = useLocale();

  return (
    <section id="overview" className="theme-dark paper-grain relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 pt-16 pb-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-10 md:pt-24">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-moss">
            {t.hero.eyebrow}
          </p>
          <h1 className="font-display mt-5 whitespace-pre-line text-[13vw] leading-[0.95] text-ink sm:text-6xl md:text-7xl">
            {t.hero.name}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            {t.hero.intro}
          </p>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-muted">
            {t.hero.dept}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[13px] uppercase tracking-[0.1em]">
            <a
              href="#publications"
              className="border-b border-rust pb-0.5 text-rust hover:text-ink hover:border-ink transition-colors"
            >
              {t.hero.pubsCta}
            </a>
            <a
              href="#contact"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              {t.hero.contactCta}
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line-soft pt-6">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                {t.hero.statCareerLabel}
              </dt>
              <dd className="font-display mt-1 text-2xl text-ink">
                {t.hero.statCareerValue}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                {t.hero.statSinceLabel}
              </dt>
              <dd className="font-display mt-1 text-2xl text-ink">
                {t.hero.statSinceValue}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                {t.hero.statPhdLabel}
              </dt>
              <dd className="font-display mt-1 text-2xl text-ink">
                {t.hero.statPhdValue}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative z-0 mx-auto w-full max-w-xs md:mx-0 md:max-w-sm">
          {/* wheat spike — grows up behind the mounted specimen, peeking past its edges */}
          <WheatMotif className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[145%] w-auto -translate-x-1/2 -translate-y-1/2 text-moss-soft opacity-70" />
          {/* herbarium-style specimen sheet: portrait mounted with a field label */}
          <div className="border border-line bg-bg-panel p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-line-soft">
              <Image
                src={content.portraitImage}
                alt="Portrait of Naser Safaie"
                fill
                priority
                sizes="(min-width: 768px) 24rem, 80vw"
                className="object-cover grayscale-[15%] contrast-[1.03]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-line pt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
              <span>{t.hero.specimenName}</span>
              <span>{t.hero.specimenPlace}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
              {t.hero.specimenDet}
            </p>
          </div>

          {/* accession stamp — the page's one deliberate accent moment, in navy */}
          <Stamp className="absolute -top-8 -end-8 h-24 w-24 drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)] sm:h-28 sm:w-28" />
        </div>
      </div>

      <Mycelium className="mx-auto h-10 w-full max-w-6xl px-6 text-line md:px-10" />
    </section>
  );
}
