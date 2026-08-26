import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LocaleProvider } from "@/lib/LocaleProvider";
import { readContent } from "@/lib/content-server";

// Content can be edited live via the admin panel, so every request should
// read the current file from disk rather than a build-time snapshot.
export const dynamic = "force-dynamic";


const fraunces = localFont({
  variable: "--font-fraunces",
  display: "swap",
  src: [
    { path: "./fonts/Fraunces-Variable.ttf", style: "normal" },
    { path: "./fonts/Fraunces-Italic-Variable.ttf", style: "italic" },
  ],
});

const sourceSerif = localFont({
  variable: "--font-source-serif",
  display: "swap",
  src: [
    { path: "./fonts/SourceSerif4-Variable.ttf", style: "normal" },
    { path: "./fonts/SourceSerif4-Italic-Variable.ttf", style: "italic" },
  ],
});

const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    { path: "./fonts/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-Medium.ttf", weight: "500", style: "normal" },
  ],
});

const notoNaskh = localFont({
  variable: "--font-persian-display",
  display: "swap",
  src: [{ path: "./fonts/NotoNaskhArabic-Variable.ttf", style: "normal" }],
});

const vazirmatn = localFont({
  variable: "--font-persian-ui",
  display: "swap",
  src: [{ path: "./fonts/Vazirmatn-Variable.ttf", style: "normal" }],
});

export const metadata: Metadata = {
  title: "Naser Safaie — Professor of Plant Pathology",
  description:
    "Naser Safaie, Professor of Plant Pathology at Tarbiat Modares University. Research on cereal pathogens, mycology, biological control, and molecular plant pathology — 177 peer-reviewed publications.",
  openGraph: {
    title: "Naser Safaie — Professor of Plant Pathology",
    description:
      "Research on cereal pathogens, soilborne fungi, biological control, and molecular diagnostics. Tarbiat Modares University.",
    type: "profile",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await readContent();
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${plexMono.variable} ${notoNaskh.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <LocaleProvider initialContent={content}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
