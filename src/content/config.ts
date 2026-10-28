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
  }),
});

const genres = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    films: z.array(z.string()).default([]),
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
    siteUrl: z.string().optional(),
    description: z.string(),
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    sections: z.array(z.object({
      label: z.string(),
      winners: z.array(z.object({
        place: z.string(),
        title: z.string(),
        movieSlug: z.string().optional(),
        director: z.string().optional(),
        directorSlug: z.string().optional(),
        poster: z.string().optional(),
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

export const collections = { movies, creators, genres, studios, shortdrama, awards };
