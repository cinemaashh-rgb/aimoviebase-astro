import type { CollectionEntry } from 'astro:content';

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
  return match?.id;
}

export function resolveStudioSlug(
  studioName: string | undefined,
  studios: CollectionEntry<'studios'>[]
): string | undefined {
  if (!studioName) return undefined;
  const target = normalize(studioName);
  const match = studios.find((s) => normalize(s.data.name) === target);
  return match?.id;
}
