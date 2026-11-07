import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aimoviebase.com',
  output: 'static',
  // Matches vercel.json's "trailingSlash": false (Vercel strips/redirects
  // trailing slashes at serve time) so the sitemap, canonical tags and the
  // routing config all agree on one URL shape for every page.
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // Pages that are permanent 301 redirects, not real indexable content:
      // /genre/funny -> /genre/comedy (duplicate genre page from the
      // original site); the /news/* paths below are articles removed
      // from the AIMB Journal, kept only so old inbound links/bookmarks
      // land on the Journal index instead of a 404.
      filter: (page) => ![
        'https://aimoviebase.com/genre/funny',
        'https://aimoviebase.com/news/toys-r-us-sora',
        'https://aimoviebase.com/news/echo-hunter-sag-aftra',
        'https://aimoviebase.com/news/reset-solo-crew',
        'https://aimoviebase.com/news/the-mothers-monster-86-million-views',
      ].includes(page),
    }),
  ],
});
