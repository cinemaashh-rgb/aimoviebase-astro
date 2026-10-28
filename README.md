# aimoviebase-astro

Astro project for aimoviebase.com — a catalog of AI-generated films, built on
content collections (JSON data files) + dynamic page templates, with a
shared layout, generated search index, sitemap, and SEO redirects.

## Origin of this repository

This repository is an **import of the current project state** from the
GitLab repository `kirillzhigaloff/aimoviebase-astro` (project id `88094982`,
branch `main`, as of commit `ee37c0ae`). The GitLab repository remains the
full historical archive — every commit that built up this project lives
there and was **not** touched or modified as part of this import. This
GitHub repository starts from a single "Initial import" commit rather than
replaying that history, by design: the plan going forward is to do the next
phase of work (light/dark redesign, a new movie-page template, etc.)
directly in this GitHub repository, while GitLab stays as the historical
record of how the project got to this point.

### What was transferred

All of the **text source files that make up the actual Astro application**
were copied byte-for-byte from GitLab via the GitLab API:

- `src/content/**/*.json` — all 6 content collections: **27 creators, 37
  movies, 12 genres, 10 studios, 10 shortdrama entries, 2 awards** (98 data
  files total), plus `src/content/config.ts` (the zod schema).
- `src/layouts/BaseLayout.astro` — the shared page shell (header, footer,
  dark theme, search box, analytics, trailer modal).
- `src/pages/**` — all 19 route files: static pages (`about`, `contact`,
  `privacy`, `terms`, `lists`, `news`, `index`, `shortformdrama`), dynamic
  routes (`movies/[slug]`, `movies/index`, `name/[slug]`, `genre/[genre]`,
  `genre/funny` redirect, `studios/[slug]`, `studios/index`,
  `shortdrama/[slug]`, `awards/[slug]`, `awards/index`), and the generated
  search endpoint `search-data.js.ts`.
- Root config: `.gitignore`, `astro.config.mjs`, `package.json`,
  `vercel.json` (143 legacy-URL redirects), `public/robots.txt`.

**124 files in total**, matching the GitLab source's Astro application
exactly (content + templates + config) — nothing in this list was
paraphrased, summarized, or rewritten; every file was fetched from GitLab
and written here unchanged.

### What was intentionally left out

- **~140 legacy static HTML reference files** that exist at the GitLab
  repo's root (`/awards`, `/genre`, `/movies`, `/name`, `/shortdrama`,
  `/studios` as raw `.html`, plus assorted root `.html` pages and a legacy
  `search-data.js`). Per the GitLab README, these are the original
  hand-written site kept purely as source material during the Astro
  migration — they are **not served by the Astro build** and every section
  they covered has already been migrated into `src/content` + `src/pages`.
  Carrying them into this repo would just be dead weight.

### Known limitation: binary images were NOT transferred

