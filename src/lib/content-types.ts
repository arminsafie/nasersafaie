export type Locale = "en" | "fa";

export const locales: Locale[] = ["en", "fa"];

export type Publication = {
  num: number;
  authors: string;
  year: number;
  title: string;
  venue: string;
  cited: number | null;
  doi: string | null;
  category: "scopus" | "early";
};

export type LocaleDict = {
  nav: {
    overview: string;
    research: string;
    record: string;
    teaching: string;
    publications: string;
    contact: string;
    email: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    intro: string;
    dept: string;
    pubsCta: string;
    contactCta: string;
    statCareerLabel: string;
    statCareerValue: string;
    statSinceLabel: string;
    statSinceValue: string;
    statPhdLabel: string;
    statPhdValue: string;
    specimenName: string;
    specimenPlace: string;
    specimenDet: string;
  };
  research: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
  };
  record: {
    eyebrow: string;
    heading: string;
    projectsHeading: string;
    subProjects: string;
    entries: { when: string; what: string; where: string }[];
    projects: { title: string; span: string; count: string; body: string }[];
  };
  teaching: {
    eyebrow: string;
    heading: string;
    undergrad: string;
    grad: string;
    undergradCourses: string[];
    gradCourses: string[];
  };
  publicationsSection: {
    eyebrow: string;
    heading: string;
    /** Uses {shown} and {total} placeholders. */
    entriesLabel: string;
    searchPlaceholder: string;
    allYears: string;
    sortNewest: string;
    sortOldest: string;
    sortCited: string;
    /** Uses a {query} placeholder. */
    noMatch: string;
    languageNote: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    emailLabel: string;
    telLabel: string;
    faxLabel: string;
    deptLabel: string;
    deptValue: string;
    footer: string;
  };
};

export type SiteContent = {
  siteName: { en: string; fa: string };
  email: string;
  email2: string;
  phone: string;
  fax: string;
  portraitImage: string;
  publications: Publication[];
  locales: Record<Locale, LocaleDict>;
};

export function fillTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
    template
  );
}
