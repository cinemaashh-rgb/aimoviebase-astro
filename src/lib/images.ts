import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

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

// Real intrinsic pixel dimensions of a local /public asset, read from the
// file's own header at build time (no decoding, so this is cheap) — used
// to set real width/height attributes on <img> tags rather than guessing a
// "usual" poster size, since widePoster() above can hand back either a
// 16:9 "-wide" crop or a 2:3 portrait fallback for the same call, and
// photos/logos/article images aren't a fixed size at all. Returns
// undefined for anything not found on disk (e.g. a remote URL), so callers
// can omit the attributes rather than render wrong ones.
const dimsCache = new Map<string, { width: number; height: number } | undefined>();
export function imageDims(src: string | undefined): { width: number; height: number } | undefined {
  if (!src) return undefined;
  if (dimsCache.has(src)) return dimsCache.get(src);
  const onDisk = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
  let result: { width: number; height: number } | undefined;
  try {
    const buf = fs.readFileSync(onDisk);
    const { width, height } = imageSize(buf);
    if (width && height) result = { width, height };
  } catch {
    result = undefined;
  }
  dimsCache.set(src, result);
  return result;
}
