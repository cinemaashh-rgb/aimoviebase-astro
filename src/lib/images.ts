import fs from 'node:fs';
import path from 'node:path';

// Landscape ("-wide") crop of a poster, when one exists on disk; falls back
// to the standard poster otherwise. Shared by the movie detail page's
// "More like this" strip and the homepage's "Notable" grid, both of which
// use the mockups' landscape thumbnail style rather than a tall poster crop.
export function widePoster(poster: string | undefined): string | undefined {
  if (!poster) return undefined;
  const wide = poster.replace(/\.webp$/, '-wide.webp');
  const onDisk = path.join(process.cwd(), 'public', wide.replace(/^\//, ''));
  return fs.existsSync(onDisk) ? wide : poster;
}
