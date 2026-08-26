"use client";

import { useLocale } from "@/lib/LocaleProvider";

function CourseList({ label, courses }: { label: string; courses: string[] }) {
  return (
    <div>
      <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>
      <ul className="mt-4 divide-y divide-line-soft border-t border-line-soft">
        {courses.map((c, i) => (
          <li
            key={c}
            className="flex items-baseline gap-4 py-3.5 text-[15.5px] text-ink-soft"
          >
            <span className="font-mono text-[12px] text-rust">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-lg text-ink">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Teaching() {
  const { t } = useLocale();

  return (
    <section id="teaching" className="theme-light paper-grain border-t border-line-soft">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-moss">
          {t.teaching.eyebrow}
        </p>
        <h2 className="font-display mt-4 max-w-xl text-3xl leading-tight text-ink md:text-4xl">
          {t.teaching.heading}
        </h2>
        <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
          <CourseList label={t.teaching.undergrad} courses={t.teaching.undergradCourses} />
          <CourseList label={t.teaching.grad} courses={t.teaching.gradCourses} />
        </div>
      </div>
    </section>
  );
}
