import { defineCollection, z } from 'astro:content';

const movies = defineCollection({
  type: 'data',
  schema: z.object({
    // Stable UUID v4, generated once and fixed — independent of slug/title,
    // so it survives future renames. Reserved for the Supabase phase
    // (ratings/reviews keyed by movie_id rather than by slug).
    movie_id: z.string().uuid(),
    title: z.string(),
    year: z.number(),
    type: z.enum(['movie', 'series']).default('movie'),
    duration: z.string().optional(),
    genres: z.array(z.string()).default([]),
    country: z.string().optional(),
    // Optional: a couple of records only ever had an award line to go on,
    // which used to get stuffed in here as a fake "synopsis" — duplicating
    // the real Awards box and reading like a plot summary when it isn't
    // one. Leave it unset rather than invent real plot text we don't have.
    synopsis: z.string().optional(),
    poster: z.string().optional(),
    youtubeId: z.string().optional(),
    // Fallback for a film that isn't hosted on YouTube (e.g. Bilibili) —
    // the Watch button links out directly instead of opening the YouTube
    // embed modal. Only used when youtubeId is unset.
    watchUrl: z.string().optional(),
    director: z.object({
      name: z.string(),
      slug: z.string().optional(),
    }).optional(),
    studio: z.string().optional(),
    aiTools: z.array(z.string()).default([]),
    awards: z.array(z.string()).default([]),
    episodes: z.array(z.object({
      title: z.string(),
      youtubeId: z.string().optional(),
    })).optional(),
    // --- Redesign-phase additions (all optional — no existing record needs
    // to supply these, and pages must render fine without them) ---
    // Manually curated by an editor; empty/absent by default. Not
    // user-submitted, not aggregated from any rating system.
    audienceReactions: z.array(z.object({
      quote: z.string(),
      author: z.string(),
    })).optional(),
    // The "AIMB editorial review" block from the movie-page mockup: a short
    // multi-paragraph write-up plus a one-line verdict.
    editorialReview: z.object({
      paragraphs: z.array(z.string()),
      verdict: z.string(),
    }).optional(),
    // Named crew credits beyond the single `director` field (e.g. editor,
    // composer, VFX lead) — shown in the movie-page sidebar when present.
    crew: z.array(z.object({
      name: z.string(),
      role: z.string(),
      slug: z.string().optional(),
    })).optional(),
    // Season count for `type: 'series'` entries, used in the facts line
    // ("1 Season (6 episodes)"). Purely descriptive; `episodes` above
    // still holds the actual per-episode data.
    seasons: z.number().optional(),
  }),
});

const creators = defineCollection({
  type: 'data',
  schema: z.object({
    // Stable UUID v4, same rationale as movie_id — reserved for Supabase
    // (watchlists, and possibly comments on creators in the future).
    creator_id: z.string().uuid(),
    name: z.string(),
    role: z.string().optional(),
    studio: z.object({
      name: z.string(),
      slug: z.string().optional(),
    }).optional(),
    basedIn: z.string().optional(),
    knownFor: z.array(z.string()).default([]),
    bio: z.string(),
    bioMore: z.string().optional(),
    photo: z.string().optional(),
    films: z.array(z.string()).default([]),
    // --- Redesign-phase additions (optional) ---
    alias: z.string().optional(), // e.g. "Kavan the Kid"
    socialLinks: z.object({
      youtube: z.string().optional(),
      x: z.string().optional(),
    }).optional(),
    awards: z.array(z.object({
      title: z.string(),
      note: z.string().optional(), // e.g. "Grand Prix — Film Title"
    })).optional(),
  }),
});

const studios = defineCollection({
  type: 'data',
  schema: z.object({
    // Stable UUID v4, same rationale as movie_id.
    studio_id: z.string().uuid(),
    name: z.string(),
    basedIn: z.string().optional(),
    description: z.string(),
    descriptionMore: z.string().optional(),
    films: z.array(z.string()).default([]),
    // --- Redesign-phase additions (optional) ---
    subtitle: z.string().optional(), // e.g. "Independent AI film studio"
    logo: z.string().optional(), // square studio logo/mark, matches the mockup's .studio-logo
    founded: z.number().optional(),
    team: z.array(z.object({
      name: z.string(),
      role: z.string(),
    })).optional(),
  }),
});

