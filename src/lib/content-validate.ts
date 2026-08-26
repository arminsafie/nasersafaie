import type { SiteContent, Publication, LocaleDict } from "./content-types";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validatePublication(p: unknown, i: number): asserts p is Publication {
  assert(p && typeof p === "object", `publications[${i}] must be an object`);
  const pub = p as Record<string, unknown>;
  assert(typeof pub.num === "number", `publications[${i}].num must be a number`);
  assert(isString(pub.authors), `publications[${i}].authors must be a string`);
  assert(typeof pub.year === "number", `publications[${i}].year must be a number`);
  assert(isString(pub.title), `publications[${i}].title must be a string`);
  assert(isString(pub.venue), `publications[${i}].venue must be a string`);
  assert(
    pub.cited === null || typeof pub.cited === "number",
    `publications[${i}].cited must be a number or null`
  );
  assert(
    pub.doi === null || isString(pub.doi),
    `publications[${i}].doi must be a string or null`
  );
  assert(
    pub.category === "scopus" || pub.category === "early",
    `publications[${i}].category must be "scopus" or "early"`
  );
}

function validateLocaleDict(d: unknown, locale: string): asserts d is LocaleDict {
  assert(d && typeof d === "object", `locales.${locale} must be an object`);
  const dict = d as Record<string, unknown>;
  for (const key of [
    "nav",
    "hero",
    "research",
    "record",
    "teaching",
    "publicationsSection",
    "contact",
  ]) {
    assert(
      dict[key] && typeof dict[key] === "object",
      `locales.${locale}.${key} must be an object`
    );
  }
  const record = dict.record as Record<string, unknown>;
  assert(Array.isArray(record.entries), `locales.${locale}.record.entries must be an array`);
  assert(Array.isArray(record.projects), `locales.${locale}.record.projects must be an array`);
  const teaching = dict.teaching as Record<string, unknown>;
  assert(
    Array.isArray(teaching.undergradCourses),
    `locales.${locale}.teaching.undergradCourses must be an array`
  );
  assert(
    Array.isArray(teaching.gradCourses),
    `locales.${locale}.teaching.gradCourses must be an array`
  );
}

/** Throws a descriptive Error if the shape is invalid; otherwise returns normally. */
export function validateSiteContent(input: unknown): asserts input is SiteContent {
  assert(input && typeof input === "object", "Content must be an object");
  const c = input as Record<string, unknown>;

  assert(c.siteName && typeof c.siteName === "object", "siteName must be an object");
  const siteName = c.siteName as Record<string, unknown>;
  assert(isString(siteName.en), "siteName.en must be a string");
  assert(isString(siteName.fa), "siteName.fa must be a string");

  for (const key of ["email", "email2", "phone", "fax", "portraitImage"]) {
    assert(isString(c[key]), `${key} must be a string`);
  }

  assert(Array.isArray(c.publications), "publications must be an array");
  c.publications.forEach((p, i) => validatePublication(p, i));

  assert(c.locales && typeof c.locales === "object", "locales must be an object");
  const locales = c.locales as Record<string, unknown>;
  assert(locales.en, "locales.en is required");
  assert(locales.fa, "locales.fa is required");
  validateLocaleDict(locales.en, "en");
  validateLocaleDict(locales.fa, "fa");
}
