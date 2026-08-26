"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale, LocaleDict, SiteContent } from "./content-types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  dir: "ltr" | "rtl";
  /** Current-locale text dictionary (shorthand for content.locales[locale]). */
  t: LocaleDict;
  /** Full site content, including data that isn't locale-specific. */
  content: SiteContent;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "ns-locale";

export function LocaleProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent: SiteContent;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fa") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved);
      }
    } catch {
      // localStorage unavailable — fall back to default locale silently
    }
  }, []);

  useEffect(() => {
    const dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore write failures (private browsing, storage disabled, etc.)
    }
  };

  const toggleLocale = () => setLocale(locale === "en" ? "fa" : "en");

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      dir: locale === "fa" ? "rtl" : "ltr",
      t: initialContent.locales[locale],
      content: initialContent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleLocale/setLocale intentionally close over `locale` and are recreated with it
    [locale, initialContent]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