- `public/favicon.ico` and all files under `public/images/{backdrops,
  brand, favicon, people, posters}/*` — **roughly 87 binary image files** —
  could **not** be transferred by this import. The tool used to read
  GitLab file contents (the GitLab API's file-content endpoint, as exposed
  through this environment's tooling) can only return **text** file
  content; every attempt to fetch a binary file (confirmed directly on
  `public/favicon.ico`) fails with an explicit "file is binary and cannot
  be returned as text" error, with no base64 or binary-safe fallback mode
  available. There is also no direct network path from this environment to
  `gitlab.com` (outbound requests are blocked by network policy), which
  rules out a tarball/archive-download workaround.

  **These images genuinely exist** in the GitLab repository as real binary
  blobs (per the GitLab-side README, they were already verified there as
  non-placeholder files) — this is a one-time tooling limitation of this
  import pass, not a statement that the images are missing or lost.

  **To finish the transfer, do one of the following manually:**
  1. Clone the GitLab repo directly with `git` (with proper GitLab
     credentials) and copy `public/images/` and `public/favicon.ico` into
     this repo, or
  2. Download each file from the GitLab web UI / API with an authenticated
     client that supports binary content, and commit them here under the
     same paths, or
  3. Re-run an import pass from an environment that has either direct
     network access to GitLab or a tool capable of fetching binary file
     content (e.g. a base64-returning API call).

  Until this is done, every `<img>` reference in the built site (posters,
  people photos, brand assets, favicon) will 404 in production, even though
  the HTML will render and the build itself will very likely still succeed
  (Astro's static `public/` directory copy does not fail the build over
  missing files — it just won't find anything to copy for the files that
  aren't there).

## Redesign phase (light theme, from 12 real HTML mockups)

Starting from this point, **GitLab is no longer the source of truth for
design** — all further work happens directly in this GitHub repository.
GitLab stays only as the historical archive described above. The content
collections transferred in the import above were **not** re-transferred or
overwritten; they were only extended with new optional fields where a
mockup needed data the schema didn't have yet (see "Schema additions"
below).

The user supplied 12 real, hand-coded HTML mockup files (not AI-generated
images) as the design source of truth. Each one is listed below with what
was actually ported and what's still open.

### Design tokens

Every mockup defines its own slightly different `:root` (different
variable names, different near-black header hex values, different blue
accents). They're consistent in spirit — light theme, dark header/footer,
Georgia-serif headings — but not byte-identical. The About page's mockup
was explicitly called out as the global theme source, so `BaseLayout.astro`
now defines one canonical set using its names/values:

```
--ink:#17191d   --muted:#5d6776   --muted2:#727d8e   --line:#e5e7eb
--black:#080b0d --blue:#245bb9    --bg:#fff          --soft:#f6f7f9
--serif:Georgia,'Times New Roman',serif   --sans:Arial,Helvetica,sans-serif
```

`--fg`, `--accent`, `--bg-elev`, `--border` are kept as aliases to the above
so pages not touched in this pass (contact/privacy/terms/news, which had no
mockup of their own) still render consistently without being rewritten.

### Per-mockup status

| # | Mockup file | Ported to | Status |
|---|---|---|---|
| 1 | `aimb_about_without_tagline.html` | `BaseLayout.astro` (tokens/header/footer) | Tokens and header/footer fully adopted site-wide. `about.astro`'s own copy/layout (principles grid, join CTA) was **not** rebuilt from this mockup — out of the brief's suggested work order; it still renders in the new theme but with its pre-existing simpler content. |
| 2 | `aimb_film_page_updated.html` (= byte-identical `aimb_film_page_updated` duplicate upload) | `movies/[slug].astro` | Fully ported: hero, tags, watch/share actions, audience reactions, editorial review + verdict, "More like this", sidebar (director/studio/crew/tools/awards/lists). |
| 3 | `aimb_ai_series_chronicles_of_bone_matched.html` | `movies/[slug].astro` (shared template) | See "Series decision" below — no separate template. |
| 4 | `aimb_astana_festival_2026.html` | `awards/[slug].astro` | Ported: winner grid with award chips, structured prize box, additional-awards grid. **"Finalists" section intentionally omitted** — the mockup's finalist entries had no real titles/names and were self-disclaimed as placeholder content; fabricating that section to match the mockup would mean publishing fake data, so it's left out and flagged in-page instead. |
| 5 | `aimb_studio_phantom_x.html` | `studios/[slug].astro` | Ported: hero, team column, films grid with sort, creative-stack tool grid. **Simplified from a tabbed Movies/Creative-Stack UI to two stacked sections** — same information, fewer moving parts, given the time budget. |
| 6 | `aimb_creator_kavan_cardoza_laurels_bw.html` | `name/[slug].astro` | Ported: alias, role pill, social links, bio, facts, awards column, filterable/sortable filmography. **"Creative stack" carousel simplified to a static grid** (no horizontal-scroll carousel) for the same reason as #5. |
| 7 | `aimb_list_detail.html` | `lists/[slug].astro` | Ported: grid/rank badges, List order/Newest/Oldest/A-Z sort. List-view toggle (grid vs. list layout) from the mockup was not ported — grid-only for v1. |
| 8 | `aimb_action_genre_final.html` | `genre/[genre].astro` | Ported: full-bleed hero-banner treatment (solid dark background, since no genre artwork is available yet — see "Images" below), Movies/Series tabs, Newest/Oldest/A-Z sort, "Load more" pagination. |
| 9 | `aimb_festivals_awards_load_more.html` | `awards/index.astro` | Ported: directory table + "Load more" reveal for festivals without a dedicated detail page (those link out to the festival's own site). |
| 10 | `aimb_home_editorial_swapped.html` | `index.astro` | Ported: hero, Notable Movies & Series, Short Drama teaser, festivals strip, newsletter stub (not wired to a real provider — same as the original mockup's own disclaimer). |
| 11 | `aimb_movies_genres_interactive.html` | `movies/index.astro` | **This is the key page per the brief.** Ported its real structure (genre sidebar + progressive "Load more genres" reveal, DOM-reorder sort pattern) but **showing every real film per genre**, not the mockup's 4-per-genre preview. The brief separately specified a Popular/Newest/Highest-Rated/A-Z sort for this page, which isn't actually present in this mockup file (it only has the genre-reveal UI, no sort control) — both were kept: the real genre-browse UI from the mockup, plus a sort dropdown with Newest and A-Z working and Popular/Highest Rated visibly present but disabled (grayed out, "coming soon") since there's no real rating/view data yet. |
| 12 | `aimb_lists_page.html` | `lists/index.astro` | Ported: poster-strip grid, counts, descriptions. The mockup's `extra-card` "Load more" reveal (hidden cards shown on click) was simplified to showing all 4 real lists at once, since there are only 4 so far — not enough to warrant pagination. |

### Series decision (task — separate template or not?)

**Decision: one shared `movies/[slug].astro` template**, not a separate
series page. The series mockup is ~95% structurally and stylistically
identical to the movie mockup (same hero/reactions/review/verdict/
sidebar/related-grid), and even its own `<style>` block carries a second,
later rule-set explicitly commented *"Shared AIMB Movie / AI Series design
tokens and typography"* that overrides the page-local one to match the
movie page exactly — i.e. the mockup itself treats these as one design
system. The only real differences are text: the eyebrow ("AI Movie" vs "AI
Series"), the facts line (season/episode count), sidebar labels
(Director→Creator, Crew→Team), and the related-section heading ("More like
this" vs "Related"). All of these are handled with a single
`m.type === 'series'` conditional in the template. There is no dedicated
episode-list UI in either mockup — episode count is just text in the facts
line — so `movies/[slug].astro` renders a simple episode list only when
`episodes[]` has entries, which is a bonus beyond what either mockup shows.

### Schema additions (all optional, no existing record touched)

- **movies**: `audienceReactions[]`, `editorialReview{paragraphs,verdict}`,
  `crew[]`, `seasons`. All optional/empty by default — only
  `the-chronicles-of-bone` would benefit from `seasons` today, and no movie
  record has been back-filled with reactions/review/crew yet (that's
  editorial content, not something to fabricate here).
- **creators**: `alias`, `socialLinks{youtube,x}`, `awards[]`.
- **studios**: `subtitle`, `founded`, `team[]`.
- **awards** (`winners[]`): `prize` (structured amount, separate from the
  free-text `place` field). One real winner (Runway AIFF 2026, *A Face Only
  A Mother Could Love*) now uses it (`$50,000`) as a worked example.
- **New `lists` collection** (`src/content/lists/*.json`): `{name,
  description, placeholder, movies[]}`. 4 starter lists exist:
  `editors-picks` and `award-winners-nominees` are real groupings from
  existing data (hand-picked / "has an award" respectively — not fake);
  `sci-fi-essentials` and `experimental-no-camera-filmmaking` are
  `placeholder: true` — mechanically grouped by genre, exactly as the brief
  allowed as a stand-in until there's a real list-curation workflow. The
  `/lists` and `/lists/[slug]` pages flag placeholder lists in the UI.

### Route naming: `/short-drama` vs `/shortformdrama`

All 12 mockups consistently link to `/short-drama`; the pre-redesign route
was `/shortformdrama`. Renamed the real page to `/short-drama.astro` and
left `/shortformdrama.astro` as a permanent 301 redirect, so existing
inbound links/bookmarks keep working. `search-data.js.ts` updated to point
at the new path.

### Interactive filter/sort pattern

Three different client-side filter/sort implementations appeared across
the mockups (template-literal `innerHTML` rebuild on the creator page;
`document.createElement` + pagination state on the genre page; capturing
real pre-rendered DOM nodes and reordering them with `replaceChildren` on
the studio page). **The studio page's pattern was used everywhere** in this
redesign — it keeps every title/link server-rendered (good for SEO and for
working with JS disabled) and lets JS only change display order, rather
than rebuilding markup from a client-side data array.

### Settled decisions honored as given (not re-litigated)

- Bookmark/watchlist icons: not added — none of the 12 mockups actually show
  one on a page template (the brief mentioned this as a general site
  constraint, but no page design calls for the icon), so there's nothing to
  stub out yet.
- Watch/trailer buttons remain wired to the existing `openTrailer()`
  YouTube-embed modal from before the redesign; movies with no `youtubeId`
  show a disabled "Watch" button rather than a dead link.
- Popular / Highest Rated sort options are present in the UI (so the
  control's final shape is already correct) but disabled, since there's no
  real rating or view-count data yet (pending Supabase).

### Images

Per the brief, `/images/*` has still not been transferred into this repo
(see the binary-file limitation above, now compounded by the redesign
needing new imagery types the original site never had — genre hero
backgrounds, list cover collages). The build succeeds regardless: every
template falls back to a text/initial placeholder (`.posterFallback`, a
solid-color genre hero, etc.) whenever `poster`/`photo`/artwork fields are
missing, rather than relying on a broken `<img>` tag's alt text.

### What did not get done in this pass

- `about.astro` content/layout was not rebuilt from its mockup (see table
  row #1) — only its tokens were adopted.
- `contact.astro`, `privacy.astro`, `terms.astro` have no corresponding
  mockup and were left as pre-existing content, just inheriting the new
  theme automatically through the shared CSS variables.
- No tabbed UI or horizontal-scroll carousel anywhere (simplified to
  stacked sections / static grids — see rows #5 and #6).
- `lists/[slug].astro`'s grid/list view toggle from the mockup was not
  ported (grid-only).
- Real rating/popularity data (Popular, Highest Rated sort modes) — blocked
  on Supabase, by design.
- Real watchlist/bookmark sync — blocked on Supabase, by design; no UI for
  it was added since no mockup included one.

## Deployment

The user decided to deploy on **Cloudflare Pages** instead of Vercel.

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Framework preset:** Astro — Cloudflare Pages auto-detects this from
  `package.json`/`astro.config.mjs`, so it's usually enough to just point it
  at the repo and let it pick "Astro" itself; set it manually to the above
  two values if it doesn't.
- **No `@astrojs/cloudflare` adapter is needed.** That adapter is only for
  Astro's SSR/edge-functions mode; this site uses `output: 'static'` in
  `astro.config.mjs`, and Cloudflare Pages serves a plain static `dist/`
  directory natively with no adapter at all. (SSR — needed later for
  reviews — would be a separate, later migration of its own.)
  `astro.config.mjs` otherwise has nothing Vercel-specific in it (no
  `@astrojs/vercel`, no Vercel-only config keys) that would need changing
  for Cloudflare.
- **Legacy `.html` redirects (143 of them):** Cloudflare Pages doesn't read
  `vercel.json`, so these are also generated as `public/_redirects` in
  Cloudflare's own plain-text format (`source  destination  status`, one
  per line), converted straight from the same rules in `vercel.json` —
  same source → destination mapping, same 301 status, nothing
  re-derived or reinvented. `vercel.json` is kept as-is (not deleted) so a
  return to Vercel stays a drop-in option; `public/_redirects` is copied
  into `dist/_redirects` by the plain Astro static build, verified after
  each build.

## Build

```
npm install
npm run build
```

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
