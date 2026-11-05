import type { CollectionEntry } from 'astro:content';

// Site rule: a creator or studio with only one film in the catalog doesn't
// get its own page — a profile with a single poster on it isn't worth a
// page, and it keeps every /name and /studios page meaningfully populated.
// Below this threshold, callers render the name as plain text instead of
// a link. Centralized here so every page that links to a creator or
// studio (movie sidebar, crew rows, awards winners, search index, the
// studios directory) agrees with getStaticPaths in name/[slug].astro and
// studios/[slug].astro about which pages actually exist.
export const MIN_FILMS_FOR_PAGE = 2;

// Exception to the one-film rule above: studios/creators named in an AIMB
// Journal article get a page even with just one film credited so far, so
// the article's own links actually go somewhere instead of rendering as
// plain text. 630-motion/mythra/neon-ridge-media/reality-foundry/
// mike-j-mitch were each checked against the pre-redesign site
// (aimoviebase.com), which already published a real profile page for them
// before this threshold existed here. serge-karloff has no such
// pre-redesign page (aimoviebase.com 404s for it) but was explicitly
// requested — see "Most Popular AI Series in 2026"
// (src/content/articles/most-popular-ai-series-2026.json).
const ALWAYS_PAGE_STUDIOS = new Set<string>([
  '630-motion',
  'mythra',
  'neon-ridge-media',
  'reality-foundry',
]);

const ALWAYS_PAGE_CREATORS = new Set<string>([
  'mike-j-mitch',
  'serge-karloff',
]);

export function creatorHasPage(creator: Pick<CollectionEntry<'creators'>, 'data' | 'id'> | undefined): boolean {
  if (!creator) return false;
  if (ALWAYS_PAGE_CREATORS.has(creator.id)) return true;
  return creator.data.films.length >= MIN_FILMS_FOR_PAGE;
}

export function studioHasPage(studio: Pick<CollectionEntry<'studios'>, 'data' | 'id'> | undefined): boolean {
  if (!studio) return false;
  if (ALWAYS_PAGE_STUDIOS.has(studio.id)) return true;
  return studio.data.films.length >= MIN_FILMS_FOR_PAGE;
}

// Looks up an explicit slug already stored on a movie/crew record (e.g.
// `director.slug`, a crew member's `slug`) and returns it only if that
// creator both exists and clears the one-film threshold — an explicit
// slug is not itself proof a page exists.
export function verifyCreatorSlug(
  slug: string | undefined,
  creators: CollectionEntry<'creators'>[]
): string | undefined {
  if (!slug) return undefined;
  const match = creators.find((c) => c.id === slug);
  return creatorHasPage(match) ? match!.id : undefined;
}

// Same idea as verifyCreatorSlug, for a studio slug stored directly on
// another record (e.g. a creator's `studio.slug`).
export function verifyStudioSlug(
  slug: string | undefined,
  studios: CollectionEntry<'studios'>[]
): string | undefined {
  if (!slug) return undefined;
  const match = studios.find((s) => s.id === slug);
  return studioHasPage(match) ? match!.id : undefined;
}

// Movies store director/studio as free-typed names (sometimes with an
// explicit `director.slug` back-reference, sometimes not — 24 of the 37
// movies in the catalog have no director.slug set even though a matching
// creator page exists, e.g. "Echo Hunter"'s director is typed as
// "Kavan Cardoza" while the creator's own record is named
// "Kavan Cardoza (Kavan the Kid)"). Resolving the link by matching names
// against the creators/studios collections — rather than requiring every
// movie record to carry a hand-maintained slug — means every movie whose
// director or studio has a real catalog page links to it automatically,
// including ones that would otherwise silently go unlinked.
function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function resolveCreatorSlug(
  directorName: string | undefined,
  creators: CollectionEntry<'creators'>[]
): string | undefined {
  if (!directorName) return undefined;
  const target = normalize(directorName);
  const match = creators.find((c) => {
    const name = normalize(c.data.name);
    if (name === target) return true;
    // "Kavan Cardoza" matches creator "Kavan Cardoza (Kavan the Kid)"
    if (name.startsWith(target + ' (')) return true;
    // "Shestak" matches creator "Nikolay Shestak" (last-word match)
    if (name.endsWith(' ' + target)) return true;
    return false;
  });
  return creatorHasPage(match) ? match!.id : undefined;
}

export function resolveStudioSlug(
  studioName: string | undefined,
  studios: CollectionEntry<'studios'>[]
): string | undefined {
  if (!studioName) return undefined;
  const target = normalize(studioName);
  const match = studios.find((s) => normalize(s.data.name) === target);
  return studioHasPage(match) ? match!.id : undefined;
}