const genres = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    // Optional overrides for the <title>/<meta description> tags only —
    // the on-page H1 and hero paragraph keep using name/description above.
    // Lets the meta copy carry genre-specific SEO keywords (e.g. "dark
    // fantasy") without changing the shorter, simpler on-page text.
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    films: z.array(z.string()).default([]),
    // Optional hero banner background for the genre page; most genres have
    // none and fall back to the plain dark hero.
    heroImage: z.string().optional(),
    // Attribution for heroImage when it's an actual still from a catalog
    // film (rather than generic mood art) — movieSlug must match an id in
    // the `movies` collection so the credit always reflects real, current
    // catalog data (title/year) instead of a hand-typed copy that can go
    // stale. Only meaningful alongside heroImage.
    heroCredit: z.object({
      movieSlug: z.string(),
    }).optional(),
  }),
});

// Vertical/short-form AI drama. Some entries are published titles with a
// full detail page; others are sub-genre categories with nothing published
// yet ("coming soon") — the original site kept these as separate stub pages
// with an empty state, so we fold both into one collection distinguished by
// `status` rather than migrating them as two unrelated content types.
const shortdrama = defineCollection({
  type: 'data',
  schema: z.object({
    // Stable UUID v4, same rationale as movie_id.
    show_id: z.string().uuid(),
    title: z.string(),
    // The title as originally released (e.g. the Chinese title for a
    // Chinese-language microdrama), shown as a small line under the
    // English display title on the detail page. Optional — only set for
    // titles that are localized/English display names of a foreign
    // original.
    originalTitle: z.string().optional(),
    status: z.enum(['published', 'coming-soon']).default('published'),
    tagline: z.string().optional(),
    year: z.number().optional(),
    episodes: z.number().optional(),
    platform: z.string().optional(),
    badges: z.array(z.string()).default([]),
    description: z.string().optional(),
    descriptionMore: z.string().optional(),
    creatorName: z.string().optional(),
    creatorRole: z.string().optional(),
    watchUrl: z.string().optional(),
    poster: z.string().optional(),
    // --- Redesign-phase additions (all optional, mirroring the equivalent
    // fields already on `movies` — see that collection's comments for the
    // rationale). Nothing existing has to supply these; the page must
    // render fine without any of them. ---
    audienceReactions: z.array(z.object({
      quote: z.string(),
      author: z.string(),
    })).optional(),
    editorialReview: z.object({
      paragraphs: z.array(z.string()),
      verdict: z.string(),
    }).optional(),
    // The "AIMB Quality Index" / "Slop or Cinema?" widget. A weighted 0-100
    // score built from named sub-metrics (each 0-10, with its own display
    // weight in %). Entirely optional and editor-supplied — there is no
    // scoring engine, and a title with no `qualityIndex` simply doesn't
    // render the widget rather than showing a fabricated number. `note`
    // exists so a score that is itself illustrative/unofficial (as opposed
    // to a confident published rating) can say so on the page, instead of
    // silently presenting a demo figure as an editorial verdict.
    qualityIndex: z.object({
      score: z.number().min(0).max(100),
      breakdown: z.array(z.object({
        label: z.string(),
        score: z.number().min(0).max(10),
        weight: z.number().min(0).max(100),
      })),
      note: z.string().optional(),
    }).optional(),
  }),
});

// Award/festival detail pages. The two real pages (AAIFF, Runway AIFF) have
// different internal shapes (AAIFF groups winners into named competitions;
// Runway groups them into year-by-year ceremonies with a headline Grand Prix
// winner plus a flat sub-list of other prizes), so `sections` is a flexible
// shared structure: a labeled group (competition name or year) containing
// winners, each optionally linking to a real movie/creator page when one
// exists in this repo, plus a flat `notes` sub-list for secondary prizes
// that mirrors the original's own flat "other awards" rows.
const awards = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    location: z.string().optional(),
    dates: z.string().optional(),
    organizer: z.string().optional(),
    siteUrl: z.string().optional(),
    // Short one-sentence intro shown next to the h1. Falls back to
    // `description` when not set, so festivals we haven't given a dedicated
    // lead line for still render the same as before.
    lead: z.string().optional(),
    description: z.string(),
    // SEO-only <meta description> override (and OG/Twitter description).
    // The on-page "About" paragraph and the `lead` fallback above keep
    // using `description` verbatim — this field never renders in the
    // page body, only in <head>. Falls back to `description` when unset.
    metaDescription: z.string().optional(),
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    sections: z.array(z.object({
      label: z.string(),
      // Small uppercase category tag shown above the label (e.g. "Main
      // competition"), and an optional one-line sub-heading shown below it.
      eyebrow: z.string().optional(),
      lede: z.string().optional(),
      winners: z.array(z.object({
        place: z.string(),
        title: z.string(),
        movieSlug: z.string().optional(),
        director: z.string().optional(),
        directorSlug: z.string().optional(),
        poster: z.string().optional(),
        // Structured prize amount (e.g. "$450,000"), kept separate from the
        // free-text `place` field so it can be displayed in its own box as
        // in the festival-detail mockup. Optional — most winners have no
        // verified amount.
        prize: z.string().optional(),
        notes: z.array(z.object({
          category: z.string(),
          title: z.string(),
          movieSlug: z.string().optional(),
          director: z.string().optional(),
          directorSlug: z.string().optional(),
        })).default([]),
      })),
    })).default([]),
  }),
});

