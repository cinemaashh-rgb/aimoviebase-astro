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
      // /genre/funny is a 301 redirect to /genre/comedy (duplicate genre
      // page from the original site), not a real indexable page.
      filter: (page) => page !== 'https://aimoviebase.com/genre/funny',
    }),
  ],
});
