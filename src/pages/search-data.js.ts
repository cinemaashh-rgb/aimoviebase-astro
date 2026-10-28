import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Single generated search index, replacing the original site's per-page
// duplicated `_OLD_DATA_UNUSED` arrays (every one of the ~111 original HTML
// pages embedded its own copy, each one a stale snapshot of the catalog at
// the moment that page was authored). This endpoint is prerendered at build
// time (output: 'static') into a real dist/search-data.js file, so there is
// no runtime cost and no server — just one array built from the actual
// content collections every time the site builds.
export const GET: APIRoute = async () => {
  const [movies, creators, studios, genres, shortdrama, awards] = await Promise.all([
    getCollection('movies'),
    getCollection('creators'),
    getCollection('studios'),
    getCollection('genres'),
    getCollection('shortdrama'),
    getCollection('awards'),
  ]);

  type Item = { title: string; href: string; sub: string; img?: string };
  const items: Item[] = [];

  for (const m of movies) {
    const d = m.data;
    const item: Item = {
      title: d.title,
      href: `/movies/${m.id}`,
      sub: `${d.type === 'series' ? 'Series' : 'Film'} · ${d.year}`,
    };
    if (d.poster) item.img = d.poster;
    items.push(item);
  }

  for (const c of creators) {
    const item: Item = {
      title: c.data.name,
      href: `/name/${c.id}`,
      sub: c.data.role || 'AI Director',
    };
    if (c.data.photo) item.img = c.data.photo;
    items.push(item);
  }

  for (const s of studios) {
    items.push({ title: s.data.name, href: `/studios/${s.id}`, sub: 'Studio' });
  }

  for (const g of genres) {
    items.push({ title: g.data.name, href: `/genre/${g.id}`, sub: 'Genre' });
  }

  for (const sd of shortdrama) {
    if (sd.data.status !== 'published') continue;
    const item: Item = {
      title: sd.data.title,
      href: `/shortdrama/${sd.id}`,
      sub: `Vertical Drama · ${sd.data.episodes} episodes`,
    };
    if (sd.data.poster) item.img = sd.data.poster;
    items.push(item);
  }

  for (const a of awards) {
    items.push({ title: a.data.name, href: `/awards/${a.id}`, sub: 'Award' });
  }

  // Static guide/catalog pages that have no content collection of their own.
  items.push(
    { title: 'AI Movies', href: '/movies', sub: 'Catalog' },
    { title: 'AI Short Drama', href: '/shortformdrama', sub: 'Catalog' },
    { title: 'Studios', href: '/studios', sub: 'Catalog' },
    { title: 'Awards & Festivals', href: '/awards', sub: 'Guide' },
    { title: 'News & Editorial', href: '/news', sub: 'Guide' },
    { title: 'Lists', href: '/lists', sub: 'Guide' },
  );

  const body = `var DATA = ${JSON.stringify(items)};\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  });
};