// New collection for the /lists and /lists/[slug] pages. A "list" is a named,
// described grouping of existing movies. For this first pass, every list is
// either hand-picked or mechanically grouped by genre from existing data —
// there is no curated list-building tool yet, so several of these are
// explicitly placeholder groupings (see README for which ones and why).
const lists = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    // Short, one-line version of `description` for the homepage's "AI Film
    // Lists" card grid, which has no room for the full lead paragraph used
    // on the list's own /lists/[slug] page. Optional — a list without one
    // just shows its film count there, same as before this field existed.
    blurb: z.string().optional(),
    // SEO-only overrides for <title>/<meta description> (and OG/Twitter).
    // The visible h1 keeps using `name`, and the visible lead paragraph
    // keeps using `description` — these two fields only ever reach
    // <head>. Each falls back to its non-meta counterpart when unset.
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    // Flags a list as a temporary, mechanically-generated stand-in (e.g.
    // "every movie in genre X") rather than real editorial curation.
    placeholder: z.boolean().default(false),
    movies: z.array(z.string()).default([]), // movie slugs (content ids)
    // Short-drama slugs (content ids into the `shortdrama` collection).
    // Separate from `movies` because the two collections have different
    // schemas (episodes/platform vs. director/duration) — a list can mix
    // both, and /lists/[slug] resolves each kind from its own collection
    // and renders them with a shared set of fields rather than forcing
    // shortdrama entries into the movie schema.
    shortdramas: z.array(z.string()).default([]),
  }),
});

