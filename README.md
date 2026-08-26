# Naser Safaie — Portfolio

A Next.js 16 (App Router + TypeScript + Tailwind CSS v4) portfolio site for
Prof. Naser Safaie, Professor of Plant Pathology at Tarbiat Modares
University — with a built-in admin panel to edit every piece of content
(text, translations, publications, and the portrait photo) without
touching code.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000 for the site, and http://localhost:3000/admin
for the admin panel.

### Testing on your phone during development

If you want to preview the site on your phone while running `npm run dev`
on your computer (both on the same WiFi), that's already handled — Next.js
blocks cross-origin requests to its dev assets by default, which without
`allowedDevOrigins` set (already configured in `next.config.ts`) would make
the page load but stay completely unresponsive to taps, since the
JavaScript bundle gets silently rejected. If you ever hit that symptom
again on a different network range, add it to the `allowedDevOrigins`
array in `next.config.ts`. This only affects `next dev` — production
builds are unaffected.

## Build for production

```bash
npm run build
npm run start
```

## ⚠️ Deployment: this needs a persistent Node server

The admin panel saves changes by writing to `content/site-content.json`
on disk. That means it **needs a traditional, always-on Node process** —
for example:

- A VPS or your own server running `npm run start` (optionally behind
  Docker/PM2)
- Any host that keeps a persistent, writable filesystem across requests

**It will not work correctly on Vercel, Netlify, or other
serverless/edge platforms.** Those platforms run your app as ephemeral,
read-only (or request-scoped) functions — an admin edit might appear to
save, then vanish on the next request or the next deploy, because there's
no persistent disk backing it. The public site itself (everything outside
`/admin`) would still work fine on those platforms; only the *editing*
part needs a real server.

If you specifically want serverless hosting *and* live editing, the fix
is to swap the two functions in `src/lib/content-server.ts` (`readContent`
/ `writeContent`) for calls to a real database or a hosted headless CMS —
everything else (API routes, admin UI, validation) can stay as-is, since
they only depend on that one file's interface.

## The admin panel

Visit `/admin` and log in with the password you set as `ADMIN_PASSWORD`.
From there you can edit, in both English and Persian:

- **General** — site name, contact email/phone/fax, portrait photo
- **Hero** — headline, intro, stats, specimen card caption
- **Research** — the overview bio
- **Record** — education/appointment timeline and long-running projects
  (add, edit, remove rows)
- **Teaching** — course lists (add, edit, remove)
- **Publications** — full add/edit/delete on all 177 entries, with search
- **Contact** — section text and address

Click **Save changes** to write everything to disk; the public site picks
it up immediately (it reads content fresh on every request, so there's no
rebuild step or cache to bust).

### Auth model

- Login checks the password against `ADMIN_PASSWORD` and, on success, sets
  an `httpOnly` cookie containing a value signed with HMAC-SHA256 (Node's
  built-in `crypto`, no extra dependencies) and a 12-hour expiry.
- `src/proxy.ts` (Next's middleware convention) blocks unauthenticated
  requests to `/admin/*` and `/api/admin/*` at the edge by checking that
  the cookie is present.
- Every `/api/admin/*` route handler independently re-verifies the
  cookie's signature and expiry server-side before reading or writing
  anything — the proxy check is a fast redirect for page loads, not the
  real security boundary.
- Set `ADMIN_SESSION_SECRET` (see `.env.local.example`) to a separate
  random value in production; otherwise the password itself is reused to
  sign sessions, which works but means rotating the secret requires
  changing the password too.

Content submitted through `PUT /api/admin/content` is validated against
the expected shape (`src/lib/content-validate.ts`) before it's written,
so a malformed request can't corrupt `site-content.json`.

## Project structure

- `content/site-content.json` — **the single source of truth** for every
  piece of editable content: site name, contact info, portrait path, all
  177 publications, and the full English/Persian text dictionaries. Read
  at runtime, not bundled at build time.
- `src/lib/content-types.ts` — shared TypeScript types for that file.
- `src/lib/content-server.ts` — server-only read/write helpers (swap these
  for a database call if you move to serverless — see above).
- `src/lib/content-validate.ts` — runtime shape validation for admin
  writes.
- `src/lib/admin-auth.ts` — session token signing/verification.
- `src/lib/LocaleProvider.tsx` — client context that holds the current
  language and the loaded content; every component reads through
  `useLocale()`.
- `src/app/api/content/route.ts` — public read-only content endpoint.
- `src/app/api/admin/*` — protected login/logout/content/upload endpoints.
- `src/app/admin/` — the admin UI (`login/page.tsx`, `AdminDashboard.tsx`).
- `src/components/` — one component per public section (Hero, Research,
  Record, Teaching, Publications, Contact, Nav, etc.).
- `src/app/fonts/` — self-hosted font files (English + Persian).
- `public/images/` — the profile portrait (admin uploads land here too).

## Updating content

Prefer the admin panel for day-to-day edits — it validates input and
updates both languages consistently. For bulk changes (e.g. importing a
new publication list), it's also fine to edit
`content/site-content.json` directly; it's plain JSON matching the shape
in `src/lib/content-types.ts`.

## Design notes

The page alternates between two section themes down the page, rather than
staying one flat tone throughout:

- **Dark** (Overview/hero, Record, Contact) — a deep botanical near-black
- **Light** (Research, Teaching, Publications) — a warm parchment paper

Both share the same accent trio, tuned separately for contrast on each
background: a terracotta/rust, a moss green, and a navy blue (#183768),
which is exact on the light sections and a brighter tint on the dark
ones so it stays legible either way. The navy also anchors the one
deliberate "signature" flourish — the circular accession stamp on the
portrait, styled after a museum specimen ink stamp — and a hand-drawn
wheat spike motif behind it, nodding to the Fusarium head blight and
Karnal bunt research that anchors the Record section.

Type pairing is Fraunces (display serif), Source Serif 4 (body), and IBM
Plex Mono (labels, data, citations) for English, with Noto Naskh Arabic
and Vazirmatn for Persian — all self-hosted, no runtime font fetch.

To retune the palette, edit the `.theme-dark` and `.theme-light` blocks
in `src/app/globals.css` — every component reads color through those CSS
variables (`--bg`, `--ink`, `--rust`, `--moss`, `--navy`, etc.), so a
change there updates the whole site. Which sections get which theme is
set by the `theme-dark` / `theme-light` class on each `<section>` in
`src/components/`.

## Language (English / فارسی)

The site ships with a built-in EN/FA toggle (top right of the nav), fully
editable from the admin panel. Persian renders right-to-left, with Noto
Naskh Arabic for headlines and Vazirmatn for body/UI text.

- All chrome (nav, headings, bio, timeline, teaching, contact) is stored
  per-locale in `content/site-content.json` under `locales.en` /
  `locales.fa`, and editable per-field in the admin panel.
- The publications list itself is always shown left-to-right in its
  original published language (mostly English, since that's how the
  papers were published) — a short note above the list makes this clear
  in both languages. Only the search box, filters, and sort labels around
  it switch language.
- The chosen language is remembered in the browser via `localStorage`, so
  it persists across visits.

To add a third language, extend the `Locale` type and `LocaleDict` shape
in `src/lib/content-types.ts`, add a matching block under `locales` in
`content/site-content.json`, and add a case for it in the admin panel's
`LocaleToggle` and `Nav`'s language button.
# nasersafaie
