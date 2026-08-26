"use client";

import { useId } from "react";
import { useLocale } from "@/lib/LocaleProvider";

export default function Stamp({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const pathId = useId();

  const ringText =
    locale === "fa"
      ? "دانشگاه تربیت مدرس · بیماری‌شناسی گیاهی ·"
      : "TARBIAT MODARES UNIVERSITY · PLANT PATHOLOGY ·";

  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      style={{ transform: "rotate(-9deg)" }}
      aria-hidden="true"
    >
      <defs>
        <path
          id={pathId}
          d="M 80,80 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
        />
      </defs>
      <circle cx="80" cy="80" r="76" fill="var(--bg-panel)" />
      <circle
        cx="80"
        cy="80"
        r="74"
        fill="none"
        stroke="var(--navy-tint)"
        strokeWidth="1"
        opacity="0.55"
      />
      <circle
        cx="80"
        cy="80"
        r="62"
        fill="none"
        stroke="var(--navy)"
        strokeWidth="1.75"
      />
      <circle
        cx="80"
        cy="80"
        r="48"
        fill="none"
        stroke="var(--navy)"
        strokeWidth="1"
        opacity="0.7"
      />
      <text
        fill="var(--navy)"
        fontSize="8.6"
        letterSpacing="1.5"
        fontFamily="var(--font-mono), monospace"
      >
        <textPath href={`#${pathId}`} startOffset="1%">
          {ringText}
        </textPath>
      </text>
      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill="var(--navy)"
        fontSize="21"
        fontFamily="var(--font-display), serif"
      >
        Ph.D.
      </text>
      <text
        x="80"
        y="96"
        textAnchor="middle"
        fill="var(--navy)"
        fontSize="12.5"
        letterSpacing="2"
        fontFamily="var(--font-mono), monospace"
      >
        2002
      </text>
    </svg>
  );
}