// AIMB Journal articles. Migrated from a hardcoded src/data/articles.ts
// array to a real content collection so new articles can be added as plain
// JSON files, the same way movies/awards/lists are, instead of editing a
// TypeScript source file. `body` holds the actual paragraphs to publish:
// every one of them is real reporting already vetted elsewhere in this
// project, not expanded with invented quotes or section headings. An
// article stays exactly as long as what's actually known — no padding to
// look like a longer piece.
const articles = defineCollection({
  type: 'data',
  schema: z.object({
    label: z.string(),
    date: z.string(),
    datetime: z.string(),
    title: z.string(),
    excerpt: z.string(),
    image: z.string().optional(),
    // Accessible alt text for `image` when it's more than a generic stand-in
    // for the headline — e.g. a custom hero graphic rather than a movie
    // poster. Falls back to `title` when unset, same as before this field
    // existed.
    imageAlt: z.string().optional(),
    // Caption under the hero image (photo credit, who/what is pictured) —
    // optional, only a handful of articles have a hero worth crediting.
    heroCaption: z.string().optional(),
    body: z.array(z.string()),
    // Richer long-form layout: section headings (with an auto-built "On
    // this page" sidebar), pull quotes, side-by-side character-consistency
    // image pairs, and a small comparison table — for a feature piece that
    // genuinely has that structure, rather than a short news item. When
    // present, the page renders these instead of the plain `body`
    // paragraphs; `body` stays required on every article so `excerpt`-style
    // consumers (related-article cards, RSS, search) always have plain text
    // to fall back on even for a contentBlocks article.
    contentBlocks: z.array(z.discriminatedUnion('type', [
      z.object({ type: z.literal('lead'), text: z.string() }),
      // Rendered with set:html (like rankedEntry paragraphs below) so a
      // paragraph can carry an inline <a>/<em>/<strong> — e.g. linking the
      // festival's own name straight to its AIMB awards page rather than
      // leaving the whole line as plain text.
      z.object({ type: z.literal('paragraph'), text: z.string() }),
      z.object({ type: z.literal('heading'), id: z.string(), text: z.string(), tocLabel: z.string().optional() }),
      z.object({ type: z.literal('quote'), text: z.string(), author: z.string() }),
      z.object({
        type: z.literal('characterComparisons'),
        characters: z.array(z.object({
          name: z.string(),
          subtitle: z.string(),
          frames: z.array(z.object({ image: z.string(), alt: z.string() })).length(2),
          caption: z.string(),
        })),
      }),
      z.object({
        type: z.literal('comparisonTable'),
        label: z.string(),
        columns: z.array(z.string()),
        rows: z.array(z.array(z.string())),
        note: z.string().optional(),
      }),
      z.object({ type: z.literal('note'), label: z.string().optional(), text: z.string() }),
      // "Inside this list" sidebar card for a ranked-list feature (see
      // rankedEntry below) — a short numbered table of contents plus an
      // optional note about how the ranking/figures work.
      z.object({
        type: z.literal('listSummary'),
        title: z.string(),
        items: z.array(z.string()),
        note: z.string().optional(),
      }),
      // One entry of a ranked list ("most popular AI series", etc.):
      // rank, title (optionally linking to the real movie/series page),
      // genre line, optional studio credit, a still, and its own
      // paragraphs. Rendered with alternating image-left/image-right
      // layout by position, same as the source design.
      z.object({
        type: z.literal('rankedEntry'),
        rank: z.number(),
        id: z.string().optional(),
        title: z.string(),
        href: z.string().optional(),
        genre: z.string(),
        studio: z.object({ name: z.string(), href: z.string().optional() }).optional(),
        image: z.string(),
        imageAlt: z.string(),
        imageHref: z.string().optional(),
        // 'landscape' (default) renders `image` full-width at 16:9, for a
        // wide movie/series still. 'poster' renders it as a small 2:3
        // poster beside the text instead — for lists built from catalog
        // poster art (e.g. shortdrama entries) rather than dedicated
        // landscape stills.
        mediaAspect: z.enum(['landscape', 'poster']).optional(),
        paragraphs: z.array(z.string()),
      }),
      // A row of headline figures (prize fund, submissions, countries) for
      // a festival-results piece — plain numbers, no commentary.
      z.object({
        type: z.literal('stats'),
        items: z.array(z.object({ value: z.string(), label: z.string() })),
      }),
      // The single top-prize film, called out on its own above the rest of
      // the winners grid. `href`/`image` always point at the real AIMB
      // movie page and catalog poster when the film is in the catalog —
      // never an external video-host thumbnail — so the card is a genuine
      // internal link rather than a dead end off the site.
      z.object({
        type: z.literal('filmSpotlight'),
        href: z.string(),
        image: z.string(),
        imageAlt: z.string(),
        awardLabel: z.string(),
        role: z.string(),
        title: z.string(),
        text: z.string(),
        linkLabel: z.string(),
      }),
      // The runner-up prizes, as a small grid of the same card shape as
      // filmSpotlight above.
      z.object({
        type: z.literal('filmGrid'),
        cards: z.array(z.object({
          href: z.string(),
          image: z.string(),
          imageAlt: z.string(),
          awardLabel: z.string(),
          role: z.string(),
          title: z.string(),
          text: z.string(),
          linkLabel: z.string(),
        })),
      }),
      // A lighter-weight grid for films mentioned in passing (e.g.
      // Honorable Mentions called out by name) rather than given a full
      // spotlight/grid card.
      z.object({
        type: z.literal('mentions'),
        items: z.array(z.object({
          href: z.string(),
          image: z.string(),
          imageAlt: z.string(),
          label: z.string(),
          title: z.string(),
          text: z.string(),
        })),
      }),
      // A single divider-styled link line (e.g. "see the rest of the
      // winners on AIMB's own awards page").
      z.object({ type: z.literal('linkBanner'), text: z.string(), href: z.string() }),
      // Closing call-to-action links (the external official results page,
      // AIMB's own awards directory, etc.).
      z.object({
        type: z.literal('cta'),
        links: z.array(z.object({ text: z.string(), href: z.string() })),
      }),
    ])).optional(),
    // The movie this article is about, when there is one in the catalog —
    // renders the "Featured film" aside linking to its real page/poster.
    featuredMovieSlug: z.string().optional(),
  }),
});

export const collections = { movies, creators, genres, studios, shortdrama, awards, lists, articles };
