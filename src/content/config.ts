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
    synopsis: z.string(),
    poster: z.string().optional(),
    youtubeId: z.string().optional(),
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
    films: z.array(z.string()).default([]),
    // Optional hero banner background for the genre page; most genres have
    // none and fall back to the plain dark hero.
    heroImage: z.string().optional(),
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
    // Flags a list as a temporary, mechanically-generated stand-in (e.g.
    // "every movie in genre X") rather than real editorial curation.
    placeholder: z.boolean().default(false),
    movies: z.array(z.string()).default([]), // movie slugs (content ids)
  }),
});

export const collections = { movies, creators, genres, studios, shortdrama, awards, lists };
