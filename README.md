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

## Build

```
npm install
npm run build
```

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
