"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Locale, SiteContent, Publication } from "@/lib/content-types";
import { Field, TextInput, TextArea, SectionCard, Button } from "./components/fields";

const TABS = [
  "General",
  "Hero",
  "Research",
  "Record",
  "Teaching",
  "Publications",
  "Contact",
] as const;
type Tab = (typeof TABS)[number];

function LocaleToggle({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <div className="flex gap-1 border border-[#c7bc9c] p-0.5">
      {(["en", "fa"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`touch-manipulation min-h-11 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${
            locale === l
              ? "bg-[#a85a2a] text-white"
              : "text-[#726c52] hover:bg-[#e3dcc4]"
          }`}
        >
          {l === "en" ? "English" : "فارسی"}
        </button>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("General");
  const [locale, setLocale] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load content.");
        return res.json();
      })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load content.");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSaveMessage("Saved. The live site now reflects these changes.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e8e2cf] text-[#23200f]">
        Loading content…
      </div>
    );
  }

  if (loadError || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e8e2cf] px-6 text-center text-[#a13c2a]">
        {loadError || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8e2cf] text-[#23200f]">
      <header className="sticky top-0 z-10 border-b border-[#c7bc9c] bg-[#e8e2cf]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#726c52]">
              Admin
            </p>
            <h1 className="font-serif text-xl">Site content</h1>
          </div>
          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-[13px] text-[#3b5c2b]">{saveMessage}</span>
            )}
            {saveError && (
              <span className="text-[13px] text-[#a13c2a]">{saveError}</span>
            )}
            <Button variant="secondary" onClick={handleLogout} type="button">
              Log out
            </Button>
            <Button onClick={handleSave} disabled={saving} type="button">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-3 font-mono text-[12px] uppercase tracking-[0.08em]">
          {TABS.map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className={`touch-manipulation min-h-11 shrink-0 whitespace-nowrap px-3 py-1.5 ${
                tab === tb
                  ? "bg-[#23200f] text-[#e8e2cf]"
                  : "text-[#726c52] hover:bg-[#e3dcc4]"
              }`}
            >
              {tb}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab !== "General" && tab !== "Publications" && (
          <div className="mb-5 flex justify-end">
            <LocaleToggle locale={locale} setLocale={setLocale} />
          </div>
        )}

        {tab === "General" && <GeneralTab content={content} setContent={setContent} />}
        {tab === "Hero" && (
          <HeroTab content={content} setContent={setContent} locale={locale} />
        )}
        {tab === "Research" && (
          <ResearchTab content={content} setContent={setContent} locale={locale} />
        )}
        {tab === "Record" && (
          <RecordTab content={content} setContent={setContent} locale={locale} />
        )}
        {tab === "Teaching" && (
          <TeachingTab content={content} setContent={setContent} locale={locale} />
        )}
        {tab === "Publications" && (
          <PublicationsTab content={content} setContent={setContent} />
        )}
        {tab === "Contact" && (
          <ContactTab content={content} setContent={setContent} locale={locale} />
        )}
      </main>
    </div>
  );
}

// ---------- General ----------

function GeneralTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setContent({ ...content, portraitImage: data.path });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Site name" description="Shown in the top-left of the navigation bar.">
        <Field label="English">
          <TextInput
            value={content.siteName.en}
            onChange={(e) =>
              setContent({
                ...content,
                siteName: { ...content.siteName, en: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Persian">
          <TextInput
            dir="rtl"
            value={content.siteName.fa}
            onChange={(e) =>
              setContent({
                ...content,
                siteName: { ...content.siteName, fa: e.target.value },
              })
            }
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Contact details"
        description="Used in the Contact section and the nav email link. Shared across both languages."
      >
        <Field label="Primary email">
          <TextInput
            value={content.email}
            onChange={(e) => setContent({ ...content, email: e.target.value })}
          />
        </Field>
        <Field label="Secondary email">
          <TextInput
            value={content.email2}
            onChange={(e) => setContent({ ...content, email2: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={content.phone}
            onChange={(e) => setContent({ ...content, phone: e.target.value })}
          />
        </Field>
        <Field label="Fax">
          <TextInput
            value={content.fax}
            onChange={(e) => setContent({ ...content, fax: e.target.value })}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Portrait photo"
        description="Replaces the photo mounted in the hero specimen card."
      >
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-20 overflow-hidden border border-[#c7bc9c]">
            <Image
              src={content.portraitImage}
              alt="Current portrait"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              disabled={uploading}
              className="text-[13px]"
            />
            {uploading && <p className="mt-1 text-[12px] text-[#726c52]">Uploading…</p>}
            {uploadError && (
              <p className="mt-1 text-[12px] text-[#a13c2a]">{uploadError}</p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ---------- Hero ----------

function HeroTab({
  content,
  setContent,
  locale,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  locale: Locale;
}) {
  const hero = content.locales[locale].hero;
  const dir = locale === "fa" ? "rtl" : "ltr";

  function update(patch: Partial<typeof hero>) {
    setContent({
      ...content,
      locales: {
        ...content.locales,
        [locale]: {
          ...content.locales[locale],
          hero: { ...hero, ...patch },
        },
      },
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Headline">
        <Field label="Eyebrow line">
          <TextInput dir={dir} value={hero.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Name" hint="Use a line break for the two-line display name.">
          <TextArea
            dir={dir}
            value={hero.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </Field>
        <Field label="Intro paragraph">
          <TextArea dir={dir} value={hero.intro} onChange={(e) => update({ intro: e.target.value })} />
        </Field>
        <Field label="Department line">
          <TextArea dir={dir} value={hero.dept} onChange={(e) => update({ dept: e.target.value })} />
        </Field>
      </SectionCard>

      <SectionCard title="Buttons & stats">
        <Field label="Publications button text">
          <TextInput dir={dir} value={hero.pubsCta} onChange={(e) => update({ pubsCta: e.target.value })} />
        </Field>
        <Field label="Contact button text">
          <TextInput dir={dir} value={hero.contactCta} onChange={(e) => update({ contactCta: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Career label">
            <TextInput dir={dir} value={hero.statCareerLabel} onChange={(e) => update({ statCareerLabel: e.target.value })} />
          </Field>
          <Field label="Career value">
            <TextInput dir={dir} value={hero.statCareerValue} onChange={(e) => update({ statCareerValue: e.target.value })} />
          </Field>
          <Field label="Since label">
            <TextInput dir={dir} value={hero.statSinceLabel} onChange={(e) => update({ statSinceLabel: e.target.value })} />
          </Field>
          <Field label="Since value">
            <TextInput dir={dir} value={hero.statSinceValue} onChange={(e) => update({ statSinceValue: e.target.value })} />
          </Field>
          <Field label="Ph.D. label">
            <TextInput dir={dir} value={hero.statPhdLabel} onChange={(e) => update({ statPhdLabel: e.target.value })} />
          </Field>
          <Field label="Ph.D. value">
            <TextInput dir={dir} value={hero.statPhdValue} onChange={(e) => update({ statPhdValue: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Specimen card label" description="The small caption under the portrait.">
        <Field label="Name">
          <TextInput dir={dir} value={hero.specimenName} onChange={(e) => update({ specimenName: e.target.value })} />
        </Field>
        <Field label="Place">
          <TextInput dir={dir} value={hero.specimenPlace} onChange={(e) => update({ specimenPlace: e.target.value })} />
        </Field>
        <Field label="Determination line">
          <TextInput dir={dir} value={hero.specimenDet} onChange={(e) => update({ specimenDet: e.target.value })} />
        </Field>
      </SectionCard>
    </div>
  );
}

// ---------- Research ----------

function ResearchTab({
  content,
  setContent,
  locale,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  locale: Locale;
}) {
  const research = content.locales[locale].research;
  const dir = locale === "fa" ? "rtl" : "ltr";

  function update(patch: Partial<typeof research>) {
    setContent({
      ...content,
      locales: {
        ...content.locales,
        [locale]: { ...content.locales[locale], research: { ...research, ...patch } },
      },
    });
  }

  return (
    <div className="max-w-2xl">
      <SectionCard title="Overview section">
        <Field label="Eyebrow">
          <TextInput dir={dir} value={research.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Heading">
          <TextInput dir={dir} value={research.heading} onChange={(e) => update({ heading: e.target.value })} />
        </Field>
        <Field label="Paragraph 1">
          <TextArea dir={dir} rows={5} value={research.p1} onChange={(e) => update({ p1: e.target.value })} />
        </Field>
        <Field label="Paragraph 2">
          <TextArea dir={dir} rows={5} value={research.p2} onChange={(e) => update({ p2: e.target.value })} />
        </Field>
      </SectionCard>
    </div>
  );
}

// ---------- Record ----------

function RecordTab({
  content,
  setContent,
  locale,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  locale: Locale;
}) {
  const record = content.locales[locale].record;
  const dir = locale === "fa" ? "rtl" : "ltr";

  function update(patch: Partial<typeof record>) {
    setContent({
      ...content,
      locales: {
        ...content.locales,
        [locale]: { ...content.locales[locale], record: { ...record, ...patch } },
      },
    });
  }

  function updateEntry(i: number, patch: Partial<(typeof record.entries)[number]>) {
    const entries = record.entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e));
    update({ entries });
  }

  function updateProject(i: number, patch: Partial<(typeof record.projects)[number]>) {
    const projects = record.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    update({ projects });
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Section headings">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput dir={dir} value={record.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Heading">
            <TextInput dir={dir} value={record.heading} onChange={(e) => update({ heading: e.target.value })} />
          </Field>
          <Field label="Projects heading">
            <TextInput dir={dir} value={record.projectsHeading} onChange={(e) => update({ projectsHeading: e.target.value })} />
          </Field>
          <Field label='"Sub-projects" word'>
            <TextInput dir={dir} value={record.subProjects} onChange={(e) => update({ subProjects: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Timeline entries"
        description="Education & appointments, in display order."
      >
        <div className="space-y-4">
          {record.entries.map((entry, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 border-t border-[#d6ccac] pt-4 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_1fr_1fr_auto] sm:items-start">
              <TextInput dir={dir} placeholder="Year" value={entry.when} onChange={(e) => updateEntry(i, { when: e.target.value })} />
              <TextInput dir={dir} placeholder="Title" value={entry.what} onChange={(e) => updateEntry(i, { what: e.target.value })} />
              <TextInput dir={dir} placeholder="Institution" value={entry.where} onChange={(e) => updateEntry(i, { where: e.target.value })} />
              <Button
                variant="danger"
                type="button"
                className="justify-self-start sm:justify-self-auto"
                onClick={() => update({ entries: record.entries.filter((_, idx) => idx !== i) })}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={() => update({ entries: [...record.entries, { when: "", what: "", where: "" }] })}
        >
          + Add entry
        </Button>
      </SectionCard>

      <SectionCard title="Long-running projects">
        <div className="space-y-5">
          {record.projects.map((project, i) => (
            <div key={i} className="space-y-2 border-t border-[#d6ccac] pt-4 first:border-t-0 first:pt-0">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <TextInput dir={dir} placeholder="Title" value={project.title} onChange={(e) => updateProject(i, { title: e.target.value })} />
                <TextInput dir={dir} placeholder="Span (e.g. 1995 — ongoing)" value={project.span} onChange={(e) => updateProject(i, { span: e.target.value })} />
                <TextInput dir={dir} placeholder="Count (e.g. 20 sub-projects)" value={project.count} onChange={(e) => updateProject(i, { count: e.target.value })} />
                <Button
                  variant="danger"
                  type="button"
                  className="justify-self-start sm:justify-self-auto"
                  onClick={() => update({ projects: record.projects.filter((_, idx) => idx !== i) })}
                >
                  Remove
                </Button>
              </div>
              <TextArea dir={dir} placeholder="Description" value={project.body} onChange={(e) => updateProject(i, { body: e.target.value })} />
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={() =>
            update({
              projects: [...record.projects, { title: "", span: "", count: "", body: "" }],
            })
          }
        >
          + Add project
        </Button>
      </SectionCard>
    </div>
  );
}

// ---------- Teaching ----------

function CourseListEditor({
  label,
  courses,
  dir,
  onChange,
}: {
  label: string;
  courses: string[];
  dir: "ltr" | "rtl";
  onChange: (courses: string[]) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#8e9a81]">
        {label}
      </p>
      <div className="mt-2 space-y-2">
        {courses.map((course, i) => (
          <div key={i} className="flex gap-2">
            <TextInput
              dir={dir}
              value={course}
              onChange={(e) => {
                const next = [...courses];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              variant="danger"
              type="button"
              onClick={() => onChange(courses.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button variant="secondary" type="button" onClick={() => onChange([...courses, ""])}>
        + Add course
      </Button>
    </div>
  );
}

function TeachingTab({
  content,
  setContent,
  locale,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  locale: Locale;
}) {
  const teaching = content.locales[locale].teaching;
  const dir = locale === "fa" ? "rtl" : "ltr";

  function update(patch: Partial<typeof teaching>) {
    setContent({
      ...content,
      locales: {
        ...content.locales,
        [locale]: { ...content.locales[locale], teaching: { ...teaching, ...patch } },
      },
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SectionCard title="Section headings">
        <Field label="Eyebrow">
          <TextInput dir={dir} value={teaching.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Heading">
          <TextInput dir={dir} value={teaching.heading} onChange={(e) => update({ heading: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label='"Undergraduate" label'>
            <TextInput dir={dir} value={teaching.undergrad} onChange={(e) => update({ undergrad: e.target.value })} />
          </Field>
          <Field label='"Graduate" label'>
            <TextInput dir={dir} value={teaching.grad} onChange={(e) => update({ grad: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Courses">
        <CourseListEditor
          label={teaching.undergrad || "Undergraduate"}
          courses={teaching.undergradCourses}
          dir={dir}
          onChange={(courses) => update({ undergradCourses: courses })}
        />
        <CourseListEditor
          label={teaching.grad || "Graduate"}
          courses={teaching.gradCourses}
          dir={dir}
          onChange={(courses) => update({ gradCourses: courses })}
        />
      </SectionCard>
    </div>
  );
}

// ---------- Contact ----------

function ContactTab({
  content,
  setContent,
  locale,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  locale: Locale;
}) {
  const contact = content.locales[locale].contact;
  const dir = locale === "fa" ? "rtl" : "ltr";

  function update(patch: Partial<typeof contact>) {
    setContent({
      ...content,
      locales: {
        ...content.locales,
        [locale]: { ...content.locales[locale], contact: { ...contact, ...patch } },
      },
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <SectionCard title="Section text">
        <Field label="Eyebrow">
          <TextInput dir={dir} value={contact.eyebrow} onChange={(e) => update({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Heading">
          <TextArea dir={dir} value={contact.heading} onChange={(e) => update({ heading: e.target.value })} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Email label">
            <TextInput dir={dir} value={contact.emailLabel} onChange={(e) => update({ emailLabel: e.target.value })} />
          </Field>
          <Field label="Telephone label">
            <TextInput dir={dir} value={contact.telLabel} onChange={(e) => update({ telLabel: e.target.value })} />
          </Field>
          <Field label="Fax label">
            <TextInput dir={dir} value={contact.faxLabel} onChange={(e) => update({ faxLabel: e.target.value })} />
          </Field>
        </div>
        <Field label="Department label">
          <TextInput dir={dir} value={contact.deptLabel} onChange={(e) => update({ deptLabel: e.target.value })} />
        </Field>
        <Field label="Department address" hint="Line break supported.">
          <TextArea dir={dir} value={contact.deptValue} onChange={(e) => update({ deptValue: e.target.value })} />
        </Field>
        <Field label="Footer text" hint='Appears after "© year Naser Safaie ·".'>
          <TextInput dir={dir} value={contact.footer} onChange={(e) => update({ footer: e.target.value })} />
        </Field>
      </SectionCard>
    </div>
  );
}

// ---------- Publications ----------

function emptyPublication(nextNum: number): Publication {
  return {
    num: nextNum,
    authors: "",
    year: new Date().getFullYear(),
    title: "",
    venue: "",
    cited: 0,
    doi: null,
    category: "scopus",
  };
}

function PublicationsTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
}) {
  const [query, setQuery] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Publication | null>(null);

  const publications = content.publications;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return publications;
    return publications.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q)
    );
  }, [publications, query]);

  function startEdit(index: number) {
    setEditingIndex(index);
    setDraft({ ...publications[index] });
  }

  function startNew() {
    const nextNum = Math.max(0, ...publications.map((p) => p.num)) + 1;
    setEditingIndex(-1);
    setDraft(emptyPublication(nextNum));
  }

  function cancelEdit() {
    setEditingIndex(null);
    setDraft(null);
  }

  function saveDraft() {
    if (!draft) return;
    if (editingIndex === -1) {
      setContent({ ...content, publications: [draft, ...publications] });
    } else if (editingIndex !== null) {
      const next = publications.map((p, i) => (i === editingIndex ? draft : p));
      setContent({ ...content, publications: next });
    }
    cancelEdit();
  }

  function removePublication(index: number) {
    if (!confirm("Delete this publication? This can't be undone until you save.")) return;
    setContent({ ...content, publications: publications.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TextInput
          placeholder="Search publications…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-[#726c52]">
            {publications.length} total
          </span>
          <Button type="button" onClick={startNew}>
            + Add publication
          </Button>
        </div>
      </div>

      {draft && (
        <div className="mb-6 border border-[#a85a2a] bg-[#f2eee0] p-5">
          <h3 className="font-serif text-lg">
            {editingIndex === -1 ? "New publication" : "Edit publication"}
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <TextInput
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Authors">
              <TextInput
                value={draft.authors}
                onChange={(e) => setDraft({ ...draft, authors: e.target.value })}
              />
            </Field>
            <Field label="Venue">
              <TextInput
                value={draft.venue}
                onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Year">
                <TextInput
                  type="number"
                  value={draft.year}
                  onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}
                />
              </Field>
              <Field label="Cited (blank = n/a)">
                <TextInput
                  type="number"
                  value={draft.cited ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      cited: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Entry #">
                <TextInput
                  type="number"
                  value={draft.num}
                  onChange={(e) => setDraft({ ...draft, num: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="DOI (blank = none)">
              <TextInput
                value={draft.doi ?? ""}
                onChange={(e) => setDraft({ ...draft, doi: e.target.value || null })}
              />
            </Field>
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value as Publication["category"] })
                }
                className="w-full border border-[#c7bc9c] bg-white px-3 py-2 text-[14px] text-[#23200f] focus:border-[#a85a2a] focus:outline-none"
              >
                <option value="scopus">Scopus-indexed</option>
                <option value="early">Early career</option>
              </select>
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="button" onClick={saveDraft}>
              {editingIndex === -1 ? "Add" : "Update"}
            </Button>
            <Button type="button" variant="secondary" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="max-h-[600px] overflow-y-auto border border-[#c7bc9c]">
        {filtered.map((p) => {
          const realIndex = publications.indexOf(p);
          return (
            <div
              key={`${p.category}-${p.num}-${realIndex}`}
              className="flex items-start justify-between gap-4 border-b border-[#d6ccac] bg-[#f2eee0] p-3.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[13.5px] leading-snug">{p.title || "(untitled)"}</p>
                <p className="mt-1 font-mono text-[11px] text-[#726c52]">
                  {p.year} · No. {p.num} · {p.authors}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" type="button" onClick={() => startEdit(realIndex)}>
                  Edit
                </Button>
                <Button variant="danger" type="button" onClick={() => removePublication(realIndex)}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-[13.5px] text-[#726c52]">No matches.</p>
        )}
      </div>
    </div>
  );
}
